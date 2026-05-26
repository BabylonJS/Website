import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";
import { FurMaterial } from "@babylonjs/materials/fur/furMaterial";

export function createFurScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 12, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const sphere = CreateSphere("furry", { segments: 48, diameter: 5 }, scene);
    const fur = new FurMaterial("fur", scene);
    fur.diffuseColor = new Color3(0.85, 0.55, 0.28);
    fur.furColor = new Color3(0.95, 0.75, 0.45);
    fur.furLength = 0.8;
    fur.furDensity = 18;
    fur.furTexture = FurMaterial.GenerateTexture("furTexture", scene);
    sphere.material = fur;
    FurMaterial.FurifyMesh(sphere, 10);
    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
