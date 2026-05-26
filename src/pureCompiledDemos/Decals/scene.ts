import {
    ArcRotateCamera,
    Color3,
    CreateDecal,
    CreateSphere,
    type Engine,
    HemisphericLight,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
export function createDecalsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    new HemisphericLight("Hemi", new Vector3(0, 1, 0), scene);
    const camera = new ArcRotateCamera("Camera", -1.85, 1.2, 24, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const target = CreateSphere("decalTarget", { segments: 48, diameter: 8 }, scene);
    const targetMaterial = new StandardMaterial("targetMaterial", scene);
    targetMaterial.diffuseColor = new Color3(0.45, 0.48, 0.55);
    targetMaterial.specularColor = new Color3(0.12, 0.12, 0.12);
    target.material = targetMaterial;

    const decalMaterial = new StandardMaterial("decalMat", scene);
    decalMaterial.diffuseTexture = new Texture("/Scenes/Assets/impact.png", scene);
    decalMaterial.diffuseTexture.hasAlpha = true;
    decalMaterial.zOffset = -2;

    const points = [
        new Vector3(0, 3.8, -1),
        new Vector3(-3, 1, -2.4),
        new Vector3(3, 0.7, -2.2),
        new Vector3(-1.2, -2.5, -3),
        new Vector3(1.8, -2.2, -2.5),
    ];
    for (const point of points) {
        const normal = point.normalizeToNew();
        const decal = CreateDecal("decal", target, { position: point, normal, size: new Vector3(1.4, 1.4, 1.4) });
        decal.material = decalMaterial;
    }

    scene.registerBeforeRender(() => {
        target.rotation.y += 0.004 * scene.getAnimationRatio();
    });

    return scene;
}
