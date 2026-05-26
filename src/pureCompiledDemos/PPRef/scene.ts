import {
    ArcRotateCamera,
    Color3,
    CreateSphere,
    DirectionalLight,
    type Engine,
    RefractionPostProcess,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/refraction.fragment";

export function createPostProcessRefractionScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 80, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new DirectionalLight("dir01", new Vector3(0, -1, -0.2), scene).intensity = 0.6;
    new DirectionalLight("dir02", new Vector3(-1, -2, -1), scene).intensity = 0.6;
    new RefractionPostProcess("Refraction", "/Demos/PPRef/refMap.jpg", Color3.White(), 0.5, 0.5, 1, camera);

    const materials = [new Color3(1, 0, 0), new Color3(0, 1, 0), new Color3(0, 0, 1)].map((color, index) => {
        const material = new StandardMaterial(`mat${index}`, scene);
        material.specularColor = Color3.Black();
        material.diffuseColor = color;
        return material;
    });
    const sphere0 = CreateSphere("Sphere0", { segments: 16, diameter: 10 }, scene);
    const sphere1 = CreateSphere("Sphere1", { segments: 16, diameter: 10 }, scene);
    const sphere2 = CreateSphere("Sphere2", { segments: 16, diameter: 10 }, scene);
    sphere0.material = materials[0];
    sphere1.material = materials[1];
    sphere2.material = materials[2];

    let alpha = 0;
    scene.registerBeforeRender(() => {
        sphere0.position.set(20 * Math.sin(alpha), 0, 20 * Math.cos(alpha));
        sphere1.position.set(20 * Math.sin(alpha), 0, -20 * Math.cos(alpha));
        sphere2.position.set(20 * Math.cos(alpha), 0, 20 * Math.sin(alpha));
        alpha += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
