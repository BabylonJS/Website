import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createDisplacementMapScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 14, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(-10, 10, 0));
    camera.attachControl(canvas, true);
    new HemisphericLight("Omni0", new Vector3(0, 1, 0), scene);

    const sphere = CreateSphere("Sphere", { segments: 96, diameter: 5 }, scene);
    const positions = sphere.getVerticesData(VertexBuffer.PositionKind);
    const normals = sphere.getVerticesData(VertexBuffer.NormalKind);
    if (positions && normals) {
        for (let index = 0; index < positions.length; index += 3) {
            const x = positions[index];
            const y = positions[index + 1];
            const z = positions[index + 2];
            const displacement = 0.25 + 0.55 * Math.abs(Math.sin(x * 3) * Math.cos(y * 4) * Math.sin(z * 5));
            positions[index] += normals[index] * displacement;
            positions[index + 1] += normals[index + 1] * displacement;
            positions[index + 2] += normals[index + 2] * displacement;
        }
        sphere.updateVerticesData(VertexBuffer.PositionKind, positions);
    }

    const material = new StandardMaterial("displaced", scene);
    material.diffuseColor = new Color3(0.45, 0.75, 1);
    material.specularColor = new Color3(0.2, 0.2, 0.25);
    sphere.material = material;

    const skybox = CreateBox("skyBox", { size: 100 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/Scenes/Customs/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = Color3.Black();
    skyboxMaterial.specularColor = Color3.Black();
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    return scene;
}
