import type { Engine, Scene } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { ShadowLight } from "@babylonjs/core/Lights/shadowLight";
import {
    Color4,
    LoadSceneAsync,
    ParticleSystem,
    Quaternion,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetCube,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    ShadowGenerator,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterEnginesExtensionsEngineRenderTargetCube();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export async function createSponzaDynamicShadowsScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/SponzaDynamicShadows/SponzaDynamicShadows.babylon", engine);
    scene.collisionsEnabled = true;

    const node = scene.getMeshByName("litghtmesh") as Mesh;
    const particleSystem = new ParticleSystem("New Particle System", 1000, scene);
    particleSystem.emitter = node;
    particleSystem.renderingGroupId = 0;
    particleSystem.emitRate = 200;
    particleSystem.manualEmitCount = -1;
    particleSystem.updateSpeed = 0.005;
    particleSystem.targetStopDuration = 0;
    particleSystem.disposeOnStop = false;
    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 0.3;
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.5;
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.8;
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = 6.283185307179586;
    particleSystem.layerMask = 268435455;
    particleSystem.blendMode = 0;
    particleSystem.forceDepthWrite = false;
    particleSystem.gravity = new Vector3(0, 0, 0);
    particleSystem.direction1 = new Vector3(-7, 8, 3);
    particleSystem.direction2 = new Vector3(7, 8, -3);
    particleSystem.minEmitBox = new Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new Vector3(0, 0, 0);
    particleSystem.color1 = new Color4(0.7, 0.8, 0.5465114353377606, 1);
    particleSystem.color2 = new Color4(0.6707185797327061, 0.5, 0.23185333620389842, 1);
    particleSystem.colorDead = new Color4(0.2980971465478694, 0, 0.3312190517198549, 1);
    particleSystem.textureMask = new Color4(1, 1, 1, 1);
    particleSystem.particleTexture = new Texture("/Scenes/WorldMonger/Assets/Flare.png", scene);
    particleSystem.start();

    node.position = new Vector3(2.5223299803446766, 2.0876, -3.525673483620715);
    node.rotation = new Vector3(0, 0, 0);
    node.rotationQuaternion = new Quaternion(0, 0, 0, -1);
    node.scaling = new Vector3(1, 1, 1);

    // Clear the serialized direction so the point lights cast full omnidirectional cube shadows
    (scene.getLightByName("Omni002") as unknown as { direction: Vector3 | null }).direction = null;
    (scene.getLightByName("Omni001") as unknown as { direction: Vector3 | null }).direction = null;

    let shadowGenerator = (scene.getLightByName("Omni002") as ShadowLight).getShadowGenerator() as ShadowGenerator;
    shadowGenerator.getShadowMap()!.refreshRate = 0;
    shadowGenerator.forceBackFacesOnly = true;
    shadowGenerator.bias = 0.01;

    shadowGenerator = (scene.getLightByName("Omni001") as ShadowLight).getShadowGenerator() as ShadowGenerator;
    shadowGenerator.forceBackFacesOnly = true;
    shadowGenerator.bias = 0.01;

    return scene;
}
