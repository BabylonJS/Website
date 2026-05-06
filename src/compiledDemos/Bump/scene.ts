import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createBumpScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    new PointLight("Omni", new Vector3(20, 100, 2), scene);

    const sphere = CreateSphere("Sphere", { segments: 16, diameter: 3 }, scene);
    const material = new StandardMaterial("kosh", scene);
    const bumpTexture = new Texture("/Scenes/Customs/normalMap.jpg", scene);
    bumpTexture.level = 1;
    material.bumpTexture = bumpTexture;
    material.diffuseColor = new Color3(1, 0, 0);
    sphere.material = material;

    camera.setPosition(new Vector3(-5, 5, 0));
    camera.attachControl(canvas, true);

    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.02;
    });

    return scene;
}
