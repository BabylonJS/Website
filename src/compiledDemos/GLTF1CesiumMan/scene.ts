import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";

export async function createGltf1CesiumManScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);
    scene.useRightHandedSystem = true;

    const hdrTexture = CubeTexture.CreateFromPrefilteredData("https://www.babylonjs.com/Assets/environment.dds", scene);
    hdrTexture.gammaSpace = false;
    scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 3, new Vector3(0, 0.7, 0.8), scene);
    camera.wheelPrecision = 100;
    camera.attachControl(canvas, true);

    const result = await ImportMeshAsync("CesiumMan.gltf", scene, {
        rootUrl: "https://www.babylonjs.com/Assets/glTF1CesiumMan/",
    });
    const root = new Mesh("root", scene);

    result.meshes.forEach((mesh) => {
        if (!mesh.parent) {
            mesh.setParent(root);
        }
    });
    root.rotation = new Vector3(0, Math.PI, 0);

    return scene;
}
