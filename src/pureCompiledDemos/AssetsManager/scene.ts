import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    AssetsManager,
    HemisphericLight,
    RegisterBabylonFileLoader,
    Scene,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

export async function createAssetsManagerScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    const status = document.getElementById("assetStatus");
    const camera = new ArcRotateCamera("Camera", 0, Math.PI / 2, 80, Vector3.Zero(), scene);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    camera.attachControl(canvas, true);

    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;

    const meshTask = assetsManager.addMeshTask("skull task", "", "/Demos/AssetsManager/", "skull.babylon");
    meshTask.onSuccess = (task) => {
        const rootMesh = task.loadedMeshes[0];
        if (rootMesh) {
            rootMesh.position = Vector3.Zero();
        }
    };

    const textTask = assetsManager.addTextFileTask("text task", "/Demos/AssetsManager/msg.txt");
    textTask.onSuccess = (task) => {
        if (status) {
            status.textContent = task.text.trim();
        }
    };

    assetsManager.addBinaryFileTask("binary task", "/Demos/AssetsManager/grass.jpg");

    await new Promise<void>((resolve, reject) => {
        assetsManager.onTaskError = (task) => {
            reject(new Error(`Unable to complete asset task: ${task.name}`));
        };
        assetsManager.onFinish = () => {
            resolve();
        };
        assetsManager.load();
    });

    return scene;
}
