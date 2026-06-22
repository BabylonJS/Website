import { Animation } from "@babylonjs/core/Animations/animation";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/Textures/cubeTexture";
import "@babylonjs/loaders/glTF";

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
