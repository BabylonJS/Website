import {
    ArcRotateCamera,
    CreatePlane,
    CreateSphere,
    type Engine,
    HemisphericLight,
    RenderTargetTexture,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
export function createCustomRenderTargetScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 18, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const sourceMaterial = new StandardMaterial("sourceMaterial", scene);
    sourceMaterial.diffuseColor.set(0.2, 0.8, 1);
    const sphere = CreateSphere("renderedSphere", { segments: 32, diameter: 4 }, scene);
    sphere.position.x = -4;
    sphere.material = sourceMaterial;
    const renderTarget = new RenderTargetTexture("mirrorTarget", 512, scene);
    renderTarget.renderList = [sphere];
    scene.customRenderTargets.push(renderTarget);
    const planeMaterial = new StandardMaterial("planeMaterial", scene);
    planeMaterial.diffuseTexture = renderTarget;
    planeMaterial.emissiveTexture = renderTarget;
    const plane = CreatePlane("previewPlane", { size: 6 }, scene);
    plane.position.x = 4;
    plane.material = planeMaterial;
    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.02 * scene.getAnimationRatio();
        plane.rotation.y = Math.sin(scene.getFrameId() * 0.01) * 0.3;
    });
    return scene;
}
