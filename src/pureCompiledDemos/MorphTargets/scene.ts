import type { Engine, Scene as SceneType, Mesh } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    CreateSphere,
    HDRCubeTexture,
    HemisphericLight,
    MorphTarget,
    MorphTargetManager,
    PBRMaterial,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    Scene,
    Vector3,
    VertexBuffer,
    VertexData,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/hdrFiltering.vertex";
import "@babylonjs/core/Shaders/hdrFiltering.fragment";

RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();

function addSpike(mesh: Mesh): void {
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!;
    const normals = mesh.getVerticesData(VertexBuffer.NormalKind)!;
    const indices = mesh.getIndices()!;

    for (let index = 0; index < 5; index++) {
        const randomVertexID = (mesh.getTotalVertices() * Math.random()) | 0;
        const position = Vector3.FromArray(positions, randomVertexID * 3);
        const normal = Vector3.FromArray(normals, randomVertexID * 3);

        position.addInPlace(normal);
        position.toArray(positions, randomVertexID * 3);
    }

    VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
    mesh.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
}

export function createMorphTargetsTestScene(engine: Engine, canvas: HTMLCanvasElement): SceneType {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera1", 1.14, 1.13, 10, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

    const hdrTexture = new HDRCubeTexture("/Demos/Highlights/room.hdr", scene, 512);

    const glass = new PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new Color3(0.85, 0.85, 0.85);
    sphere.material = glass;

    const sphere2 = CreateSphere("sphere2", { segments: 16, diameter: 2 }, scene);
    sphere2.setEnabled(false);
    addSpike(sphere2);

    const sphere3 = CreateSphere("sphere3", { segments: 16, diameter: 2 }, scene);
    sphere3.setEnabled(false);
    addSpike(sphere3);

    const sphere4 = CreateSphere("sphere4", { segments: 16, diameter: 2 }, scene);
    sphere4.setEnabled(false);
    addSpike(sphere4);

    const sphere5 = CreateSphere("sphere5", { segments: 16, diameter: 2 }, scene);
    sphere5.setEnabled(false);
    addSpike(sphere5);

    const manager = new MorphTargetManager();
    sphere.morphTargetManager = manager;

    const target0 = MorphTarget.FromMesh(sphere2, "sphere2", 0.25);
    manager.addTarget(target0);

    const target1 = MorphTarget.FromMesh(sphere3, "sphere3", 0.25);
    manager.addTarget(target1);

    const target2 = MorphTarget.FromMesh(sphere4, "sphere4", 0.25);
    manager.addTarget(target2);

    const target3 = MorphTarget.FromMesh(sphere5, "sphere5", 0.25);
    manager.addTarget(target3);

    let t = 0;
    scene.registerBeforeRender(function () {
        t += 0.02;
        target0.influence = Math.sin(t) * 0.5 + 0.5;
        target1.influence = Math.sin(t * 1.3) * 0.5 + 0.5;
        target2.influence = Math.sin(t * 0.7) * 0.5 + 0.5;
        target3.influence = Math.sin(t * 1.7) * 0.5 + 0.5;
    });

    return scene;
}
