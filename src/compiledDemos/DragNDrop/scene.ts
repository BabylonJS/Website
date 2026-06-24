import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateTorus } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Scene } from "@babylonjs/core/scene";

export function createDragDropTestScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(20, 200, 400));
    camera.attachControl(canvas, true);

    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 150;

    scene.clearColor = new Color3(0, 0, 0).toColor4(1);

    new PointLight("omni", new Vector3(0, 50, 0), scene);

    // Ground
    const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.specularColor = Color3.Black();
    ground.material = groundMaterial;

    // Meshes
    const redSphere = CreateSphere("red", { segments: 32, diameter: 20 }, scene);
    const redMat = new StandardMaterial("red", scene);
    redMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    redMat.specularColor = new Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = Color3.Red();
    redSphere.material = redMat;
    redSphere.position.y = 10;
    redSphere.position.x -= 100;

    const greenBox = CreateBox("green", { size: 20 }, scene);
    const greenMat = new StandardMaterial("green", scene);
    greenMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = Color3.Green();
    greenBox.material = greenMat;
    greenBox.position.z -= 100;
    greenBox.position.y = 10;

    const blueBox = CreateBox("blue", { size: 20 }, scene);
    const blueMat = new StandardMaterial("blue", scene);
    blueMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = Color3.Blue();
    blueBox.material = blueMat;
    blueBox.position.x += 100;
    blueBox.position.y = 10;

    const purpleDonut = CreateTorus("purple", { diameter: 30, thickness: 10, tessellation: 32 }, scene);
    const purpleMat = new StandardMaterial("purple", scene);
    purpleMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    purpleMat.specularColor = new Color3(0.4, 0.4, 0.4);
    purpleMat.emissiveColor = Color3.Purple();
    purpleDonut.material = purpleMat;
    purpleDonut.position.y = 10;
    purpleDonut.position.z += 100;

    // Drag & drop events
    let startingPoint: Vector3 | null;
    let currentMesh: AbstractMesh;

    const getGroundPosition = () => {
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground);
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }
        return null;
    };

    const onPointerDown = (evt: PointerEvent) => {
        if (evt.button !== 0) {
            return;
        }

        const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh !== ground);
        if (pickInfo.hit && pickInfo.pickedMesh) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition();

            if (startingPoint) {
                setTimeout(() => {
                    camera.detachControl();
                }, 0);
            }
        }
    };

    const onPointerUp = () => {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    };

    const onPointerMove = () => {
        if (!startingPoint) {
            return;
        }

        const current = getGroundPosition();
        if (!current) {
            return;
        }

        const diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;
    };

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = () => {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    };

    return scene;
}
