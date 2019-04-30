function createScene(engine) {
    var scene = new BABYLON.Scene(engine);

    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
    hdrTexture.gammaSpace = false;
    scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5);
    camera.wheelPrecision = 100;
    camera.attachControl(scene.getEngine().getRenderingCanvas());

    var title = createLabel(scene, "Generated Normal Attribute");
    title.position = new BABYLON.Vector3(+0, +1.7, 0);

    loadModel(scene, "NoNormalsBottom.gltf", new BABYLON.Vector3(-1.5, +0.7, 0), "Bottom Primitive");
    loadModel(scene, "NoNormalsMiddle.gltf", new BABYLON.Vector3(+0, +0.7, 0), "Middle Primitive");
    loadModel(scene, "NoNormalsTop.gltf", new BABYLON.Vector3(+1.5, +0.7, 0), "Top Primitive");

    return scene;
}

function loadModel(scene, name, center, caption) {
    BABYLON.SceneLoader.ImportMesh("", "/Assets/glTFMeshPrimitiveAttributeTest/", name, scene, function (meshes) {
        var root = new BABYLON.Mesh("root", scene);
        meshes.forEach(mesh => {
            if (!mesh.parent) {
                mesh.setParent(root);
            }
        });

        root.position = center;
        root.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        var label = createLabel(scene, caption);
        label.position = center.clone();
        label.position.y -= 2;
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
