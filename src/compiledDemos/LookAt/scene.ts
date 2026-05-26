import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/instancedMesh";

let seed = 42;
function rnd(min: number, max: number): number {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return Math.floor((seed / 0x7fffffff) * (max - min + 1) + min);
}

export function createLookAtScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    seed = 42;
    const scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0, 1);

    const camera = new ArcRotateCamera("Camera", 3.2, 1.0, 135, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new PointLight("light1", new Vector3(0, 10, 0), scene);
    const hemispheric = new HemisphericLight("hemi", new Vector3(0, 10, 0), scene);
    hemispheric.diffuse = Color3.White();

    const target = CreateSphere("target", { segments: 32, diameter: 5 }, scene);
    const targetMaterial = new StandardMaterial("targetMaterial", scene);
    target.material = targetMaterial;

    const cubeMaterial = new StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseTexture = new Texture("/Demos/LookAt/square.jpg", scene);
    const cubes: Mesh[] = [];
    const source = CreateBox("b", { size: 1 }, scene);
    source.material = cubeMaterial;

    for (let index = 0; index < 700; index++) {
        const cube = index === 0 ? source : source.createInstance(`b${index}`);
        cube.position = new Vector3(rnd(-50, 50), rnd(-50, 50), rnd(-50, 50));
        cube.scaling = new Vector3(rnd(1, 2), rnd(1, 2), rnd(1, 10));
        cube.lookAt(Vector3.Zero());
        cubes.push(cube as Mesh);
    }

    const container = CreateBox("container", { size: 110 }, scene);
    const containerMaterial = new StandardMaterial("containerMaterial", scene);
    containerMaterial.alpha = 0.1;
    container.material = containerMaterial;

    const targetPosition = new Vector3();
    let alpha = 0;
    scene.registerBeforeRender(() => {
        targetPosition.set(25 * Math.cos(alpha / 3.5), 25 + 10 * Math.sin(alpha / 4), 25 * Math.cos(alpha / 4.5));
        const red = 0.5 + 0.5 * Math.sin(alpha / 12);
        const green = 0.5 + 0.5 * Math.sin(alpha / 14);
        const blue = 0.5 + 0.5 * Math.sin(alpha / 16);
        targetMaterial.diffuseColor.set(red, green, blue);
        targetMaterial.emissiveColor.set(red, green, blue);
        cubeMaterial.diffuseColor.set(red, green, blue);
        target.position.copyFrom(targetPosition);
        for (const cube of cubes) {
            cube.lookAt(targetPosition);
        }
        camera.alpha = 4 * (Math.PI / 20 + Math.cos(alpha / 30));
        camera.beta = 2 * (Math.PI / 20 + Math.sin(alpha / 50));
        camera.radius = 180 + (-50 + 50 * Math.sin(alpha / 10));
        alpha += 0.1 * scene.getAnimationRatio();
    });

    return scene;
}
