import {
    ArcRotateCamera,
    Color3,
    CreateSphere,
    type Engine,
    GlowLayer,
    PBRMaterial,
    PointLight,
    Scene,
    Vector3,
} from "@babylonjs/core/pure";
export function createPbrGlossyBloomScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 36, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new PointLight("point", new Vector3(0, 35, -15), scene);
    new GlowLayer("glow", scene).intensity = 0.8;
    for (let index = 0; index < 4; index++) {
        const sphere = CreateSphere(`bloom${index}`, { segments: 48, diameter: 6 }, scene);
        sphere.position.x = index * 8 - 12;
        const material = new PBRMaterial(`bloomMat${index}`, scene);
        material.albedoColor = new Color3(0.2 + index * 0.2, 0.6, 1);
        material.emissiveColor = new Color3(index * 0.2, 0.25, 0.6);
        material.roughness = 0.08;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 1;
        sphere.material = material;
    }
    return scene;
}
