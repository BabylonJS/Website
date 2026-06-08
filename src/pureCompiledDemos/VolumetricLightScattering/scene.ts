import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    ImportMeshAsync,
    PointLight,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterVolumetricLightScatteringPostProcess,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
    VolumetricLightScatteringPostProcess,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/volumetricLightScattering.fragment";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.fragment";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.vertex";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterVolumetricLightScatteringPostProcess();

export async function createVolumetricLightScatteringScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor.set(0.02, 0.02, 0.08, 1);

    const light = new PointLight("Omni", new Vector3(20, 20, 100), scene);
    const camera = new ArcRotateCamera("Camera", -0.5, 2.2, 100, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const result = await ImportMeshAsync("skull.babylon", scene, {
        rootUrl: "/Scenes/Assets/",
        meshNames: "",
    });

    const skull = result.meshes[0];
    if (skull) {
        camera.target = skull.position;
        const material = new StandardMaterial("skull", scene);
        material.emissiveColor = new Color3(0.2, 0.2, 0.2);
        skull.material = material;
    }

    const godRays = new VolumetricLightScatteringPostProcess(
        "godrays",
        1,
        camera,
        null,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );

    if (godRays.mesh.material instanceof StandardMaterial) {
        const sunTexture = new Texture("/Scenes/Assets/sun.png", scene, true, false, Texture.BILINEAR_SAMPLINGMODE);
        sunTexture.hasAlpha = true;
        godRays.mesh.material.diffuseTexture = sunTexture;
    }

    godRays.mesh.position = new Vector3(-150, 150, 150);
    godRays.mesh.scaling = new Vector3(350, 350, 350);
    light.position = godRays.mesh.position;

    scene.registerBeforeRender(() => {
        if (skull) {
            skull.rotation.y += 0.002 * scene.getAnimationRatio();
        }
    });

    return scene;
}
