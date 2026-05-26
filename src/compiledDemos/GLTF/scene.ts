import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";

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
