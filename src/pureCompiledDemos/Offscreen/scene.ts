import type { Engine } from "@babylonjs/core/pure";
import {
    Animation,
    ImportMeshAsync,
    RegisterAnimatable,
    RegisterAnimation,
    RegisterEnginePrefilteredCubeTexture,
    RegisterEnginesExtensionsEngineCubeTexture,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetCube,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterPassPostProcess,
    RegisterRenderTargetTexture,
    RegisterSceneHelpers,
    Scene,
} from "@babylonjs/core/pure";
import "@babylonjs/loaders/glTF";

RegisterSceneHelpers();
RegisterAnimation();
RegisterAnimatable();
RegisterEnginePrefilteredCubeTexture();
RegisterEnginesExtensionsEngineCubeTexture();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterEnginesExtensionsEngineRenderTargetCube();
RegisterRenderTargetTexture();
RegisterPassPostProcess();

export async function createOffscreenScene(engine: Engine, attachCameraControls: boolean): Promise<Scene> {
    const scene = new Scene(engine);
    const result = await ImportMeshAsync("flightHelmet.glb", scene, {
        rootUrl: "https://models.babylonjs.com/",
    });

    scene.createDefaultCameraOrLight(true, true, attachCameraControls);
    scene.createDefaultEnvironment();

    const rootMesh = result.meshes[0];
    if (rootMesh) {
        rootMesh.rotationQuaternion = null;
        Animation.CreateAndStartAnimation("turnTable", rootMesh, "rotation.y", 60, 480, 0, Math.PI * 2);
    }

    return scene;
}
