import * as THREE from 'three';

export default class Simulation {
    height = 0;
    width = 0;
    renderer = null;
    simMat = null;
    renderMat = null;
    rtScene = null;
    rtCamera = null;
    rtTexturePos = null;
    particles = null;
    targets: any[] = [];

    constructor(size, renderer, simMat, renderMat) {
        this.height = size;
        this.width = size;
        this.renderer = renderer;
        this.simMat = simMat;
        this.renderMat = renderMat;

        this.rtScene = null;
        this.rtCamera = null;
        this.rtTexturePos = null;
        this.particles = null;

        this.init();
    }

    init(): any {
        const gl = this.renderer.getContext();

        // 1. check support of FLOAT textures (to store positions)
        if (!gl.getExtension('OES_texture_float')) {
            throw new Error('float textures not supported');
        }

        // 2. check support of textures access from within a vertex shader
        if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0) {
            throw new Error('vertex shader cannot read textures');
        }

        // 3. Render To Texture setup
        this.rtScene = new THREE.Scene();
        this.rtCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const floatType = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;

        // 4. create a target texture
        const options = {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: floatType,
            stencilBuffer: false,
            depthBuffer: false,
            generateMipmaps: false,
        };
        this.rtTexturePos = new THREE.WebGLRenderTarget(this.width, this.height, options);

        this.targets = [this.rtTexturePos, this.rtTexturePos.clone()];

        // 5. the simulation
        // create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
        const geom = new THREE.BufferGeometry();
        geom.addAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]),
                3,
            ),
        );
        geom.addAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), 2));
        this.rtScene.add(new THREE.Mesh(geom, this.simMat));

        // 6. the particles
        // create a vertex buffer of size width * height with normalized coordinates
        const l = this.width * this.height;
        const vertices = new Float32Array(l * 3);
        for (let i = 0; i < l; i++) {
            const i3 = i * 3;
            vertices[i3] = (i % this.width) / this.width;
            vertices[i3 + 1] = i / this.width / this.height;
        }
        // create the particles geometry
        const pGeom = new THREE.BufferGeometry();
        pGeom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // the rendermaterial is used to render the particles
        this.particles = new THREE.Points(pGeom, this.renderMat);
    }

    update(): void {
        // 1. update the simulation and render the result in a target texture
        this.renderer.render(this.rtScene, this.rtCamera, this.rtTexturePos, true);

        // 2. use the result of the swap as the new position for the particles renderer
        this.particles.material.uniforms.positions.value = this.rtTexturePos.texture;
    }
}
