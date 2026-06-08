import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import type { Material } from "@babylonjs/core/Materials/material";
import type { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { LoadSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Engines/Extensions/engine.cubeTexture";

export async function createGlowingEspilitScene(engine: Engine): Promise<Scene> {
    const scene = await LoadSceneAsync("/Scenes/Espilit/Espilit.binary.babylon", engine);
    scene.collisionsEnabled = true;
    scene.autoClear = true;

    const solLoin = scene.getMeshByName("Sol loin") as Mesh | null;
    if (solLoin) {
        solLoin.useVertexColors = false;
    }
    scene.gravity.scaleInPlace(0.5);

    const glow = new GlowLayer("glow", scene, { mainTextureSamples: 4 });
    glow.customEmissiveColorSelector = (mesh: Mesh, _subMesh: SubMesh, _material: Material, result: Color4): void => {
        if (mesh.name === "Bandes lum") {
            result.set(1, 1, 1, 1);
        } else {
            result.set(0, 0, 0, 0);
        }
    };

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    return scene;
}
