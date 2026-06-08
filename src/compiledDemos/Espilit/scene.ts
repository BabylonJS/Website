import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { RefractionPostProcess } from "@babylonjs/core/PostProcesses/refractionPostProcess";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";
import "@babylonjs/core/Culling/Octrees/octreeSceneComponent";

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
            "/Scenes/customs/refMap.jpg",
            new Color3(1.0, 1.0, 1.0),
            0.5,
            0.5,
            1.0,
            scene.cameras[1]
        );
    }
    return scene;
}
