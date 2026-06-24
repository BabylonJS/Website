import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    AppendSceneAsync,
    DepthRenderer,
    PostProcessRenderPipelineManager,
    RegisterBabylonFileLoader,
    RegisterDepthRendererSceneComponent,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterPostProcessRenderPipelineManagerSceneComponent,
    RegisterRenderTargetTexture,
    Scene,
    SSAORenderingPipeline,
    Vector3,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/postprocess.vertex";
import "@babylonjs/core/Shaders/ssao.fragment";
import "@babylonjs/core/Shaders/ssaoCombine.fragment";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterPostProcessRenderPipelineManagerSceneComponent(PostProcessRenderPipelineManager);
RegisterDepthRendererSceneComponent(DepthRenderer);

export async function createSSAOScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", -2.5, 1.0, 200, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    await AppendSceneAsync("/Scenes/Assets/SSAOcat.babylon", scene);

    scene.activeCamera = camera;

    const ssao = new SSAORenderingPipeline("ssaopipeline", scene, { ssaoRatio: 0.5, combineRatio: 1.0 });
    ssao.fallOff = 0.000001;
    ssao.area = 1;
    ssao.radius = 0.0004;
    ssao.totalStrength = 2;
    ssao.base = 1.3;

    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", camera);

    return scene;
}
