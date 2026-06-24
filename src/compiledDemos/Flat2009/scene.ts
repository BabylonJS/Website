import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { VideoTexture } from "@babylonjs/core/Materials/Textures/videoTexture";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Materials/Textures/mirrorTexture";
import "@babylonjs/core/Particles/particleSystemComponent";
import "@babylonjs/core/Culling/Octrees/octreeSceneComponent";

export async function createFlat2009Scene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Flat2009/Flat2009.babylon", engine);
    scene.collisionsEnabled = true;

    const ecran = scene.getMeshByName("Ecran") as Mesh | null;
    if (ecran && ecran.material) {
        (ecran.material as StandardMaterial).diffuseTexture = new VideoTexture(
            "video",
            ["/Scenes/Flat2009/babylonjs.mp4", "/Scenes/Flat2009/babylonjs.webm"],
            scene,
            true,
            true
        );
    }

    scene.createOrUpdateSelectionOctree();
    scene.gravity.scaleInPlace(0.5);

    return scene;
}
