import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { BlackAndWhitePostProcess } from "@babylonjs/core/PostProcesses/blackAndWhitePostProcess";
import { FilterPostProcess } from "@babylonjs/core/PostProcesses/filterPostProcess";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Materials/Textures/mirrorTexture";
import "@babylonjs/core/Particles/particleSystemComponent";
import "@babylonjs/core/LensFlares/lensFlareSystemSceneComponent";

export async function createTrainScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Train/Train.babylon", engine);
    scene.collisionsEnabled = false;

    for (const camera of scene.cameras) {
        camera.minZ = 10;
    }

    if (scene.cameras.length > 6) {
        scene.activeCamera = scene.cameras[6];
    }

    const terrainEau = scene.getMaterialByName("terrain_eau") as StandardMaterial | null;
    if (terrainEau) {
        terrainEau.bumpTexture = null;
    }

    // The scene file declares the lens flare emitter (emitterId) as the "sun" light.
    // Re-wire it explicitly in case the loader leaves the emitter unresolved.
    for (const lensFlareSystem of scene.lensFlareSystems) {
        if (!lensFlareSystem.getEmitter()) {
            const sun = scene.getLightByName("sun");
            if (sun) {
                lensFlareSystem.setEmitter(sun);
            }
        }
    }

    if (scene.cameras.length > 2) {
        new BlackAndWhitePostProcess("Black and White", 1.0, scene.cameras[2]);
        scene.cameras[2].name = "B&W";
    }

    if (scene.cameras.length > 3) {
        const sepiaKernelMatrix = Matrix.FromValues(
            0.393,
            0.349,
            0.272,
            0,
            0.769,
            0.686,
            0.534,
            0,
            0.189,
            0.168,
            0.131,
            0,
            0,
            0,
            0,
            0
        );
        new FilterPostProcess("Sepia", sepiaKernelMatrix, 1.0, scene.cameras[3]);
        scene.cameras[3].name = "SEPIA";
    }

    return scene;
}
