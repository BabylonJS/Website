import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";

export async function createV8Scene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/V8/v8.babylon", engine);
    scene.collisionsEnabled = true;

    if (scene.activeCamera) {
        scene.activeCamera.minZ = 1;
    }

    const shadowGenerator = scene.lights[0]?.getShadowGenerator();
    if (shadowGenerator instanceof ShadowGenerator) {
        shadowGenerator.usePoissonSampling = true;
        shadowGenerator.bias = 0.01;
    }

    return scene;
}
