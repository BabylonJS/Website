import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateLines } from "@babylonjs/core/Meshes/Builders/linesBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createLinesScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(20, 200, 400));
    camera.maxZ = 20000;
    camera.lowerRadiusLimit = 150;
    camera.attachControl(canvas, true);

    scene.clearColor = Color3.Black().toColor4(1);

    const points: Vector3[] = [];
    let radius = 0.5;
    let angle = 0;

    for (let index = 0; index < 1000; index++) {
        points.push(new Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
        radius += 0.3;
        angle += 0.1;
    }

    const whirlpool = CreateLines("whirlpool", { points, updatable: true }, scene);
    whirlpool.color = Color3.White();

    const positionData = whirlpool.getVerticesData(VertexBuffer.PositionKind);
    if (!positionData) {
        throw new Error("Lines demo could not read whirlpool vertex positions.");
    }

    const heightRange = 10;
    let alpha = 0;

    scene.registerBeforeRender(() => {
        for (let index = 0; index < 1000; index++) {
            positionData[index * 3 + 1] = heightRange * Math.sin(alpha + index * 0.1);
        }

        whirlpool.updateVerticesData(VertexBuffer.PositionKind, positionData);
        alpha += 0.05 * scene.getAnimationRatio();
    });

    return scene;
}
