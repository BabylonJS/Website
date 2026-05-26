import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateSphere,
    type Engine,
    PBRMaterial,
    PointLight,
    Scene,
    Vector3,
} from "@babylonjs/core/pure";
export function createPbrScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 140, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new PointLight("point", new Vector3(0, 60, 0), scene);
    const colors = [new Color3(0.85, 0.85, 0.85), new Color3(0.01, 0.01, 0.01), new Color3(0.206, 0.94, 1)];
    const metalness = [0, 1, 0.1];
    for (let index = 0; index < 3; index++) {
        const sphere = CreateSphere(`sphere${index}`, { segments: 48, diameter: 24 }, scene);
        sphere.position.x = (index - 1) * 36;
        const material = new PBRMaterial(`pbr${index}`, scene);
        material.albedoColor = colors[index];
        material.metallic = metalness[index];
        material.roughness = 0.18 + index * 0.25;
        sphere.material = material;
    }
    const plinth = CreateBox("plinth", { width: 110, height: 1, depth: 35 }, scene);
    plinth.position.y = -14;
    const plinthMaterial = new PBRMaterial("plinthMaterial", scene);
    plinthMaterial.albedoColor = new Color3(0.42, 0.26, 0.16);
    plinthMaterial.roughness = 0.45;
    plinth.material = plinthMaterial;
    return scene;
}
