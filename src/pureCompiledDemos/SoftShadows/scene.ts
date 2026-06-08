import type { Engine } from "@babylonjs/core/pure";
import {
    AppendSceneAsync,
    ArcRotateCamera,
    Color3,
    DirectionalLight,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export async function createSoftShadowsScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", -2.5, 1.0, 200, new Vector3(0, 1.0, 0), scene);

    await AppendSceneAsync("/Scenes/Assets/SSAOcat.babylon", scene);

    scene.lights[0].dispose();
    scene.activeCamera = camera;
    camera.attachControl(canvas, false);

    const light = new DirectionalLight("light", new Vector3(0, -0.5, 0.8), scene);
    const light2 = new DirectionalLight("light", new Vector3(0, -0.5, 0.8), scene);
    const light3 = new DirectionalLight("light", new Vector3(0, -0.5, 0.8), scene);

    light.position = new Vector3(0, 120.0, -10);
    light2.position = new Vector3(0, 120.0, -10);
    light3.position = new Vector3(0, 120.0, -10);

    light.diffuse = Color3.Red();
    light2.diffuse = Color3.Green();
    light3.diffuse = Color3.Blue();

    const cat = scene.meshes[2];
    cat.receiveShadows = false;

    const generator = new ShadowGenerator(512, light);
    generator.getShadowMap()!.renderList!.push(cat);
    generator.useBlurExponentialShadowMap = true;
    generator.blurBoxOffset = 2.0;

    const generator2 = new ShadowGenerator(512, light2);
    generator2.getShadowMap()!.renderList!.push(cat);
    generator2.useBlurExponentialShadowMap = true;
    generator2.blurBoxOffset = 2.0;

    const generator3 = new ShadowGenerator(512, light3);
    generator3.getShadowMap()!.renderList!.push(cat);
    generator3.useBlurExponentialShadowMap = true;
    generator3.blurBoxOffset = 2.0;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        light.direction.z = 0.8 * Math.cos(alpha);
        light.direction.x = 0.3 * Math.sin(alpha);

        light2.direction.z = 0.3 * Math.cos(alpha);
        light2.direction.x = 0.8 * Math.sin(alpha);

        light3.direction.x = 0.3 * Math.cos(alpha);
        light3.direction.z = 0.8 * Math.sin(alpha);
        alpha += 0.01;
    });

    return scene;
}
