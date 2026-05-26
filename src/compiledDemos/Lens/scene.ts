import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { LensFlare } from "@babylonjs/core/LensFlares/lensFlare";
import { LensFlareSystem } from "@babylonjs/core/LensFlares/lensFlareSystem";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createLensScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 2.8, 2.25, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new PointLight("Omni0", new Vector3(21.84, 50, -28.26), scene);

    const lightSphere = CreateSphere("Sphere0", { segments: 16, diameter: 0.5 }, scene);
    const lightMaterial = new StandardMaterial("white", scene);
    lightMaterial.diffuseColor = Color3.Black();
    lightMaterial.specularColor = Color3.Black();
    lightMaterial.emissiveColor = Color3.White();
    lightSphere.material = lightMaterial;
    lightSphere.position = light.position;

    const system = new LensFlareSystem("lensFlareSystem", light, scene);
    new LensFlare(0.2, 0, Color3.White(), "/Demos/Lens/lens5.png", system);
    new LensFlare(0.5, 0.2, new Color3(0.5, 0.5, 1), "/Demos/Lens/lens4.png", system);
    new LensFlare(0.2, 1, Color3.White(), "/Demos/Lens/lens4.png", system);
    new LensFlare(0.4, 0.4, new Color3(1, 0.5, 1), "/Scenes/Assets/flare.png", system);
    new LensFlare(0.1, 0.6, Color3.White(), "/Demos/Lens/lens5.png", system);
    new LensFlare(0.3, 0.8, Color3.White(), "/Demos/Lens/lens4.png", system);

    const skybox = CreateBox("skyBox", { size: 100 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/Scenes/Customs/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = Color3.Black();
    skyboxMaterial.specularColor = Color3.Black();
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    return scene;
}
