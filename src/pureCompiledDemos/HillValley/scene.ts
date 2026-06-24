import type { Engine, Scene } from "@babylonjs/core/pure";
import type { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import {
    LoadSceneAsync,
    RegisterBabylonFileLoader,
    RegisterOctreeSceneComponent,
    SceneLoaderFlags,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterOctreeSceneComponent();

export async function createHillValleyScene(engine: Engine): Promise<Scene> {
    SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;
    const scene = await LoadSceneAsync("/Scenes/hillvalley/HillValley.incremental.babylon", engine);
    scene.collisionsEnabled = false;
    scene.lightsEnabled = false;
    if (scene.activeCamera) {
        (scene.activeCamera as FreeCamera).applyGravity = true;
    }
    scene.createOrUpdateSelectionOctree();
    for (const material of scene.materials) {
        material.checkReadyOnEveryCall = false;
    }
    return scene;
}
