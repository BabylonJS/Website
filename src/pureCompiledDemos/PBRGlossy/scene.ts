import {
    ArcRotateCamera,
    Color3,
    CreateSphere,
    type Engine,
    HemisphericLight,
    PBRMaterial,
    PointLight,
    Scene,
    Vector3,
} from "@babylonjs/core/pure";
export function createPbrGlossyScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 42, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("fill", new Vector3(0, 1, 0), scene).intensity = 0.7;
    new PointLight("point", new Vector3(0, 30, -20), scene).intensity = 1.4;
    for (let index = 0; index < 5; index++) {
        const sphere = CreateSphere(`glossy${index}`, { segments: 48, diameter: 6 }, scene);
        sphere.position.x = index * 8 - 16;
        const material = new PBRMaterial(`glossyMat${index}`, scene);
        material.albedoColor = new Color3(0.9, 0.85, 0.75);
        material.metallic = 0.25;
        material.roughness = 0.04 + index * 0.08;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 1;
        sphere.material = material;
    }
    return scene;
}
