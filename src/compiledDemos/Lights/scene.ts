import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createLightsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    const light0 = new PointLight("Omni0", new Vector3(0, 10, 0), scene);
    const light1 = new PointLight("Omni1", new Vector3(0, -10, 0), scene);
    const light2 = new PointLight("Omni2", new Vector3(10, 0, 0), scene);
    const light3 = new DirectionalLight("Dir0", new Vector3(1, -1, 0), scene);
    const material = new StandardMaterial("kosh", scene);
    const sphere = CreateSphere("Sphere", { segments: 16, diameter: 3 }, scene);

    camera.setPosition(new Vector3(-10, 10, 0));
    camera.attachControl(canvas, true);
    light3.parent = camera;

    const lightSphere0 = CreateSphere("Sphere0", { segments: 16, diameter: 0.5 }, scene);
    const lightSphere1 = CreateSphere("Sphere1", { segments: 16, diameter: 0.5 }, scene);
    const lightSphere2 = CreateSphere("Sphere2", { segments: 16, diameter: 0.5 }, scene);

    lightSphere0.material = createEmissiveMaterial("red", new Color3(1, 0, 0), scene);
    lightSphere1.material = createEmissiveMaterial("green", new Color3(0, 1, 0), scene);
    lightSphere2.material = createEmissiveMaterial("blue", new Color3(0, 0, 1), scene);

    material.diffuseColor = Color3.White();
    sphere.material = material;

    light0.diffuse = new Color3(1, 0, 0);
    light0.specular = new Color3(1, 0, 0);
    light1.diffuse = new Color3(0, 1, 0);
    light1.specular = new Color3(0, 1, 0);
    light2.diffuse = new Color3(0, 0, 1);
    light2.specular = new Color3(0, 0, 1);
    light3.diffuse = Color3.White();
    light3.specular = Color3.White();

    const skybox = CreateBox("skyBox", { size: 100 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    const skyboxTexture = new CubeTexture("/Scenes/Customs/skybox/skybox", scene);
    skyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = skyboxTexture;
    skyboxMaterial.diffuseColor = Color3.Black();
    skyboxMaterial.specularColor = Color3.Black();
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        light0.position.set(10 * Math.sin(alpha), 0, 10 * Math.cos(alpha));
        light1.position.set(10 * Math.sin(alpha), 0, -10 * Math.cos(alpha));
        light2.position.set(10 * Math.cos(alpha), 0, 10 * Math.sin(alpha));

        lightSphere0.position.copyFrom(light0.position);
        lightSphere1.position.copyFrom(light1.position);
        lightSphere2.position.copyFrom(light2.position);

        alpha += 0.01;
    });

    return scene;
}

function createEmissiveMaterial(name: string, color: Color3, scene: Scene): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = Color3.Black();
    material.specularColor = Color3.Black();
    material.emissiveColor = color;
    return material;
}
