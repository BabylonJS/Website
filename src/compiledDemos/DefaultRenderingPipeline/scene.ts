import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { FxaaPostProcess } from "@babylonjs/core/PostProcesses/fxaaPostProcess";
import { SharpenPostProcess } from "@babylonjs/core/PostProcesses/sharpenPostProcess";
import { Scene } from "@babylonjs/core/scene";

export function createDefaultRenderingPipelineScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 20, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    new FxaaPostProcess("fxaa", 1, camera);
    const sharpen = new SharpenPostProcess("sharpen", 1, camera);
    sharpen.edgeAmount = 0.45;
    sharpen.colorAmount = 0.9;
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(0.2, 0.6, 1);
    material.emissiveColor = new Color3(0.1, 0.25, 0.6);
    const sphere = CreateSphere("sphere", { segments: 48, diameter: 7 }, scene);
    sphere.material = material;
    return scene;
}
