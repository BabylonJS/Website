import type { Engine } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import {
    LoadSceneAsync,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterMirrorTexture,
    RegisterOctreeSceneComponent,
    RegisterParticleSystemComponent,
    RegisterRenderTargetTexture,
    RegisterVideoTexture,
    Scene,
    VideoTexture,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterMirrorTexture();
RegisterOctreeSceneComponent();
RegisterParticleSystemComponent();
RegisterVideoTexture();

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
