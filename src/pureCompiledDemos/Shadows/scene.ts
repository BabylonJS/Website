import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateGround,
    CreateTorus,
    CubeTexture,
    DirectionalLight,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";

RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterEnginesExtensionsEngineRawTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export function createShadowsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    const light = new DirectionalLight("dir01", new Vector3(0, -1, -0.2), scene);
    const light2 = new DirectionalLight("dir02", new Vector3(-1, -2, -1), scene);

    light.position = new Vector3(0, 30, 0);
    light2.position = new Vector3(10, 20, 10);
    light.intensity = 0.6;
    light2.intensity = 0.6;

    camera.setPosition(new Vector3(-20, 20, 0));
    camera.attachControl(canvas, true);

    const skybox = CreateBox("skyBox", { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    const skyboxTexture = new CubeTexture("/Scenes/Customs/skybox/night", scene);
    skyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = skyboxTexture;
    skyboxMaterial.diffuseColor = Color3.Black();
    skyboxMaterial.specularColor = Color3.Black();
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    const grassTexture = new Texture("/Demos/Shadows/grass.jpg", scene);
    grassTexture.uScale = 60;
    grassTexture.vScale = 60;
    groundMaterial.diffuseTexture = grassTexture;
    groundMaterial.specularColor = Color3.Black();
    ground.position.y = -2.05;
    ground.material = groundMaterial;

    const torus = CreateTorus("torus", { diameter: 8, thickness: 2, tessellation: 32 }, scene);
    torus.position.y = 6;
    const torus2 = CreateTorus("torus2", { diameter: 4, thickness: 1, tessellation: 32 }, scene);
    torus2.position.y = 6;

    const torusMaterial = new StandardMaterial("torus", scene);
    torusMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    torusMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    torus.material = torusMaterial;
    torus2.material = torusMaterial;

    const shadowGenerator = new ShadowGenerator(512, light);
    shadowGenerator.getShadowMap()?.renderList?.push(torus, torus2);
    shadowGenerator.useExponentialShadowMap = true;

    const shadowGenerator2 = new ShadowGenerator(512, light2);
    shadowGenerator2.getShadowMap()?.renderList?.push(torus, torus2);
    shadowGenerator2.useExponentialShadowMap = true;

    ground.receiveShadows = true;

    scene.registerBeforeRender(() => {
        camera.beta = Math.min(Math.max(camera.beta, 0.1), (Math.PI / 2) * 0.99);
        camera.radius = Math.min(Math.max(camera.radius, 5), 150);
        torus.rotation.x += 0.01;
        torus.rotation.z += 0.02;
        torus2.rotation.x += 0.02;
        torus2.rotation.y += 0.01;
    });

    return scene;
}
