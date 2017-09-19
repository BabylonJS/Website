function createScene(engine) {
    var scene = new BABYLON.Scene(engine);

    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(1, -1, 1), scene);

    var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 0.5, scene);
    sphere.position.y = 1;
    sphere.material = new BABYLON.PBRMaterial("spherMaterial", scene);
    sphere.material.metallic = 0;

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 6);
    camera.wheelPrecision = 100;
    camera.attachControl(scene.getEngine().getRenderingCanvas());

    loadModel(scene, "TestCube.gltf", new BABYLON.Vector3(-1, -0.5, 0));
    loadModel(scene, "TestCubeNoTangents.gltf", new BABYLON.Vector3(1, -0.5, 0));

    return scene;
}

function loadModel(scene, name, center) {
    BABYLON.SceneLoader.ImportMesh("", "/Assets/TestCube/", name, scene, function (meshes) {
        var root = new BABYLON.Mesh("root", scene);
        meshes.forEach(mesh => {
            if (!mesh.parent) {
                mesh.setParent(root);
            }
        });

        root.position = center;
        root.rotation = new BABYLON.Vector3(Math.PI / 4, Math.PI / 4, 0);
    });
}
