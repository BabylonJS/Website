import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { SharpenPostProcess } from "@babylonjs/core/PostProcesses/sharpenPostProcess";
import { Scene } from "@babylonjs/core/scene";

export function createStandardRenderingPipelineScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 18, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    new SharpenPostProcess("sharpen", 1, camera).edgeAmount = 0.8;
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(0.9, 0.45, 0.2);
    const box = CreateBox("box", { size: 5 }, scene);
    box.material = material;
    scene.registerBeforeRender(() => {
        box.rotation.y += 0.012 * scene.getAnimationRatio();
        box.rotation.x += 0.007 * scene.getAnimationRatio();
    });
    return scene;
}
