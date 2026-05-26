import {
    ArcRotateCamera,
    BlurPostProcess,
    Color3,
    CreateGround,
    CreateSphere,
    type Engine,
    HemisphericLight,
    Scene,
    StandardMaterial,
    Vector2,
    Vector3,
} from "@babylonjs/core/pure";
export function createDofScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const light = new HemisphericLight("omni", new Vector3(0, 1, 0.1), scene);
    light.diffuse = new Color3(0.1, 0.1, 0.17);
    const warmLight = new HemisphericLight("warm", new Vector3(1, -0.75, 0.25), scene);
    warmLight.diffuse = new Color3(0.95, 0.7, 0.4);

    const camera = new ArcRotateCamera("Camera", 0, 1.3, 80, new Vector3(0, 10, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 1;
    camera.maxZ = 2000;

    new BlurPostProcess("horizontalDofBlur", new Vector2(1, 0), 0.8, 0.5, camera);
    new BlurPostProcess("verticalDofBlur", new Vector2(0, 1), 0.8, 0.5, camera);

    const ground = CreateGround("ground", { width: 300, height: 300, subdivisions: 2 }, scene);
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new Color3(0.3, 0.3, 0.4);
    groundMaterial.specularColor = new Color3(0.04, 0.04, 0.04);
    ground.material = groundMaterial;

    const material = new StandardMaterial("skullStandIn", scene);
    material.diffuseColor = new Color3(0.8, 0.8, 0.85);
    material.specularColor = new Color3(0.07, 0.07, 0.07);
    material.specularPower = 100;

    for (let index = 0; index < 24; index++) {
        const angle = (Math.PI * 2 * index) / 24;
        const large = index < 12;
        const sphere = CreateSphere(`subject${index}`, { segments: large ? 32 : 16, diameter: large ? 14 : 6 }, scene);
        sphere.material = material;
        const distance = large ? 110 : 35;
        sphere.position.set(Math.cos(angle) * distance, large ? 8 : 4, Math.sin(angle) * distance);
    }

    return scene;
}
