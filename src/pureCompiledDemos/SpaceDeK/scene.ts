import type { Engine, Scene } from "@babylonjs/core/pure";
import { LoadSceneAsync, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

export async function createSpaceDeKScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/SpaceDek/SpaceDek.babylon", engine);
    scene.collisionsEnabled = false;
    return scene;
}
