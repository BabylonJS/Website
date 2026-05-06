import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import {
    HardwareScalingOptimization,
    SceneOptimizer,
    SceneOptimizerOptions,
} from "@babylonjs/core/Misc/sceneOptimizer";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";

export async function createFlightHelmetScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.02, 0.02, 0.02, 1);
    scene.imageProcessingConfiguration.contrast = 1.6;
    scene.imageProcessingConfiguration.exposure = 0.6;
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    engine.setHardwareScalingLevel(0.5);

    await AppendSceneAsync("FlightHelmet_Materials.gltf", scene, {
        rootUrl: "https://www.babylonjs.com/Assets/FlightHelmet/glTF/",
    });

    scene.activeCamera = null;
    scene.createDefaultCameraOrLight(true, true, true);

    const camera = scene.activeCamera as ArcRotateCamera | null;
    if (camera) {
        camera.lowerRadiusLimit = 20;
        camera.upperRadiusLimit = 80;
        camera.alpha = 2.5;
        camera.beta = 1.5;
        camera.useAutoRotationBehavior = true;
    }

    const light = new DirectionalLight("light1", new Vector3(2, -3, -1), scene);
    light.position = new Vector3(-20, 20, 6);

    const generator = new ShadowGenerator(512, light);
    generator.useBlurExponentialShadowMap = true;
    generator.blurKernel = 32;
    const shadowMap = generator.getShadowMap();
    if (shadowMap) {
        shadowMap.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    }

    scene.meshes.forEach((mesh) => {
        generator.addShadowCaster(mesh);
    });

    const helper = scene.createDefaultEnvironment({
        groundShadowLevel: 0.6,
    });
    helper?.setMainColor(new Color3(0.42, 0.41, 0.33));

    const options = new SceneOptimizerOptions(50, 2000);
    options.addOptimization(new HardwareScalingOptimization(0, 1));
    new SceneOptimizer(scene, options).start();

    return scene;
}
