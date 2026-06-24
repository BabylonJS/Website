import type { Engine, Scene as SceneType } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    Color3,
    CreateGround,
    LoadSceneAsync,
    MirrorTexture,
    Plane,
    RegisterAnimatable,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterMirrorTexture,
    RegisterRenderTargetTexture,
    StandardMaterial,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterAnimatable();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterMirrorTexture();

export function createDancersScene(engine: Engine, canvas: HTMLCanvasElement): Promise<SceneType> {
    return LoadSceneAsync("/Scenes/DanceMoves/DanceMoves.babylon", engine).then((scene) => {
        scene.activeCamera!.maxZ = 10000.0;
        (scene.activeCamera as { position: { z: number } }).position.z = 600.0;

        // Mirror ground
        const groundMaterial = new StandardMaterial("ground", scene);
        const mirror = new MirrorTexture("mirror", 1024, scene, true);
        mirror.mirrorPlane = new Plane(0, -1.0, 0, 0);
        mirror.level = 0.5;
        groundMaterial.reflectionTexture = mirror;
        groundMaterial.diffuseColor = new Color3(1.0, 1.0, 1.0);
        groundMaterial.specularColor = new Color3(0, 0, 0);

        const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
        ground.material = groundMaterial;

        const dancer = scene.meshes[1] as Mesh;
        mirror.renderList!.push(dancer);
        scene.beginAnimation(dancer.skeleton!, 2, 100, true, 0.05);

        // Clone a handful of dancers (replaces the legacy FPS-driven cloning + dat.GUI)
        let total = 1;
        for (let i = 0; i < 8; i++) {
            const newOne = dancer.clone("clone" + total, null) as Mesh;
            newOne.skeleton = dancer.skeleton!.clone("skeleton" + total);
            newOne.material!.freeze();
            newOne.position.x = 250 - Math.random() * 500;
            newOne.position.z = 250 - Math.random() * 500;
            mirror.renderList!.push(newOne);
            scene.beginAnimation(newOne.skeleton, 2, 100, true, 0.05);
            total++;
        }

        scene.executeWhenReady(function () {
            scene.activeCamera!.attachControl(canvas);
        });

        return scene;
    });
}
