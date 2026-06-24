import type { Engine, Scene } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    Color3,
    LoadSceneAsync,
    RefractionPostProcess,
    RegisterBabylonFileLoader,
    RegisterOctreeSceneComponent,
    RegisterRefractionPostProcess,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/refraction.fragment";

RegisterBabylonFileLoader();
RegisterOctreeSceneComponent();
RegisterRefractionPostProcess();

export async function createEspilitScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Espilit/Espilit.binary.babylon", engine);
    scene.collisionsEnabled = true;
    scene.autoClear = true;
    scene.createOrUpdateSelectionOctree();
    const sol = scene.getMeshByName("Sol loin") as Mesh | null;
    if (sol) {
        sol.useVertexColors = false;
    }
    scene.gravity.scaleInPlace(0.5);
    if (scene.cameras.length > 1) {
        new RefractionPostProcess(
            "Refraction",
            "/Scenes/Customs/refMap.jpg",
            new Color3(1.0, 1.0, 1.0),
            0.5,
            0.5,
            1.0,
            scene.cameras[1]
        );
    }
    return scene;
}
