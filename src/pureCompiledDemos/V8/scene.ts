import type { Engine, Scene } from "@babylonjs/core/pure";
import {
    LoadSceneAsync,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    ShadowGenerator,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

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
