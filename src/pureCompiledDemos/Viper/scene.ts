import type { Engine, Scene } from "@babylonjs/core/pure";
import { LoadSceneAsync, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

export async function createViperScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Viper/Viper.babylon", engine);
    scene.collisionsEnabled = true;
    return scene;
}
