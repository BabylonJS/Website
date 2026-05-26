import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createFogScene(engine: Engine): Scene {
    const scene = new Scene(engine);
    const camera = new FreeCamera("Camera", new Vector3(0, 0, -20), scene);
    new PointLight("Omni", new Vector3(20, 100, 2), scene);

    const sphere0 = CreateSphere("Sphere0", { segments: 16, diameter: 3 }, scene);
    const sphere1 = CreateSphere("Sphere1", { segments: 16, diameter: 3 }, scene);
    const sphere2 = CreateSphere("Sphere2", { segments: 16, diameter: 3 }, scene);

    const material0 = new StandardMaterial("mat0", scene);
    material0.diffuseColor = new Color3(1, 0, 0);
    sphere0.material = material0;
    sphere0.position.x = -10;

    const material1 = new StandardMaterial("mat1", scene);
    material1.diffuseColor = new Color3(1, 1, 0);
    sphere1.material = material1;

    const material2 = new StandardMaterial("mat2", scene);
    material2.diffuseColor = new Color3(1, 0, 1);
    sphere2.material = material2;
    sphere2.position.x = 10;

    sphere1.convertToFlatShadedMesh();
    camera.setTarget(Vector3.Zero());

    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogDensity = 0.1;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        sphere0.position.z = 4 * Math.cos(alpha);
        sphere1.position.z = 4 * Math.sin(alpha);
        sphere2.position.z = sphere0.position.z;
        alpha += 0.1;
    });

    return scene;
}
