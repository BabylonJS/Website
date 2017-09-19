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

    loadModel(scene, "TestCube1.gltf", new BABYLON.Vector3(-2, -0.5, 0), "Normals + Tangents");
    loadModel(scene, "TestCube2.gltf", new BABYLON.Vector3(+0, -0.5, 0), "Normals Only");
    loadModel(scene, "TestCube3.gltf", new BABYLON.Vector3(+2, -0.5, 0), "No Normals/Tangents");

    return scene;
}

function loadModel(scene, name, center, caption) {
    BABYLON.SceneLoader.ImportMesh("", "/Assets/TestCube/", name, scene, function (meshes) {
        var root = new BABYLON.Mesh("root", scene);
        meshes.forEach(mesh => {
            if (!mesh.parent) {
                mesh.setParent(root);
            }
        });

        root.position = center;
        root.rotation = new BABYLON.Vector3(Math.PI / 4, Math.PI / 4, 0);

        var label = createLabel(scene, caption);
        label.position = center.clone();
        label.position.y -= 1;
    });
}

function createLabel(scene, text) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, null, null, "36px Arial", "white", "transparent");
    var plane = BABYLON.Mesh.CreatePlane("TextPlane", 2, scene);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = BABYLON.Color3.Black();
    plane.material.diffuseTexture = dynamicTexture;
    plane.material.useAlphaFromDiffuseTexture = true;
    return plane;
}
