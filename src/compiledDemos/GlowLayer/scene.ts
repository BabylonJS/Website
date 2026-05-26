import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createGlowLayerScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 18, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 1.2;
    const material = new StandardMaterial("emissive", scene);
    material.emissiveColor = new Color3(0.2, 0.8, 1);
    const knot = CreateTorusKnot("knot", { radius: 3, tube: 0.7, radialSegments: 128, tubularSegments: 32 }, scene);
    knot.material = material;
    scene.registerBeforeRender(() => {
        knot.rotation.y += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
