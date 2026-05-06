import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";

const rootUrl = "https://www.babylonjs.com/Assets/TestCube/";

export async function createGltfNormalsScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    new DirectionalLight("light", new Vector3(1, -1, 1), scene);

    const sphere = CreateSphere("sphere", { segments: 16, diameter: 0.5 }, scene);
    const sphereMaterial = new PBRMaterial("sphereMaterial", scene);
    sphere.position.y = 1;
    sphereMaterial.metallic = 0;
    sphere.material = sphereMaterial;

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 6, Vector3.Zero(), scene);
    camera.wheelPrecision = 100;
    camera.attachControl(canvas, true);

    await Promise.all([
        loadModel(scene, "TestCube1.gltf", new Vector3(-2, -0.5, 0), "Normals + Tangents"),
        loadModel(scene, "TestCube2.gltf", new Vector3(0, -0.5, 0), "Normals Only"),
        loadModel(scene, "TestCube3.gltf", new Vector3(2, -0.5, 0), "No Normals/Tangents"),
    ]);

    return scene;
}

async function loadModel(scene: Scene, name: string, center: Vector3, caption: string): Promise<void> {
    const result = await ImportMeshAsync(name, scene, { rootUrl });
    const root = new Mesh(`${name} root`, scene);

    result.meshes.forEach((mesh) => {
        if (!mesh.parent) {
            mesh.setParent(root);
        }
    });

    root.position = center;
    root.rotation = new Vector3(Math.PI / 4, Math.PI / 4, 0);

    const label = createLabel(scene, caption);
    label.position = center.clone();
    label.position.y -= 1;
}

function createLabel(scene: Scene, text: string): Mesh {
    const dynamicTexture = new DynamicTexture("DynamicTexture", 512, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, null, null, "36px Arial", "white", "transparent");

    const plane = CreatePlane("TextPlane", { size: 2 }, scene);
    const material = new StandardMaterial("TextPlaneMaterial", scene);
    material.backFaceCulling = false;
    material.specularColor = Color3.Black();
    material.diffuseTexture = dynamicTexture;
    material.useAlphaFromDiffuseTexture = true;
    plane.material = material;

    return plane;
}
