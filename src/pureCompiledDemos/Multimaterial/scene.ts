import {
    ArcRotateCamera,
    Color3,
    CreateSphere,
    type Engine,
    MultiMaterial,
    PointLight,
    Scene,
    StandardMaterial,
    SubMesh,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
export function createMultimaterialScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(-3, 3, 0));
    camera.attachControl(canvas, true);
    new PointLight("Omni", new Vector3(20, 100, 2), scene);

    const material0 = new StandardMaterial("mat0", scene);
    material0.diffuseColor = new Color3(1, 0, 0);
    material0.bumpTexture = new Texture("/Demos/Multimaterial/normalMap.jpg", scene);

    const material1 = new StandardMaterial("mat1", scene);
    material1.diffuseColor = new Color3(0, 0, 1);

    const material2 = new StandardMaterial("mat2", scene);
    material2.emissiveColor = new Color3(0.4, 0, 0.4);

    const multiMaterial = new MultiMaterial("multi", scene);
    multiMaterial.subMaterials.push(material0, material1, material2);

    const sphere = CreateSphere("Sphere0", { segments: 16, diameter: 3 }, scene);
    sphere.material = multiMaterial;
    sphere.subMeshes = [];

    const verticesCount = sphere.getTotalVertices();
    const indicesCount = sphere.getTotalIndices();
    const third = Math.floor(indicesCount / 3);
    sphere.subMeshes.push(new SubMesh(0, 0, verticesCount, 0, third, sphere));
    sphere.subMeshes.push(new SubMesh(1, 0, verticesCount, third, third, sphere));
    sphere.subMeshes.push(new SubMesh(2, 0, verticesCount, third * 2, indicesCount - third * 2, sphere));

    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.01 * scene.getAnimationRatio();
    });

    return scene;
}
