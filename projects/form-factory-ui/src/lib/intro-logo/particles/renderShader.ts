import * as THREE from 'three';
import { TweenMax } from 'gsap';

const pointSize = 3;
const nearFar = new THREE.Vector2(-5, 15);

export default class RenderShader extends THREE.ShaderMaterial {
    constructor(options) {
        super(options);

        this.vertexShader = 'assets/shaders/particles/render.vert';
        this.fragmentShader = 'assets/shaders/particles/render.frag';
        this.transparent = true;
        this.side = THREE.DoubleSide;
        // this.blending = THREE.AdditiveBlending;
        this.blending = THREE.NoBlending;

        this.uniforms = {
            positions: { type: 't', value: null },
            pointSize: { type: 'f', value: pointSize },
            nearFar: { type: 'v2', value: nearFar },
            color1: { type: 'c', value: new THREE.Color(0x444444) },
            color2: { type: 'c', value: new THREE.Color(0x000000) },
            hardness: { type: 'f', value: 0.5 },
            opacity: { type: 'f', value: 1.0 },
        } as any;
    }

    setColor(primaryColor, secondaryColor): void {
        // tslint:disable-next-line:radix
        const formattedPrimaryColor = parseInt('0x' + primaryColor.replace(/\#/g, ''));
        // tslint:disable-next-line:radix
        const formattedSecondaryColor = parseInt('0x' + secondaryColor.replace(/\#/g, ''));

        const color1 = new THREE.Color(formattedPrimaryColor);
        const color2 = new THREE.Color(formattedSecondaryColor);

        TweenMax.to(this.uniforms.color1.value, 2.5, {
            r: color1.r,
            g: color1.g,
            b: color1.b,
        });
        TweenMax.to(this.uniforms.color2.value, 2.5, {
            r: color2.r,
            g: color2.g,
            b: color2.b,
        });
    }

    update(time): void {}
}
