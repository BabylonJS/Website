import type { Engine, Scene } from "@babylonjs/core/pure";
import {
    LoadSceneAsync,
    RegisterBabylonFileLoader,
    RegisterDirectActions,
    RegisterDirectAudioActions,
    RegisterInterpolateValueAction,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterDirectActions();
RegisterDirectAudioActions();
RegisterInterpolateValueAction();

export async function createMansionScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Mansion/Mansion.babylon", engine);
    scene.collisionsEnabled = true;
    return scene;
}
