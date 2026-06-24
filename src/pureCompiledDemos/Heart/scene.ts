import type { Engine, Scene } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { LoadSceneAsync, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader();

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
