import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Scene } from "@babylonjs/core/scene";

const particleTextureUrl = "/Scenes/WorldMonger/Assets/Flare.png";

Effect.ShadersStore.myParticleFragmentShader = `
#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUV;
varying vec4 vColor;
uniform sampler2D diffuseSampler;
uniform float time;
void main(void) {
    vec2 position = vUV;
    float color = 0.0;
    vec2 center = vec2(0.5, 0.5);
    color = sin(distance(position, center) * 10.0 + time * vColor.g);
    vec4 baseColor = texture2D(diffuseSampler, vUV);
    gl_FragColor = baseColor * vColor * vec4(vec3(color, color, color), 1.0);
}`;

export function createParticles2Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.95;
    camera.lowerRadiusLimit = 5;
    camera.attachControl(canvas, true);

    const emitter0 = CreateBox("emitter0", { size: 0.1 }, scene);
    emitter0.isVisible = false;

    const effect = engine.createEffectForParticles("myParticle", ["time"], [], "");

    const particleSystem = new ParticleSystem("particles", 4000, scene, effect);
    particleSystem.particleTexture = new Texture(particleTextureUrl, scene);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 1.0;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 5.0;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 3.0;
    particleSystem.emitter = emitter0;
    particleSystem.emitRate = 100;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.direction1 = new Vector3(-1, 1, -1);
    particleSystem.direction2 = new Vector3(1, 1, 1);
    particleSystem.color1 = new Color4(1, 1, 0, 1);
    particleSystem.color2 = new Color4(1, 0.5, 0, 1);
    particleSystem.gravity = new Vector3(0, -1.0, 0);
    particleSystem.start();

    let time = 0;
    let order = 0.1;
    scene.registerBeforeRender(() => {
        if (!effect) {
            return;
        }
        effect.setFloat("time", time);
        time += order;
        if (time > 100 || time < 0) {
            order *= -1;
        }
    });

    return scene;
}
