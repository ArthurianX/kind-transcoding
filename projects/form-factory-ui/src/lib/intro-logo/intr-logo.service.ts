import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import TWEEN from '@tweenjs/tween.js';
import Particles from 'projects/form-factory-ui/src/lib/intro-logo/particles';

@Injectable({ providedIn: 'root' })
export class IntroLogoService implements OnDestroy {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private light: THREE.AmbientLight;

    private morphCube: THREE.Mesh | THREE.Points;

    private frameId: number = null;
    private particles: Particles;

    public constructor(private ngZone: NgZone) {}

    public ngOnDestroy(): void {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true, // transparent background
            antialias: true, // smooth edges
        });
        this.renderer.setSize(800, 600);

        // create the scene
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, 800 / 600, 0.1, 1000);
        this.camera.position.z = 5;
        this.scene.add(this.camera);

        // soft white light
        this.light = new THREE.AmbientLight(0x404040);
        this.light.position.z = 10;
        this.scene.add(this.light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.setScalar(10);
        this.scene.add(directionalLight);

        /* New stuff comes below */
        this.particles = new Particles(this.renderer, this.camera);

        // TODO: Add the renderer setttings, postprocessing module and effects componse from austimayer_reverse_engineered/src/webgl/WebGLApp.js
    }

    public animate(canvasForSizing): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
            });
        });
    }

    public render(): void {
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });

        // Initial morph cube stuff.
        if (this.morphCube) {
            this.morphCube.rotation.x += 0.01;
            this.morphCube.rotation.y += 0.01;
        }

        // @ts-ignore
        TWEEN.update(); // - Updates how the morphing is happening
        this.renderer.render(this.scene, this.camera);
    }

    public resize(): void {
        const width = 800;
        const height = 600;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    public createInitialMorphScene(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true, // transparent background
            antialias: true, // smooth edges
        });
        this.renderer.setSize(800, 600);

        // create the scene
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, 800 / 600, 0.1, 1000);
        this.camera.position.z = 5;
        this.scene.add(this.camera);

        // soft white light
        this.light = new THREE.AmbientLight(0x404040);
        this.light.position.z = 10;
        this.scene.add(this.light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.setScalar(10);
        this.scene.add(directionalLight);

        const mgeometry = this.createGeometry();

        const pointsMaterial = new THREE.PointsMaterial({
            size: 5,
            sizeAttenuation: false,
            // map: sprite,
            alphaTest: 0.5,
            transparent: true,
        });
        pointsMaterial.color.setHSL(1.0, 1, 0.7);

        this.morphCube = new THREE.Points(mgeometry, pointsMaterial);

        this.scene.add(this.morphCube);

        // @ts-ignore
        const tweenHeart = new TWEEN.Tween(this.morphCube.morphTargetInfluences)
            .to(
                {
                    0: 1,
                },
                1000,
            )
            .delay(500)
            .yoyo(true)
            .repeat(Infinity);

        // @ts-ignore
        tweenHeart.start();
    }

    private createGeometry(): THREE.BoxBufferGeometry {
        const geometry = new THREE.BoxBufferGeometry(2, 2, 2, 32, 32, 32);

        // create an empty array to  hold targets for the attribute we want to morph
        // morphing positions and normals is supported
        geometry.morphAttributes.position = [];

        // the original positions of the cube's vertices
        const positions = geometry.attributes.position.array;

        // for the first morph target we'll move the cube's vertices onto the surface of a sphere
        const spherePositions = [];

        // for the second morph target, we'll twist the cubes vertices
        const twistPositions = [];
        const direction = new THREE.Vector3(1, 0, 0).normalize();
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            spherePositions.push(
                x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
                y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
                z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3),
            );

            // stretch along the x-axis so we can see the twist better
            vertex.set(x * 2, y, z);

            vertex.applyAxisAngle(direction, (Math.PI * x) / 2).toArray(twistPositions, twistPositions.length);
        }

        // add the spherical positions as the first morph target
        geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

        // add the twisted positions as the second morph target
        geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

        return geometry;
    }
}
