import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";
import "@babylonjs/core/Culling/Octrees/octreeSceneComponent";

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
