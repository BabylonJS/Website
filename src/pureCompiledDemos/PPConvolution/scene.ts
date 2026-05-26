import {
    ArcRotateCamera,
    Color3,
    ConvolutionPostProcess,
    CreateBox,
    CreateSphere,
    DirectionalLight,
    type Engine,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
export function createConvolutionScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 65, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new DirectionalLight("dir01", new Vector3(0, -1, -0.2), scene).intensity = 0.6;
    new DirectionalLight("dir02", new Vector3(-1, 2, -1), scene).intensity = 0.6;
    new ConvolutionPostProcess("convolution", ConvolutionPostProcess.EmbossKernel, 1, camera);

    const sphereMaterial = new StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseColor = new Color3(0.5, 0.5, 1);
    const cubeMaterial = new StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseColor = new Color3(1, 0.5, 0.5);
    cubeMaterial.specularColor = Color3.Black();
    const sphere0 = CreateSphere("Sphere0", { segments: 16, diameter: 10 }, scene);
    const sphere1 = CreateSphere("Sphere1", { segments: 16, diameter: 10 }, scene);
    const sphere2 = CreateSphere("Sphere2", { segments: 16, diameter: 10 }, scene);
    const cube = CreateBox("Cube", { size: 10 }, scene);
    sphere0.material = sphereMaterial;
    sphere1.material = sphereMaterial;
    sphere2.material = sphereMaterial;
    cube.material = cubeMaterial;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        sphere0.position.set(20 * Math.sin(alpha), 0, 20 * Math.cos(alpha));
        sphere1.position.set(20 * Math.sin(alpha), -20 * Math.cos(alpha), 0);
        sphere2.position.set(0, 20 * Math.cos(alpha), 20 * Math.sin(alpha));
        cube.rotation.y += 0.01 * scene.getAnimationRatio();
        cube.rotation.z += 0.01 * scene.getAnimationRatio();
        alpha += 0.05 * scene.getAnimationRatio();
    });

    return scene;
}
