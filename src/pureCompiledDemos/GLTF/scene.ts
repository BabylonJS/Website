import type { Engine } from "@babylonjs/core/pure";
import {
    AppendSceneAsync,
    Color3,
    HemisphericLight,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetCube,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterPassPostProcess,
    RegisterRenderTargetTexture,
    RegisterSceneHelpers,
    Scene,
    Vector3,
} from "@babylonjs/core/pure";
import "@babylonjs/loaders/glTF";

RegisterSceneHelpers();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterEnginesExtensionsEngineRenderTargetCube();
RegisterRenderTargetTexture();
RegisterPassPostProcess();

export async function createGltfScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0, 1);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.diffuse = Color3.White();

    await AppendSceneAsync("Alien.glb", scene, {
        rootUrl: "https://www.babylonjs.com/assets/",
    });

    scene.activeCamera = null;
    scene.createDefaultCameraOrLight(true, true, true);

    const rootMesh = scene.meshes[0];
    if (rootMesh) {
        rootMesh.rotationQuaternion = null;
        scene.registerBeforeRender(() => {
            rootMesh.rotation.y += 0.003 * scene.getAnimationRatio();
        });
    }

    return scene;
}
