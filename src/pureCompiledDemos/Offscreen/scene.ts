import type { Engine } from "@babylonjs/core/pure";
import {
    Animation,
    ImportMeshAsync,
    RegisterAbstractEngineCubeTexture,
    RegisterAnimatable,
    RegisterAnimation,
    RegisterCubeTexture,
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
// Side-effect only: wires AbstractEngine.GetCompatibleTextureLoader so special-format
// textures (e.g. .env/.dds/.tga) load. Offscreen uses its own runner, not the shared
// demoRunner, so it needs this import directly.
import "@babylonjs/core/Engines/AbstractEngine/abstractEngine.textureLoaders";
import "@babylonjs/loaders/glTF";

RegisterSceneHelpers();
RegisterAnimation();
RegisterAnimatable();
RegisterAbstractEngineCubeTexture();
RegisterCubeTexture();
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
