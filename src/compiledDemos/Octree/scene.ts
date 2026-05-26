import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Culling/Octrees/octreeSceneComponent";

let seed = 1337;
function random(): number {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
}

export function createOctreeScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    seed = 1337;
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 25, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(-10, 10, 0));
    camera.attachControl(canvas, true);
    new PointLight("Omni0", new Vector3(0, 10, 0), scene);

    const material = new StandardMaterial("sphereMaterial", scene);
    material.diffuseColor = new Color3(0.5, 0.5, 0.5);
    material.specularColor = Color3.White();
    material.specularPower = 32;
    material.checkReadyOnEveryCall = false;

    const source = CreateSphere("sphere0", { segments: 16, diameter: 1 }, scene);
    source.material = material;
    const size = 50;
    for (let index = 0; index < 1200; index++) {
        const clone = source.clone(`sphere${index + 1}`, null, true);
        if (!clone) {
            continue;
        }
        const scale = random() * 0.8 + 0.6;
        clone.scaling = new Vector3(scale, scale, scale);
        clone.position = new Vector3(
            random() * 2 * size - size,
            random() * 2 * size - size,
            random() * 2 * size - size
        );
    }
    source.setEnabled(false);
    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogDensity = 0.05;
    scene.createOrUpdateSelectionOctree();
    return scene;
}
