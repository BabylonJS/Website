var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    //Adding a light
    var light = new BABYLON.HemisphericLight();

    //Adding an Arc Rotate Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    BABYLON.SceneLoader.Append("/assets/", "Alien.glb", scene, function (newMeshes) {
        scene.activeCamera = null;
        scene.createDefaultCameraOrLight(true);
        scene.activeCamera.attachControl(canvas, false);
    });

    return scene;
}