import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateSphere,
    CSG,
    DirectionalLight,
    type Engine,
    MultiMaterial,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";
export function createCsgScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.ambientColor = new Color3(0.3, 0.3, 0.3);

    const camera = new ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 3, 22, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new DirectionalLight("dir01", new Vector3(0, -0.5, -1), scene);
    light.position = new Vector3(20, 150, 70);

    const sourceMaterial = new StandardMaterial("sourceMat", scene);
    sourceMaterial.wireframe = true;
    sourceMaterial.backFaceCulling = false;

    const sphere = CreateSphere("sphere", { segments: 16, diameter: 4 }, scene);
    const box = CreateBox("box", { size: 4 }, scene);
    const angledBox = CreateBox("angledBox", { size: 4 }, scene);
    sphere.position.y = 5;
    box.position.y = 2.5;
    angledBox.position.y = 3.5;
    angledBox.rotation.y = Math.PI / 8;
    sphere.material = sourceMaterial;
    box.material = sourceMaterial;
    angledBox.material = sourceMaterial;

    const sphereCsg = CSG.FromMesh(sphere);
    const boxCsg = CSG.FromMesh(box);
    const angledBoxCsg = CSG.FromMesh(angledBox);

    const red = new StandardMaterial("red", scene);
    red.diffuseColor.copyFromFloats(0.8, 0.2, 0.2);
    red.backFaceCulling = false;
    const green = new StandardMaterial("green", scene);
    green.diffuseColor.copyFromFloats(0.2, 0.8, 0.2);
    green.backFaceCulling = false;

    boxCsg.subtract(sphereCsg).toMesh("boxMinusSphere", red, scene).position = new Vector3(-10, 0, 0);
    sphereCsg.subtract(boxCsg).toMesh("sphereMinusBox", red, scene).position = new Vector3(10, 0, 0);
    sphereCsg.intersect(boxCsg).toMesh("intersection", red, scene).position = new Vector3(0, 0, 10);

    const multi = new MultiMaterial("multiMat", scene);
    multi.subMaterials.push(red, green);
    boxCsg.subtract(angledBoxCsg).toMesh("boxMinusAngledBox", multi, scene, true).position = new Vector3(0, 0, -10);

    sphere.setEnabled(false);
    box.setEnabled(false);
    angledBox.setEnabled(false);

    return scene;
}
