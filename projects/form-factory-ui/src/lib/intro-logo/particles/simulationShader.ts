import * as THREE from 'three';
/**
 * SimulationShader class
 */

export default class SimulationShader extends THREE.ShaderMaterial {
    constructor(options) {
        super(options);

        this.vertexShader = 'assets/shaders/particles/simulation.vert';
        this.fragmentShader = 'assets/shaders/particles/simulation.frag';

        this.uniforms = {
            textureA: { type: 't', value: null },
            textureB: { type: 't', value: null },
            timer: { type: 'f', value: 0 },
            transition: { type: 'f', value: 1 },
            frequency: { type: 'f', value: 0.1 },
            amplitude: { type: 'f', value: 2.0 },
            maxDistance: { type: 'f', value: 3.0 },
            scale: {
                type: 'f',
                value: 0.65,
            },
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(options.width, options.height),
            },
            cursorPos: {
                type: 'v2',
                value: new THREE.Vector2(0, 0),
            },
            mouseStrength: {
                type: 'f',
                value: 1.0,
            },
            pm: {
                type: 'm4',
                value: options.camera.projectionMatrix,
            },
            vm: {
                type: 'm4',
                value: options.camera.matrixWorldInverse,
            },
        } as any;
    }

    update(time?): void {
        this.uniforms.timer.value += 0.01;
    }
}
