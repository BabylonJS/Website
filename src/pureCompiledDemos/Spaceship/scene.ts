import type { Engine, Scene } from "@babylonjs/core/pure";
import { LoadSceneAsync, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

export async function createSpaceshipScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Spaceship/Spaceship.babylon", engine);
    scene.collisionsEnabled = true;
    return scene;
}
