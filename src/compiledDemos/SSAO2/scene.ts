import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SSAO2RenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent";

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
