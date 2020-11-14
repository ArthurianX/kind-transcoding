import { TimelineLite, Expo, Back } from 'gsap';
import Simulation from './simulation';
import SimulationShader from './simulationShader';
import RenderShader from './renderShader';

import * as THREE from 'three';

// tell the preloader to include these assets
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading

const meshes = {
    landing: { scale: 1.0, yOffset: -2.3, url: '/assets/models/spaceman-30k.glb' },
    about: { scale: 1.0, yOffset: -2.3, url: '/assets/models/gogo-60k.glb' },
    nike: { scale: 1.0, yOffset: -2.0, url: '/assets/models/nike-30k.glb' },
    gogo: { scale: 1.0, yOffset: -2.0, url: '/assets/models/gogo-60k.glb' },
    msi: { scale: 1.0, yOffset: -2.0, url: '/assets/models/u505-30k.glb' },
    beyonce: { scale: 1.0, yOffset: -2.0, url: '/assets/models/beyonce-30k.glb' },
    jordan: { scale: 1.0, yOffset: -2.0, url: '/assets/models/jumpman-30k.glb' },
};

// for (const mesh in meshes) {
//     const assetKey = assets.queue({
//         url: meshes[mesh].url,
//         key: mesh,
//     });
// }

export default class Particles extends THREE.Object3D {
    children = [];
    scene = null;
    transition = null;
    size = 512;
    simulationShader = null;
    renderShader = null;
    simulation = null;
    enableMouseMove = true;
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    curlX = this.mouseX;
    curlY = this.mouseY;
    mouseEase = 0.3;
    private animSwitch: any;
    private inDistance: any;
    private inOpacity: any;
    private outDistance: any;
    private outOpacity: any;

    constructor(renderer, camera) {
        super();
        this.simulationShader = new SimulationShader({ width: 800, height: 600, camera });
        this.renderShader = new RenderShader({});
        this.simulation = new Simulation(this.size, renderer, this.simulationShader, this.renderShader);
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.curlX = this.mouseX;
        this.curlY = this.mouseY;

        // setup  a light
        // this.light = new THREE.AmbientLight(0xffffff);
        // this.add(this.light);

        this.add(this.simulation.particles);
        // TODO: Listen to events
        // window.addEventListener('mousemove', this.onMouseMove);
    }

    /**
     * getModel method
     */
    setModel(key): void {
        // now fetch the loaded resource
        const gltf = key;

        const self = this;

        // Replaces all meshes material with something basic
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                // set scale
                // this.simulationShader.uniforms.scale.value = meshes[key].scale;

                // set data texture
                self.setDataTexture(child);
                //   child.material = new THREE.MeshNormalMaterial();
                //   // ThreeJS attaches something odd here on GLTF ipmport
                //   child.onBeforeRender = () => {};
                //   this.children.push(child);
            }
        });
    }

    /**
     * setDataTexture method
     */
    setDataTexture(model): void {
        const data = model.geometry.getAttribute('position');
        const size = Math.sqrt(data.count);

        const texture = new THREE.DataTexture(
            data.array,
            size,
            size,
            THREE.RGBFormat,
            THREE.FloatType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
        );
        texture.needsUpdate = true;

        if (this.transition === 1) {
            this.simulationShader.uniforms.textureA.value = texture;
            this.transition = 0;
        } else {
            this.simulationShader.uniforms.textureB.value = texture;
            this.transition = 1;
        }

        // animate.fromTo(
        //   this.simulationShader.uniforms.maxDistance,
        //   1,
        //   { value: 64 },
        //   { value: 16, yoyo: true, repeat: 1, ease: Expo.easeInOut }
        // );

        // animate.to(this.simulationShader.uniforms.transition, 3, {
        //   value: this.transition,
        //   ease: Expo.easeInOut
        // });

        this.animSwitch = new TimelineLite({ paused: true }).to(this.simulationShader.uniforms.transition, 1.5, {
            value: this.transition,
            ease: Expo.easeInOut,
        });
        this.animSwitch.play();
    }

    // TODO: this is somewhat like ngOnUpdate
    onAppDidUpdate(sceneName, explode): void {
        // NOTE: This should be called whenever we want to update the state of the animation.
        if (sceneName) {
            this.scene = sceneName;
            this.setModel(this.scene);
            this.renderShader.setColor('#23152c', '#bd0000');
        }

        // console.log(`oldstate.explode: ${oldState.explode}`, `newState.explode: ${newState.explode}`);

        if (explode === true) {
            this.explode();
        }

        if (explode === false) {
            this.contract();
        }
    }

    contract(
        opt = {
            delay: undefined,
        },
    ): void {
        this.inDistance = new TimelineLite({ paused: true }).to(this.simulationShader.uniforms.maxDistance, 1, {
            delay: opt.delay,
            value: 4,
            ease: Expo.easeOut,
        });

        this.inOpacity = new TimelineLite({ paused: true }).to(this.renderShader.uniforms.opacity, 1, {
            delay: opt.delay,
            value: 1.0,
            ease: Expo.easeOut,
        });

        this.inDistance.play();
        this.inOpacity.play();
        this.enableMouseMove = true;
        // TODO: How to autorotate, pass scene ? WTF am I doing here ?
        // webgl.controls.autoRotate = true;
    }

    explode(
        opt = {
            delay: undefined,
        },
    ): void {
        this.outDistance = new TimelineLite({ paused: true }).to(this.simulationShader.uniforms.maxDistance, 1, {
            delay: opt.delay,
            value: 512,
            ease: Expo.easeOut,
        });

        this.outOpacity = new TimelineLite({ paused: true }).to(this.renderShader.uniforms.opacity, 1, {
            delay: opt.delay,
            value: 0.5,
            ease: Expo.easeOut,
        });

        this.outDistance.play();
        this.outOpacity.play();
        this.enableMouseMove = false;
        // TODO: How to autorotate, pass scene ? WTF am I doing here ?
        //   webgl.controls.autoRotate = false;
    }

    update(dt = 0, time = 0): void {
        this.simulation.update();
        this.simulationShader.update();

        this.curlX += (this.mouseX - this.curlX) * 0.1;
        this.curlY += (this.mouseY - this.curlY) * 0.1;

        if (this.enableMouseMove) {
            this.simulationShader.uniforms.cursorPos.value = new THREE.Vector2(this.curlX, this.curlY);
        }
    }

    onMouseMove(ev, pos): void {
        this.mouseX = ev.pageX;
        this.mouseY = ev.pageY;
    }

    onTouchStart(ev, pos): void {}

    onTouchMove(ev, pos): void {
        this.mouseX = ev.originalEvent.touches[0].pageX;
        this.mouseY = ev.originalEvent.touches[0].pageY;
    }

    onTouchEnd(ev, pos): void {}
}
