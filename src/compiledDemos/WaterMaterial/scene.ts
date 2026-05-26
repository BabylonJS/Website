import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { Scene } from "@babylonjs/core/scene";
import { WaterMaterial } from "@babylonjs/materials/water/waterMaterial";

export function createWaterMaterialScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 45, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const bumpTexture = new DynamicTexture("waterBump", { width: 64, height: 64 }, scene);
    const context = bumpTexture.getContext();
    context.fillStyle = "#8080ff";
    context.fillRect(0, 0, 64, 64);
    context.strokeStyle = "#c0c0ff";
    for (let line = 0; line < 64; line += 8) {
        context.beginPath();
        context.moveTo(0, line);
        context.lineTo(64, 64 - line);
        context.stroke();
    }
    bumpTexture.update();
    const water = new WaterMaterial("water", scene, new Vector2(256, 256));
    water.bumpTexture = bumpTexture;
    water.windForce = -4;
    water.waveHeight = 0.25;
    water.waterColor = new Color3(0.1, 0.35, 0.65);
    water.colorBlendFactor = 0.35;
    const ground = CreateGround("waterGround", { width: 40, height: 40, subdivisions: 32 }, scene);
    ground.material = water;
    const islandMaterial = new StandardMaterial("islandMaterial", scene);
    islandMaterial.diffuseColor = new Color3(0.8, 0.62, 0.35);
    for (let index = 0; index < 5; index++) {
        const box = CreateBox(`island${index}`, { size: 3 }, scene);
        box.position.set(index * 6 - 12, 1.5, Math.sin(index) * 5);
        box.material = islandMaterial;
        water.addToRenderList(box);
    }
    return scene;
}
