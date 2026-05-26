import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Axis, Space } from "@babylonjs/core/Maths/math.axis";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { Scene } from "@babylonjs/core/scene";
import { CellMaterial } from "@babylonjs/materials/cell/cellMaterial";
import "@babylonjs/core/Meshes/instancedMesh";

let seed = 2026;
function random(): number {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
}

export function createCellShadingScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    seed = 2026;
    const scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0, 1);
    new PointLight("point01", new Vector3(0, 8, 0), scene);
    const camera = new FreeCamera("camera", new Vector3(0, 10, 7), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const groundMaterial = new CellMaterial("groundCell", scene);
    groundMaterial.backFaceCulling = false;
    const groundTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);
    groundTexture.uScale = 16;
    groundTexture.vScale = 16;
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.computeHighLevel = true;
    const ground = CreateGround("ground", { width: 100, height: 100, subdivisions: 100 }, scene);
    ground.material = groundMaterial;

    const cellMaterial = new CellMaterial("cell", scene);
    cellMaterial.backFaceCulling = false;
    cellMaterial.diffuseColor = Color3.White();
    cellMaterial.computeHighLevel = true;
    const knot = CreateTorusKnot(
        "knot",
        { radius: 1, tube: 0.4, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );
    knot.position.y = 3;
    knot.material = cellMaterial;

    for (let index = 0; index < 100; index++) {
        const instance = knot.createInstance(`i${index}`);
        instance.position = new Vector3(30 - random() * 60, 3, 30 - random() * 60);
        instance.rotate(Axis.Y, random() * Math.PI * 2, Space.WORLD);
    }

    return scene;
}
