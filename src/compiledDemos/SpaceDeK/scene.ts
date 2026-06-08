import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";

export async function createSpaceDeKScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/SpaceDek/SpaceDek.babylon", engine);
    scene.collisionsEnabled = false;
    return scene;
}
