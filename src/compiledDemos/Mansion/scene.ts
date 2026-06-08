import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";
import "@babylonjs/core/Actions/directActions";
import "@babylonjs/core/Actions/directAudioActions";
import "@babylonjs/core/Actions/interpolateValueAction";

export async function createMansionScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Mansion/Mansion.babylon", engine);
    scene.collisionsEnabled = true;
    return scene;
}
