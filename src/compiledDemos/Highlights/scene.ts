import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createHighlightsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.minZ = 0.1;
    new PointLight("point", new Vector3(0, 40, 0), scene);

    const hdrTexture = new HDRCubeTexture("/Demos/Highlights/room.hdr", scene, 512);
    const sphereGlass = CreateSphere("sphereGlass", { segments: 48, diameter: 30 }, scene);
    sphereGlass.position.x = -60;
    const sphereMetal = CreateSphere("sphereMetal", { segments: 48, diameter: 30 }, scene);
    sphereMetal.position.x = 60;
    const spherePlastic = CreateSphere("spherePlastic", { segments: 48, diameter: 30 }, scene);
    spherePlastic.position.z = -60;
    const woodPlank = CreateBox("plane", { width: 65, height: 1, depth: 65 }, scene);

    const glass = new PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new Color3(0.95, 0.95, 0.95);
    sphereGlass.material = glass;

    const metal = new PBRMaterial("metal", scene);
    metal.reflectionTexture = hdrTexture;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new Color3(0.9, 0.9, 0.9);
    metal.albedoColor = Color3.White();
    sphereMetal.material = metal;

    const plastic = new PBRMaterial("plastic", scene);
    plastic.reflectionTexture = hdrTexture;
    plastic.microSurface = 0.96;
    plastic.albedoColor = new Color3(0.206, 0.94, 1);
    plastic.reflectivityColor = new Color3(0.05, 0.05, 0.05);
    spherePlastic.material = plastic;

    const wood = new PBRMaterial("wood", scene);
    wood.reflectionTexture = hdrTexture;
    wood.reflectivityTexture = new Texture("/Demos/Highlights/reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    wood.albedoTexture = new Texture("/Demos/Highlights/albedo.png", scene);
    woodPlank.material = wood;

    const whiteHighlight = new HighlightLayer("hlWhite", scene);
    whiteHighlight.addMesh(sphereMetal, Color3.White());
    const greenHighlight = new HighlightLayer("hlGreen", scene);
    greenHighlight.addMesh(spherePlastic, Color3.Green());
    const redHighlight = new HighlightLayer("hlRed", scene);
    redHighlight.addMesh(sphereGlass, Color3.Red());

    let alpha = 0;
    scene.registerBeforeRender(() => {
        const blur = 0.4 + Math.cos(alpha);
        whiteHighlight.blurHorizontalSize = blur;
        whiteHighlight.blurVerticalSize = blur;
        alpha += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
