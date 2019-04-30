var CreateFurTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -2.5, 1.0, 200, new BABYLON.Vector3(0, 5, 0), scene);

    var configureFur = function (mesh) {
        var fur = new BABYLON.FurMaterial("fur", scene);
        fur.furLength = 0;
        fur.furAngle = 0;
        fur.furColor = new BABYLON.Color3(2, 2, 2);
        fur.diffuseTexture = mesh.material.diffuseTexture;
        fur.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", scene);
        fur.furSpacing = 6;
        fur.furDensity = 20;
        fur.furSpeed = 300;
        fur.furGravity = new BABYLON.Vector3(0, -1, 0);

        mesh.material = fur;

        var quality = 30; // It is enougth
        var shells = BABYLON.FurMaterial.FurifyMesh(mesh, quality);

        // Special for bunny (ears)
        for (var i = 0; i < shells.length; i++) {
            shells[i].material.backFaceCulling = false;
        }
    }

    BABYLON.SceneLoader.Append("/assets/Rabbit/", "Rabbit.babylon", scene, function () {
        scene.activeCamera = camera;

        configureFur(scene.meshes[1]);
    });

    return scene;
};