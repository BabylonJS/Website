import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createPostProcessBloomScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 65, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new DirectionalLight("dir01", new Vector3(0, -1, -0.2), scene).intensity = 0.6;
    new DirectionalLight("dir02", new Vector3(-1, -2, -1), scene).intensity = 0.6;

    const glow = new GlowLayer("glow", scene, { blurKernelSize: 32 });
    glow.intensity = 0.9;

    const white = new StandardMaterial("white", scene);
    white.diffuseColor = Color3.Black();
    white.specularColor = Color3.Black();
    white.emissiveColor = Color3.White();
    const red = new StandardMaterial("red", scene);
    red.diffuseColor = Color3.Black();
    red.specularColor = Color3.Black();
    red.emissiveColor = new Color3(1, 0, 0);

    const sphere0 = CreateSphere("Sphere0", { segments: 16, diameter: 10 }, scene);
    const sphere1 = CreateSphere("Sphere1", { segments: 16, diameter: 10 }, scene);
    const sphere2 = CreateSphere("Sphere2", { segments: 16, diameter: 10 }, scene);
    const cube = CreateBox("Cube", { size: 10 }, scene);
    sphere0.material = white;
    sphere1.material = white;
    sphere2.material = white;
    cube.material = red;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        sphere0.position.set(20 * Math.sin(alpha), 0, 20 * Math.cos(alpha));
        sphere1.position.set(20 * Math.sin(alpha), 0, -20 * Math.cos(alpha));
        sphere2.position.set(20 * Math.cos(alpha), 0, 20 * Math.sin(alpha));
        cube.rotation.y += 0.01 * scene.getAnimationRatio();
        cube.rotation.z += 0.01 * scene.getAnimationRatio();
        alpha += 0.01 * scene.getAnimationRatio();
    });

    return scene;
}
