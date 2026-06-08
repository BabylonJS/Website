import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SSAORenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssaoRenderingPipeline";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent";

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
