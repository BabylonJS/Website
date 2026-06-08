import type { Engine, Scene } from "@babylonjs/core/pure";
import { LoadSceneAsync, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

export async function createWCafeScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/WCafe/WCafe.babylon", engine);
    scene.collisionsEnabled = true;
    return scene;
}
