import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

export function createAdvancedShadowsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 3, 28, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new DirectionalLight("shadowLight", new Vector3(-0.6, -1, -0.4), scene);
    light.position = new Vector3(20, 40, 20);
    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 16;
    const ground = CreateGround("ground", { width: 36, height: 36 }, scene);
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new Color3(0.45, 0.55, 0.45);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    const boxMaterial = new StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new Color3(0.85, 0.5, 0.25);
    for (let index = 0; index < 8; index++) {
        const box = CreateBox(`box${index}`, { size: 2.5 }, scene);
        box.position.set((index % 4) * 6 - 9, 1.25, Math.floor(index / 4) * 8 - 4);
        box.rotation.y = index * 0.35;
        box.material = boxMaterial;
        shadowGenerator.addShadowCaster(box);
    }
    return scene;
}
