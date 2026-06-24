import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    CreateCylinder,
    CreatePlane,
    DynamicTexture,
    PointLight,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
import { FireMaterial } from "@babylonjs/materials/fire/fireMaterial";

function makeTexture(name: string, scene: Scene, colors: string[]): DynamicTexture {
    const texture = new DynamicTexture(name, { width: 128, height: 128 }, scene);
    const context = texture.getContext();
    const gradient = context.createLinearGradient(0, 128, 0, 0);
    colors.forEach((color, index) => gradient.addColorStop(index / Math.max(1, colors.length - 1), color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    texture.update();
    return texture;
}

export function createFireMaterialScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 16, new Vector3(0, 3, 0), scene);
    camera.attachControl(canvas, true);
    const light = new PointLight("fireLight", new Vector3(0, 8, 0), scene);
    light.diffuse = new Color3(1, 0.55, 0.12);
    const candle = CreateCylinder("candle", { height: 5, diameter: 2, tessellation: 32 }, scene);
    const candleMaterial = new StandardMaterial("candleMaterial", scene);
    candleMaterial.diffuseColor = new Color3(0.78, 0.62, 0.48);
    candle.material = candleMaterial;
    const fire = new FireMaterial("fire", scene);
    fire.diffuseTexture = makeTexture("fireDiffuse", scene, ["#2b0000", "#ff3b00", "#ffd06a"]);
    fire.distortionTexture = makeTexture("fireDistortion", scene, ["#808080", "#ffffff", "#303030"]);
    fire.opacityTexture = makeTexture("fireOpacity", scene, [
        "rgba(0,0,0,0)",
        "rgba(255,255,255,1)",
        "rgba(255,255,255,0)",
    ]);
    fire.speed = 5;
    const flame = CreatePlane("flame", { size: 3 }, scene);
    flame.position.y = 4;
    flame.scaling.y = 1.4;
    flame.billboardMode = 2;
    flame.material = fire;
    return scene;
}
