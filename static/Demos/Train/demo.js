var demo = {
    scene: "Train",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        var canvas = scene.getEngine().getRenderingCanvas();
        scene.collisionsEnabled = false;
        for (var index = 0; index < scene.cameras.length; index++) {
            scene.cameras[index].minZ = 10;
        }

        for (index = 0; index < scene.meshes.length; index++) {
            var mesh = scene.meshes[index];

            mesh.isBlocker = mesh.checkCollisions;
        }

        scene.activeCamera.detachControl(canvas);
        scene.activeCamera = scene.cameras[6];
        scene.activeCamera.attachControl(canvas);
        scene.getMaterialByName("terrain_eau").bumpTexture = null;

        // Postprocesses
        var bwPostProcess = new BABYLON.BlackAndWhitePostProcess("Black and White", 1.0, scene.cameras[2]);
        scene.cameras[2].name = "B&W";

        var sepiaKernelMatrix = BABYLON.Matrix.FromValues(
            0.393, 0.349, 0.272, 0,
            0.769, 0.686, 0.534, 0,
            0.189, 0.168, 0.131, 0,
            0, 0, 0, 0
        );
        var sepiaPostProcess = new BABYLON.FilterPostProcess("Sepia", sepiaKernelMatrix, 1.0, scene.cameras[3]);
        scene.cameras[3].name = "SEPIA";

        var serializationObject = BABYLON.SceneSerializer.Serialize(scene);
        var string = JSON.stringify(serializationObject);
    }
};