import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Scene } from "@babylonjs/core/scene";
import { GLTFLoaderAnimationStartMode } from "@babylonjs/loaders/glTF";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/loadingScreen";

export async function createYetiScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.02, 0.02, 0.02, 1);
    scene.imageProcessingConfiguration.contrast = 1.6;
    scene.imageProcessingConfiguration.exposure = 0.6;
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    engine.setHardwareScalingLevel(0.75);

    await AppendSceneAsync("Yeti_Idle.gltf", scene, {
        rootUrl: "https://www.babylonjs.com/Assets/Yeti/glTF/",
        pluginOptions: {
            gltf: {
                animationStartMode: GLTFLoaderAnimationStartMode.ALL,
                compileMaterials: true,
            },
        },
    });

    scene.activeCamera = null;
    scene.createDefaultCameraOrLight(true, true, true);

    const camera = scene.activeCamera as ArcRotateCamera | null;
    if (camera) {
        camera.alpha = 2;
        camera.beta = 1.5;
        camera.lowerRadiusLimit = 20;
        camera.upperRadiusLimit = 200;
        camera.useAutoRotationBehavior = true;
    }

    scene.meshes.forEach((mesh) => {
        mesh.alwaysSelectAsActiveMesh = true;
    });

    const helper = scene.createDefaultEnvironment({
        skyboxSize: 1000,
        groundShadowLevel: 0.6,
    });
    helper?.setMainColor(Color3.White());

    const fountain = CreateBox("fountain", { size: 0.1 }, scene);
    fountain.position.y = 100;
    fountain.isVisible = false;

    const particleSystem = new ParticleSystem("particles", 1500, scene, undefined, true);
    particleSystem.particleTexture = new Texture("https://www.babylonjs.com/Assets/Yeti/snowflake.png", scene);
    particleSystem.startSpriteCellID = 0;
    particleSystem.endSpriteCellID = 0;
    particleSystem.spriteCellHeight = 512;
    particleSystem.spriteCellWidth = 512;
    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new Vector3(-100, 0, -100);
    particleSystem.maxEmitBox = new Vector3(100, 0, 100);
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 4;
    particleSystem.minLifeTime = 1.2;
    particleSystem.maxLifeTime = 1.6;
    particleSystem.emitRate = 150;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new Vector3(0, -98, 0);
    particleSystem.direction1 = new Vector3(5.5, -1, 5.5);
    particleSystem.direction2 = new Vector3(-5.5, -1, -5.5);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 10;
    particleSystem.updateSpeed = 0.005;

    scene.registerBeforeRender(() => {
        particleSystem.startSpriteCellID = Math.round(Math.random() * 3 - 1);
        particleSystem.endSpriteCellID = particleSystem.startSpriteCellID;
    });

    particleSystem.start();

    return scene;
}
