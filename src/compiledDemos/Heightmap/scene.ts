import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateGroundFromHeightMap } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createHeightmapScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    new PointLight("Omni0", new Vector3(60, 100, 10), scene);

    camera.setPosition(new Vector3(-20, 20, 0));
    camera.attachControl(canvas, true);

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

    const ground = CreateGroundFromHeightMap(
        "ground",
        "./heightMap.png",
        {
            width: 100,
            height: 100,
            subdivisions: 100,
            minHeight: 0,
            maxHeight: 10,
            updatable: false,
        },
        scene
    );

    const groundMaterial = new StandardMaterial("ground", scene);
    const groundTexture = new Texture("./Ground.jpg", scene);
    groundTexture.uScale = 6;
    groundTexture.vScale = 6;
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.specularColor = Color3.Black();
    ground.position.y = -2.05;
    ground.material = groundMaterial;

    scene.registerBeforeRender(() => {
        if (camera.beta < 0.1) {
            camera.beta = 0.1;
        } else if (camera.beta > (Math.PI / 2) * 0.9) {
            camera.beta = (Math.PI / 2) * 0.9;
        }

        if (camera.radius > 50) {
            camera.radius = 50;
        }

        if (camera.radius < 5) {
            camera.radius = 5;
        }
    });

    return scene;
}
