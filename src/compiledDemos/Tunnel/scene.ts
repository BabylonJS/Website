import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { Scene } from "@babylonjs/core/scene";

Effect.ShadersStore.tunnelppFragmentShader = `
precision highp float;
varying vec2 vUV;
uniform sampler2D tunnelSampler;
uniform float time;
void main(void) {
    vec2 position = -1.0 + 2.0 * vUV;
    vec2 uv;
    float r = sqrt(dot(position, position));
    float a = atan(position.y, position.x) + 0.9 * sin(0.5 * r - 0.5 * time);
    float h = (0.5 + 0.5 * sin(9.0 * a));
    float s = smoothstep(0.4, 0.5, h);
    uv.x = time + 1.0 / (r + 0.1 * s);
    uv.y = 3.0 * a / 3.1416;
    vec3 col = texture2D(tunnelSampler, uv).xyz;
    float ao = smoothstep(0.0, 0.3, h) - smoothstep(0.5, 1.0, h);
    col *= 1.0 - 0.6 * ao * r;
    col *= r * r;
    gl_FragColor = vec4(col, 1.0);
}`;

export function createTunnelScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);

    const camera = new ArcRotateCamera("Camera", 0, Math.PI / 2, 400, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new PointLight("light1", new Vector3(0, 0, 10), scene);
    light.position = camera.position;

    const tunnelTexture = new Texture("/Demos/Tunnel/Inundation.jpg", scene);

    const tunnelShader = new PostProcess("Tunnel", "tunnelpp", ["time"], ["tunnelSampler"], 0.9, camera);

    let time = 0.0;
    tunnelShader.onApply = (effect) => {
        effect.setFloat("time", time / 5.0);
        if (tunnelTexture.isReady()) {
            effect.setTexture("tunnelSampler", tunnelTexture);
        }
        time += 0.1;
    };

    return scene;
}
