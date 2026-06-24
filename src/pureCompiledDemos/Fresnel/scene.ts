import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateSphere,
    CubeTexture,
    FresnelParameters,
    LensFlare,
    LensFlareSystem,
    Mesh,
    PointLight,
    RegisterLensFlareSystemSceneComponent,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";

RegisterLensFlareSystemSceneComponent(LensFlareSystem);

const skyboxTextureUrl = "/Scenes/Customs/skybox/TropicalSunnyDay";
const flareTextureUrl = "/Scenes/WorldMonger/Assets/Flare.png";

export function createFresnelScene(engine: Engine): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    const light = new PointLight("Omni0", new Vector3(-17.6, 18.8, -49.9), scene);

    camera.setPosition(new Vector3(-15, 3, 0));

    const sphere1 = CreateSphere("Sphere1", { segments: 32, diameter: 3 }, scene);
    const sphere2 = CreateSphere("Sphere2", { segments: 32, diameter: 3 }, scene);
    const sphere3 = CreateSphere("Sphere3", { segments: 32, diameter: 3 }, scene);
    const sphere4 = CreateSphere("Sphere4", { segments: 32, diameter: 3 }, scene);
    const sphere5 = CreateSphere("Sphere5", { segments: 32, diameter: 3 }, scene);

    sphere2.position.z -= 5;
    sphere3.position.z += 5;
    sphere4.position.x += 5;
    sphere5.position.x -= 5;

    sphere1.material = createReflectiveMaterial("kosh", scene);
    sphere2.material = createBrightReflectiveMaterial(scene);
    sphere3.material = createTransparentWhiteMaterial("kosh3", 0.2, scene);
    sphere4.material = createOpaqueWhiteMaterial(scene);
    sphere5.material = createDarkReflectiveMaterial(scene);

    markAsLensFlareBlocker(sphere2);
    markAsLensFlareBlocker(sphere3);
    markAsLensFlareBlocker(sphere4);
    markAsLensFlareBlocker(sphere5);

    const skybox = CreateBox("skyBox", { size: 100 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    const skyboxTexture = new CubeTexture(skyboxTextureUrl, scene);
    skyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = skyboxTexture;
    skyboxMaterial.diffuseColor = Color3.Black();
    skyboxMaterial.specularColor = Color3.Black();
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    const lensFlareSystem = new LensFlareSystem("lensFlareSystem", light, scene);
    new LensFlare(0.2, 0, Color3.White(), flareTextureUrl, lensFlareSystem);
    new LensFlare(0.5, 0.2, new Color3(0.5, 0.5, 1), flareTextureUrl, lensFlareSystem);
    new LensFlare(0.2, 1, Color3.White(), flareTextureUrl, lensFlareSystem);
    new LensFlare(0.4, 0.4, new Color3(1, 0.5, 1), flareTextureUrl, lensFlareSystem);
    new LensFlare(0.1, 0.6, Color3.White(), flareTextureUrl, lensFlareSystem);
    new LensFlare(0.3, 0.8, Color3.White(), flareTextureUrl, lensFlareSystem);

    scene.registerBeforeRender(() => {
        camera.alpha += 0.01 * scene.getAnimationRatio();
    });

    return scene;
}

function createReflectiveMaterial(name: string, scene: Scene): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.reflectionTexture = new CubeTexture(skyboxTextureUrl, scene);
    material.diffuseColor = Color3.Black();
    material.emissiveColor = new Color3(0.5, 0.5, 0.5);
    material.alpha = 0.2;
    material.specularPower = 16;
    material.reflectionFresnelParameters = new FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.1;
    material.emissiveFresnelParameters = createEmissiveFresnel(0.6, 4, Color3.White(), Color3.Black());
    material.opacityFresnelParameters = createOpacityFresnel(1, Color3.White(), Color3.Black());
    return material;
}

function createBrightReflectiveMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("kosh2", scene);
    material.reflectionTexture = new CubeTexture(skyboxTextureUrl, scene);
    material.diffuseColor = Color3.Black();
    material.emissiveColor = new Color3(0.5, 0.5, 0.5);
    material.specularPower = 32;
    material.reflectionFresnelParameters = new FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.1;
    material.emissiveFresnelParameters = createEmissiveFresnel(0.5, 4, Color3.White(), Color3.Black());
    return material;
}

function createTransparentWhiteMaterial(name: string, alpha: number, scene: Scene): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = Color3.Black();
    material.emissiveColor = Color3.White();
    material.specularPower = 64;
    material.alpha = alpha;
    material.emissiveFresnelParameters = createEmissiveFresnel(0.2, 1, Color3.White(), Color3.Black());
    material.opacityFresnelParameters = createOpacityFresnel(4, Color3.White(), Color3.Black());
    return material;
}

function createOpaqueWhiteMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("kosh4", scene);
    material.diffuseColor = Color3.Black();
    material.emissiveColor = Color3.White();
    material.specularPower = 64;
    material.emissiveFresnelParameters = createEmissiveFresnel(0.5, 4, Color3.White(), Color3.Black());
    return material;
}

function createDarkReflectiveMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("kosh5", scene);
    const reflectionTexture = new CubeTexture(skyboxTextureUrl, scene);
    reflectionTexture.level = 0.5;
    material.diffuseColor = Color3.Black();
    material.reflectionTexture = reflectionTexture;
    material.specularPower = 64;
    material.emissiveColor = new Color3(0.2, 0.2, 0.2);
    material.emissiveFresnelParameters = createEmissiveFresnel(0.4, 2, Color3.Black(), Color3.White());
    return material;
}

function createEmissiveFresnel(bias: number, power: number, leftColor: Color3, rightColor: Color3): FresnelParameters {
    const fresnel = new FresnelParameters();
    fresnel.bias = bias;
    fresnel.power = power;
    fresnel.leftColor = leftColor;
    fresnel.rightColor = rightColor;
    return fresnel;
}

function createOpacityFresnel(power: number, leftColor: Color3, rightColor: Color3): FresnelParameters {
    const fresnel = new FresnelParameters();
    fresnel.power = power;
    fresnel.leftColor = leftColor;
    fresnel.rightColor = rightColor;
    return fresnel;
}

function markAsLensFlareBlocker(mesh: Mesh & { isBlocker?: boolean }): void {
    mesh.isBlocker = true;
}
