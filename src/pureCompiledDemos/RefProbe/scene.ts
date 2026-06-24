import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateSphere,
    CreateTorusKnot,
    FresnelParameters,
    HemisphericLight,
    Matrix,
    MirrorTexture,
    Plane,
    ReflectionProbe,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetCube,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterMirrorTexture,
    RegisterReflectionProbe,
    RegisterRenderTargetTexture,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
import type { AbstractMesh, Engine } from "@babylonjs/core/pure";

RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterEnginesExtensionsEngineRenderTargetCube();
RegisterRenderTargetTexture();
RegisterReflectionProbe();
RegisterMirrorTexture();

export function createRefProbeScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera1", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0, 5, -10));
    camera.upperBetaLimit = Math.PI / 2;
    camera.lowerRadiusLimit = 4;
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const knot = CreateTorusKnot(
        "knot",
        { radius: 1, tube: 0.4, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );

    const yellowSphere = CreateSphere("yellowSphere", { segments: 16, diameter: 1.5 }, scene);
    yellowSphere.setPreTransformMatrix(Matrix.Translation(3, 0, 0));

    const blueSphere = CreateSphere("blueSphere", { segments: 16, diameter: 1.5 }, scene);
    blueSphere.setPreTransformMatrix(Matrix.Translation(-1, 3, 0));

    const greenSphere = CreateSphere("greenSphere", { segments: 16, diameter: 1.5 }, scene);
    greenSphere.setPreTransformMatrix(Matrix.Translation(0, 0, 3));

    const generateSatelliteMaterial = (root: AbstractMesh, color: Color3, others: AbstractMesh[]): void => {
        const material = new StandardMaterial("satelliteMat" + root.name, scene);
        material.diffuseColor = color;
        const probe = new ReflectionProbe("satelliteProbe" + root.name, 512, scene);
        for (let index = 0; index < others.length; index++) {
            probe.renderList?.push(others[index]);
        }
        material.reflectionTexture = probe.cubeTexture;
        material.reflectionFresnelParameters = new FresnelParameters();
        material.reflectionFresnelParameters.bias = 0.02;
        root.material = material;
        probe.attachToMesh(root);
    };

    const mirror = CreateBox("Mirror", { size: 1.0 }, scene);
    mirror.scaling = new Vector3(100.0, 0.01, 100.0);
    const mirrorMaterial = new StandardMaterial("mirror", scene);
    const mirrorDiffuse = new Texture("/Scenes/Customs/Ground.jpg", scene);
    mirrorDiffuse.uScale = 10;
    mirrorDiffuse.vScale = 10;
    mirrorMaterial.diffuseTexture = mirrorDiffuse;
    const mirrorReflection = new MirrorTexture("mirror", 1024, scene, true);
    mirrorReflection.mirrorPlane = new Plane(0, -1.0, 0, -2.0);
    mirrorReflection.renderList = [greenSphere, yellowSphere, blueSphere, knot];
    mirrorReflection.level = 0.5;
    mirrorMaterial.reflectionTexture = mirrorReflection;
    mirror.material = mirrorMaterial;
    mirror.position = new Vector3(0, -2, 0);

    const mainMaterial = new StandardMaterial("main", scene);
    knot.material = mainMaterial;

    const probe = new ReflectionProbe("main", 512, scene);
    probe.renderList?.push(yellowSphere);
    probe.renderList?.push(greenSphere);
    probe.renderList?.push(blueSphere);
    probe.renderList?.push(mirror);
    mainMaterial.diffuseColor = new Color3(1, 0.5, 0.5);
    mainMaterial.reflectionTexture = probe.cubeTexture;
    mainMaterial.reflectionFresnelParameters = new FresnelParameters();
    mainMaterial.reflectionFresnelParameters.bias = 0.02;

    generateSatelliteMaterial(yellowSphere, Color3.Yellow(), [greenSphere, blueSphere, knot, mirror]);
    generateSatelliteMaterial(greenSphere, Color3.Green(), [yellowSphere, blueSphere, knot, mirror]);
    generateSatelliteMaterial(blueSphere, Color3.Blue(), [greenSphere, yellowSphere, knot, mirror]);

    (yellowSphere.material as StandardMaterial).alpha = 0.8;

    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogColor = new Color3(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b);
    scene.fogStart = 20.0;
    scene.fogEnd = 50.0;

    scene.registerBeforeRender(() => {
        yellowSphere.rotation.y += 0.01;
        greenSphere.rotation.y += 0.01;
        blueSphere.rotation.y += 0.01;
    });

    return scene;
}
