import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";

const rootUrl = "https://www.babylonjs.com/Assets/glTFMeshPrimitiveAttributeTest/";

export async function createGltfMeshPrimitiveAttributeTestScene(
    engine: Engine,
    canvas: HTMLCanvasElement
): Promise<Scene> {
    const scene = new Scene(engine);
    const hdrTexture = CubeTexture.CreateFromPrefilteredData("https://www.babylonjs.com/Assets/environment.dds", scene);
    hdrTexture.gammaSpace = false;
    scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), scene);
    camera.wheelPrecision = 100;
    camera.attachControl(canvas, true);

    const title = createLabel(scene, "Generated Normal Attribute");
    title.position = new Vector3(0, 1.7, 0);

    await Promise.all([
        loadModel(scene, "NoNormalsBottom.gltf", new Vector3(-1.5, 0.7, 0), "Bottom Primitive"),
        loadModel(scene, "NoNormalsMiddle.gltf", new Vector3(0, 0.7, 0), "Middle Primitive"),
        loadModel(scene, "NoNormalsTop.gltf", new Vector3(1.5, 0.7, 0), "Top Primitive"),
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
    root.rotation = new Vector3(0, Math.PI, 0);

    const label = createLabel(scene, caption);
    label.position = center.clone();
    label.position.y -= 2;
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
