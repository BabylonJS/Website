import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    type Engine,
    HemisphericLight,
    MotionBlurPostProcess,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
export function createMotionBlurScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 18, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const blur = new MotionBlurPostProcess("motionBlur", scene, 1, camera);
    blur.motionStrength = 0.8;
    const material = new StandardMaterial("fastMaterial", scene);
    material.diffuseColor = new Color3(1, 0.35, 0.2);
    for (let index = 0; index < 7; index++) {
        const box = CreateBox(`box${index}`, { size: 2 }, scene);
        box.position.x = index * 3 - 9;
        box.material = material;
        scene.registerBeforeRender(() => {
            box.position.z = Math.sin(scene.getFrameId() * 0.08 + index) * 4;
            box.rotation.y += 0.05 * scene.getAnimationRatio();
        });
    }
    return scene;
}
