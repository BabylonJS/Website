import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    AppendSceneAsync,
    DepthRenderer,
    GeometryBufferRenderer,
    PrePassRenderer,
    PostProcessRenderPipelineManager,
    RegisterBabylonFileLoader,
    RegisterDepthRendererSceneComponent,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterGeometryBufferRendererSceneComponent,
    RegisterPostProcessRenderPipelineManagerSceneComponent,
    RegisterPrePassRendererSceneComponent,
    RegisterRenderTargetTexture,
    RegisterSsao2RenderingPipeline,
    Scene,
    SSAO2RenderingPipeline,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterPostProcessRenderPipelineManagerSceneComponent(PostProcessRenderPipelineManager);
RegisterDepthRendererSceneComponent(DepthRenderer);
RegisterGeometryBufferRendererSceneComponent(GeometryBufferRenderer);
RegisterPrePassRendererSceneComponent(PrePassRenderer);
RegisterSsao2RenderingPipeline();

export async function createSSAOScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", -2.5, 1.0, 200, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    await AppendSceneAsync("/Scenes/Assets/SSAOcat.babylon", scene);

    scene.activeCamera = camera;

    const ssaoRatio = {
        ssaoRatio: 0.5,
        blurRatio: 1.0,
    };

    const ssao = new SSAO2RenderingPipeline("ssao", scene, ssaoRatio);
    ssao.radius = 42;
    ssao.totalStrength = 0.9;
    ssao.base = 0.2;
    ssao.expensiveBlur = true;
    ssao.samples = 16;
    ssao.maxZ = 2500;

    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);

    return scene;
}
