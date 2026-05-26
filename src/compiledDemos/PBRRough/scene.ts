import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createPbrRoughScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 45, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    for (let index = 0; index < 7; index++) {
        const sphere = CreateSphere(`rough${index}`, { segments: 32, diameter: 5 }, scene);
        sphere.position.x = index * 6 - 18;
        const material = new PBRMaterial(`roughMat${index}`, scene);
        material.albedoColor = new Color3(0.75, 0.82, 1);
        material.metallic = 0.8;
        material.roughness = index / 6;
        sphere.material = material;
    }
    return scene;
}
