import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/instancedMesh";

export function createLodScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new FreeCamera("Camera", new Vector3(0, 0, -8), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    scene.fogColor = new Color3(0.05, 0.06, 0.08);
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogStart = 10;
    scene.fogEnd = 55;

    const nearMaterial = new StandardMaterial("near", scene);
    nearMaterial.emissiveColor = new Color3(0.45, 0.45, 0.55);
    nearMaterial.diffuseColor = new Color3(0.2, 0.7, 1);
    const farMaterial = new StandardMaterial("far", scene);
    farMaterial.emissiveColor = new Color3(0.5, 0.05, 0.05);

    const high = CreateTorusKnot(
        "knot0",
        { radius: 0.5, tube: 0.2, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );
    const medium = CreateTorusKnot(
        "knot1",
        { radius: 0.5, tube: 0.2, radialSegments: 32, tubularSegments: 16, p: 2, q: 3 },
        scene
    );
    const low = CreateTorusKnot(
        "knot2",
        { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 8, p: 2, q: 3 },
        scene
    );
    high.material = nearMaterial;
    medium.material = nearMaterial;
    low.material = farMaterial;
    high.setEnabled(false);
    medium.setEnabled(false);
    low.setEnabled(false);
    high.addLODLevel(15, medium);
    high.addLODLevel(35, low);
    high.addLODLevel(55, null);

    for (let x = -3; x <= 3; x++) {
        for (let y = -2; y <= 2; y++) {
            for (let z = 4; z < 9; z++) {
                const knot = high.createInstance("knotI");
                knot.position = new Vector3(x * 4, y * 4, z * 4);
            }
        }
    }

    return scene;
}
