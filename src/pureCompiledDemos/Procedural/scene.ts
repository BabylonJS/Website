import type { Engine } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateCylinder,
    CreateGround,
    CreateSphere,
    CreateTorus,
    CustomProceduralTexture,
    DirectionalLight,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterProceduralTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    Space,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
import { WoodProceduralTexture } from "@babylonjs/procedural-textures/wood/woodProceduralTexture";
import { GrassProceduralTexture } from "@babylonjs/procedural-textures/grass/grassProceduralTexture";
import { MarbleProceduralTexture } from "@babylonjs/procedural-textures/marble/marbleProceduralTexture";
import { FireProceduralTexture } from "@babylonjs/procedural-textures/fire/fireProceduralTexture";
import { BrickProceduralTexture } from "@babylonjs/procedural-textures/brick/brickProceduralTexture";
import { RoadProceduralTexture } from "@babylonjs/procedural-textures/road/roadProceduralTexture";
import { CloudProceduralTexture } from "@babylonjs/procedural-textures/cloud/cloudProceduralTexture";

RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterProceduralTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export function createProceduralScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 1, 1.2, 25, new Vector3(10, 0, 0), scene);
    camera.upperBetaLimit = 1.2;
    camera.attachControl(canvas, true);

    const name = "town";

    const woodMaterial = new StandardMaterial(name, scene);
    const woodTexture = new WoodProceduralTexture(name + "text", 1024, scene);
    woodTexture.ampScale = 50.0;
    woodMaterial.diffuseTexture = woodTexture;

    const grassMaterial = new StandardMaterial(name + "bawl", scene);
    const grassTexture = new GrassProceduralTexture(name + "textbawl", 256, scene);
    grassMaterial.ambientTexture = grassTexture;

    const marbleMaterial = new StandardMaterial("torus", scene);
    const marbleTexture = new MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 5;
    marbleTexture.numberOfTilesWidth = 5;
    marbleMaterial.ambientTexture = marbleTexture;

    const fireMaterial = new StandardMaterial("fontainSculptur2", scene);
    const fireTexture = new FireProceduralTexture("fire", 256, scene);
    fireMaterial.diffuseTexture = fireTexture;
    fireMaterial.opacityTexture = fireTexture;

    const brickMaterial = new StandardMaterial(name, scene);
    const brickTexture = new BrickProceduralTexture(name + "text", 512, scene);
    brickTexture.numberOfBricksHeight = 2;
    brickTexture.numberOfBricksWidth = 3;
    brickMaterial.diffuseTexture = brickTexture;

    const light = new DirectionalLight("dir01", new Vector3(-0.5, -1, -0.5), scene);
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 1, 1);
    light.position = new Vector3(20, 40, 20);

    const square = CreateGround("square", { width: 20, height: 20, subdivisions: 2 }, scene);
    square.position = new Vector3(0, 0, 0);
    const customMaterial = new StandardMaterial("custommat", scene);
    const customProcText = new CustomProceduralTexture("customtext", "/Demos/Procedural/land", 1024, scene);
    customMaterial.ambientTexture = customProcText;
    square.material = customMaterial;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.bias = 0;
    square.receiveShadows = true;

    const pushShadow = (mesh: Mesh) => {
        shadowGenerator.getShadowMap()!.renderList!.push(mesh);
    };

    const createBosquet = (bname: string, x: number, y: number, z: number) => {
        const bosquet = CreateBox(bname, { size: 2 }, scene);
        bosquet.position = new Vector3(x, y, z);
        bosquet.material = grassMaterial;

        const bosquetbawl = CreateBox(bname + "bawl", { size: 1 }, scene);
        bosquetbawl.position = new Vector3(x, y + 1, z);
        bosquetbawl.material = grassMaterial;

        pushShadow(bosquet);
        pushShadow(bosquetbawl);
    };

    const createTree = (tname: string, x: number, y: number, z: number) => {
        const trunk = CreateCylinder(
            tname + "trunk",
            { height: 7, diameterTop: 2, diameterBottom: 2, tessellation: 12, subdivisions: 1 },
            scene
        );
        trunk.position = new Vector3(x, y, z);
        trunk.material = woodMaterial;

        const leafs = CreateSphere(tname + "leafs", { segments: 20, diameter: 7 }, scene);
        leafs.position = new Vector3(x, y + 5.0, z);
        leafs.material = grassMaterial;

        pushShadow(trunk);
        pushShadow(leafs);
    };

    const createFontain = (x: number, y: number, z: number) => {
        const torus = CreateTorus("torus", { diameter: 5, thickness: 1, tessellation: 20 }, scene);
        torus.position = new Vector3(x, y, z);
        torus.material = marbleMaterial;

        const fontainGround = CreateBox("fontainGround", { size: 4 }, scene);
        fontainGround.position = new Vector3(x, y - 2, z);
        fontainGround.material = marbleMaterial;

        const fontainSculptur1 = CreateCylinder(
            "fontainSculptur1",
            { height: 2, diameterTop: 2, diameterBottom: 1, tessellation: 10, subdivisions: 1 },
            scene
        );
        fontainSculptur1.position = new Vector3(x, y, z);
        fontainSculptur1.material = marbleMaterial;

        const fontainSculptur2 = CreateSphere("fontainSculptur2", { segments: 7, diameter: 1.7 }, scene);
        fontainSculptur2.position = new Vector3(x, y + 0.9, z);
        fontainSculptur2.material = fireMaterial;
        fontainSculptur2.rotate(new Vector3(1.0, 0.0, 0.0), Math.PI / 2.0, Space.LOCAL);

        pushShadow(torus);
        pushShadow(fontainSculptur1);
        pushShadow(fontainSculptur2);
    };

    const createTorch = (cname: string, x: number, y: number, z: number) => {
        const brickblock = CreateBox(cname + "brickblock", { size: 1 }, scene);
        brickblock.position = new Vector3(x, y, z);
        brickblock.material = brickMaterial;

        const torchwood = CreateCylinder(
            cname + "torchwood",
            { height: 2, diameterTop: 0.25, diameterBottom: 0.1, tessellation: 12, subdivisions: 1 },
            scene
        );
        torchwood.position = new Vector3(x, y + 1, z);
        torchwood.material = woodMaterial;

        const leafs2 = CreateSphere(cname + "leafs2", { segments: 10, diameter: 1.2 }, scene);
        leafs2.position = new Vector3(x, y + 2, z);
        leafs2.material = grassMaterial;

        pushShadow(torchwood);
        pushShadow(leafs2);
        pushShadow(brickblock);
    };

    createBosquet("b1", -9, 1, 9);
    createBosquet("b2", -9, 1, -9);
    createBosquet("b3", 9, 1, 9);
    createBosquet("b4", 9, 1, -9);

    createTree("a1", 0, 3.5, 0);

    const macadam = CreateGround("macadam", { width: 20, height: 20, subdivisions: 2 }, scene);
    macadam.position = new Vector3(20, 0, 0);
    const customMaterialmacadam = new StandardMaterial("macadam", scene);
    const customProcTextmacadam = new RoadProceduralTexture("customtextroad", 512, scene);
    customMaterialmacadam.diffuseTexture = customProcTextmacadam;
    macadam.material = customMaterialmacadam;
    macadam.receiveShadows = true;

    createFontain(20, 0.25, 0);
    createTorch("torch1", 15, 0.5, 5);
    createTorch("torch2", 15, 0.5, -5);
    createTorch("torch3", 25, 0.5, 5);
    createTorch("torch4", 25, 0.5, -5);

    const boxCloud = CreateSphere("boxCloud", { segments: 100, diameter: 1000 }, scene);
    boxCloud.position = new Vector3(0, 0, 12);
    const cloudMaterial = new StandardMaterial("cloudMat", scene);
    const cloudProcText = new CloudProceduralTexture("cloud", 1024, scene);
    cloudMaterial.emissiveTexture = cloudProcText;
    cloudMaterial.backFaceCulling = false;
    cloudMaterial.emissiveTexture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;
    boxCloud.material = cloudMaterial;

    scene.registerBeforeRender(() => {
        camera.alpha += 0.001 * scene.getAnimationRatio();
    });

    return scene;
}
