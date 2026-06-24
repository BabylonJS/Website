import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";

export async function createHeartScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Heart/Heart.babylon", engine);
    scene.collisionsEnabled = true;
    scene.getMeshByName("Labels")?.setEnabled(false);
    const lums = scene.getMeshByName("lums") as Mesh | null;
    if (lums) {
        lums.useVertexColors = false;
    }
    scene.gravity.scaleInPlace(0.5);
    return scene;
}
