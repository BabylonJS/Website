import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { FresnelParameters } from "@babylonjs/core/Materials/fresnelParameters";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { VolumetricLightScatteringPostProcess } from "@babylonjs/core/PostProcesses/volumetricLightScatteringPostProcess";
import type { SolidParticle } from "@babylonjs/core/Particles/solidParticle";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createSPSTestScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = Color3.Black().toColor4(1);

    const camera = new ArcRotateCamera("Camera", -1.5, 1.3, 500, Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    camera.upperRadiusLimit = 600;
    camera.lowerRadiusLimit = 200;

    const light1 = new HemisphericLight("hemi", new Vector3(0, 50, 100), scene);
    light1.diffuse = new Color3(0, 10, 10);

    const skybox = CreateBox("skyBox", { size: 1500 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/Scenes/prosecution/assets/skybox/nebula", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    const saturne = CreateSphere("saturne", { segments: 16, diameter: 80 }, scene);
    const saturneMaterial = new StandardMaterial("saturne_material", scene);
    saturneMaterial.reflectionTexture = new CubeTexture("/Scenes/prosecution/assets/skybox/nebula", scene);
    saturneMaterial.diffuseTexture = new Texture("/Demos/SPS/saturne.jpg", scene);
    saturneMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
    saturneMaterial.emissiveColor = Color3.White();
    saturneMaterial.specularColor = Color3.Black();
    saturneMaterial.backFaceCulling = true;

    saturneMaterial.reflectionFresnelParameters = new FresnelParameters();
    saturneMaterial.reflectionFresnelParameters.bias = 0.2;

    saturneMaterial.emissiveFresnelParameters = new FresnelParameters();
    saturneMaterial.emissiveFresnelParameters.bias = 0.6;
    saturneMaterial.emissiveFresnelParameters.power = 4;
    saturneMaterial.emissiveFresnelParameters.leftColor = Color3.White();
    saturneMaterial.emissiveFresnelParameters.rightColor = new Color3(0.6, 0.6, 0.6);

    saturne.material = saturneMaterial;
    saturne.rotation.y = -12;

    const rings = CreatePlane("rings", { size: 600 }, scene);
    const ringsMat = new StandardMaterial("m", scene);
    ringsMat.diffuseTexture = new Texture("/Demos/SPS/rings.png", scene);
    ringsMat.diffuseTexture.hasAlpha = true;
    ringsMat.backFaceCulling = false;
    rings.material = ringsMat;
    rings.rotation.x = Math.PI / 2;

    const nb = 20000;

    const myVertexFunction = (particle: SolidParticle, vertex: { x: number; y: number; z: number }) => {
        vertex.x *= (Math.random() + 0.01) / getRandomInt(5, 10);
        vertex.y *= (Math.random() + 0.01) / getRandomInt(5, 10);
        vertex.z *= (Math.random() + 0.01) / getRandomInt(5, 10);
    };

    const myPositionFunction = (particle: SolidParticle, i: number) => {
        const TWO_PI = Math.PI * 2;
        const angle = TWO_PI / nb;

        const x = getRandomInt(90, 350) * Math.sin(angle * i);
        const z = getRandomInt(90, 350) * Math.cos(angle * i);

        particle.position.x = x;
        particle.position.y = z;
        particle.position.z = (Math.random() - 0.5) * 5;

        particle.scaling.x = getRandomInt(5, 35) / 10;
        particle.scaling.y = getRandomInt(5, 35) / 10;
        particle.scaling.z = getRandomInt(5, 35) / 10;

        particle.rotation.x = Math.random() * 3.15;
        particle.rotation.y = Math.random() * 3.15;
        particle.rotation.z = Math.random() * 1.5;
    };

    const rock = CreateSphere("s", { segments: 0.5, diameter: 16 }, scene);
    const rockMaterial = new StandardMaterial("rock_material", scene);
    rockMaterial.diffuseTexture = new Texture("/Demos/SPS/asteroid.jpg", scene);
    (rockMaterial.diffuseTexture as Texture).uScale = 16;
    (rockMaterial.diffuseTexture as Texture).vScale = 16;
    rockMaterial.backFaceCulling = false;
    rock.material = rockMaterial;

    // SPS creation : Immutable {updatable: false}
    const SPS = new SolidParticleSystem("SPS", scene, { updatable: false });
    SPS.addShape(rock, nb, { positionFunction: myPositionFunction, vertexFunction: myVertexFunction });
    SPS.buildMesh();
    SPS.mesh.material = rock.material;
    SPS.mesh.rotation.y = 90;
    SPS.mesh.rotation.x = Math.PI / 2;

    rock.dispose();

    const emitter = new VolumetricLightScatteringPostProcess(
        "godrays",
        { passRatio: 0.5, postProcessRatio: 1.0 },
        camera,
        undefined,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );
    const emitterMaterial = emitter.mesh.material as StandardMaterial;
    emitterMaterial.diffuseTexture = new Texture(
        "/Demos/SPS/sun.png",
        scene,
        true,
        false,
        Texture.BILINEAR_SAMPLINGMODE
    );
    emitterMaterial.diffuseTexture.hasAlpha = true;
    emitter.mesh.position = new Vector3(200, 0, 500);
    emitter.mesh.scaling = new Vector3(250, 250, 250);

    let t = 0.0;
    scene.registerBeforeRender(() => {
        SPS.mesh.rotation.z = t / 10;
        t += 0.1;
    });

    return scene;
}
