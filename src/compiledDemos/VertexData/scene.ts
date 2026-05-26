import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { Scene } from "@babylonjs/core/scene";

export function createVertexDataScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 18, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const mesh = new Mesh("customRibbon", scene);
    const positions: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];
    const columns = 36;
    const rows = 12;
    for (let row = 0; row <= rows; row++) {
        for (let column = 0; column <= columns; column++) {
            const angle = (column / columns) * Math.PI * 2;
            const radius = 3 + Math.sin(row * 0.8) * 0.8;
            positions.push(Math.cos(angle) * radius, row * 0.45 - 3, Math.sin(angle) * radius);
            const color = new Color4(column / columns, row / rows, 1 - row / rows, 1);
            colors.push(color.r, color.g, color.b, color.a);
        }
    }
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const current = row * (columns + 1) + column;
            const next = current + columns + 1;
            indices.push(current, next, current + 1, current + 1, next, next + 1);
        }
    }
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.colors = colors;
    VertexData.ComputeNormals(positions, indices, (vertexData.normals = []));
    vertexData.applyToMesh(mesh);
    const material = new StandardMaterial("vertexColorMaterial", scene);
    material.diffuseColor.set(1, 1, 1);
    material.backFaceCulling = false;
    mesh.material = material;
    scene.registerBeforeRender(() => {
        mesh.rotation.y += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
