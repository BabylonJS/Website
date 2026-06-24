import type { Engine, Scene as SceneType, Mesh } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    HemisphericLight,
    ImportMeshAsync,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterMeshSimplificationSceneComponent,
    Scene,
    SimplificationQueue,
    SimplificationType,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRawTexture();
RegisterMeshSimplificationSceneComponent(SimplificationQueue);

export function createSimplificationScene(engine: Engine, canvas: HTMLCanvasElement): SceneType {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 100, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, false);
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    scene.registerBeforeRender(function () {
        camera.alpha += 0.005;
    });

    ImportMeshAsync("/Scenes/Dude/Dude.babylon", scene).then((result) => {
        const mainMesh = (result.meshes[1] || result.meshes[0]) as Mesh;
        camera.setTarget(mainMesh.getBoundingInfo().boundingBox.center);

        // Progressive mesh simplification: builds decimated LOD levels shown at distance.
        mainMesh.simplify(
            [
                { quality: 0.8, distance: 30, optimizeMesh: true },
                { quality: 0.5, distance: 60, optimizeMesh: true },
                { quality: 0.3, distance: 100, optimizeMesh: true },
            ],
            true,
            SimplificationType.QUADRATIC
        );
    });

    return scene;
}
