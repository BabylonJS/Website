import type { Engine } from "@babylonjs/core/pure";
import type { GroundMesh } from "@babylonjs/core/Meshes/groundMesh";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    Axis,
    Color3,
    CreateBox,
    CreateGroundFromHeightMap,
    CubeTexture,
    DirectionalLight,
    FreeCamera,
    ImportMeshAsync,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterGroundMesh,
    RegisterInstancedMesh,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    Space,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterGroundMesh();
RegisterInstancedMesh();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export function createInstancesScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const light = new DirectionalLight("dir01", new Vector3(0, -1, -0.3), scene);
    const camera = new FreeCamera("Camera", new Vector3(0, 10, -20), scene);
    camera.speed = 0.4;

    light.position = new Vector3(20, 60, 30);

    scene.ambientColor = Color3.FromInts(10, 30, 10);
    scene.clearColor = Color3.FromInts(127, 165, 13).toColor4(1);
    scene.gravity = new Vector3(0, -0.5, 0);

    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogDensity = 0.02;
    scene.fogColor = new Color3(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b);

    const skybox = CreateBox("skyBox", { size: 150.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/Scenes/Customs/skybox/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    const makeBorder = (name: string, scaling: Vector3, position: Partial<{ x: number; z: number }>): void => {
        const border = CreateBox(name, { size: 1 }, scene);
        border.scaling = scaling;
        if (position.x !== undefined) {
            border.position.x = position.x;
        }
        if (position.z !== undefined) {
            border.position.z = position.z;
        }
        border.checkCollisions = true;
        border.isVisible = false;
    };
    makeBorder("border0", new Vector3(1, 100, 100), { x: -50.0 });
    makeBorder("border1", new Vector3(1, 100, 100), { x: 50.0 });
    makeBorder("border2", new Vector3(100, 100, 1), { z: 50.0 });
    makeBorder("border3", new Vector3(100, 100, 1), { z: -50.0 });

    const ground = CreateGroundFromHeightMap(
        "ground",
        "/Scenes/Customs/heightMap.png",
        {
            width: 100,
            height: 100,
            subdivisions: 100,
            minHeight: 0,
            maxHeight: 5,
            updatable: false,
            onReady: (groundMesh: GroundMesh) => {
                groundMesh.optimize(100);

                const shadowGenerator = new ShadowGenerator(1024, light);

                void ImportMeshAsync("/Scenes/Tree/tree.babylon", scene).then((result) => {
                    const tree = result.meshes[0] as Mesh;
                    const treeMaterial = tree.material as StandardMaterial | null;
                    if (treeMaterial) {
                        treeMaterial.opacityTexture = null;
                        treeMaterial.backFaceCulling = false;
                    }
                    tree.isVisible = false;
                    tree.position.y = groundMesh.getHeightAtCoordinates(0, 0);

                    shadowGenerator.getShadowMap()!.renderList!.push(tree);
                    const range = 60;
                    const count = 100;
                    for (let index = 0; index < count; index++) {
                        const newInstance = tree.createInstance("i" + index);
                        const x = range / 2 - Math.random() * range;
                        const z = range / 2 - Math.random() * range;
                        const y = groundMesh.getHeightAtCoordinates(x, z);
                        newInstance.position = new Vector3(x, y, z);
                        newInstance.rotate(Axis.Y, Math.random() * Math.PI * 2, Space.WORLD);
                        const scale = 0.5 + Math.random() * 2;
                        newInstance.scaling.addInPlace(new Vector3(scale, scale, scale));
                        shadowGenerator.getShadowMap()!.renderList!.push(newInstance);
                    }
                    shadowGenerator.getShadowMap()!.refreshRate = 0;
                    shadowGenerator.usePoissonSampling = true;

                    camera.checkCollisions = true;
                    camera.applyGravity = true;
                });
            },
        },
        scene
    );

    const groundMaterial = new StandardMaterial("ground", scene);
    const groundTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);
    groundMaterial.diffuseTexture = groundTexture;
    groundTexture.uScale = 6;
    groundTexture.vScale = 6;
    groundMaterial.specularColor = new Color3(0, 0, 0);
    groundMaterial.emissiveColor = new Color3(0.3, 0.3, 0.3);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.checkCollisions = true;

    camera.attachControl(canvas, true);

    return scene;
}
