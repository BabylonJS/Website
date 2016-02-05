var CreateFurTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -2.5, 1.0, 200, new BABYLON.Vector3(0, 0, 0), scene);

    var configureFur = function (mesh) {
        var diffuseTexture = new BABYLON.Texture("leopard_fur.jpg", scene);
        //var heightTexture = new BABYLON.Texture("speckles.jpg", scene);
        var furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", scene);

        var quality = 30; // Average quality
        var fur = new BABYLON.FurMaterial("fur", scene);
        fur.furLength = 0;
        fur.furAngle = 0;
        fur.diffuseTexture = diffuseTexture;
        fur.furTexture = furTexture;
        fur.furSpacing = 6;
        fur.furGravity = new BABYLON.Vector3(0, -2, 0);

        mesh.material = fur;
        var meshes = BABYLON.FurMaterial.FurifyMesh(mesh, quality);

        for (var i = 0; i < meshes.length; i++) {
            meshes[i].material.backFaceCulling = false;
        }
        /*
        for (var i = 1; i < shells; i++) {
            var offsetFur = new BABYLON.FurMaterial("fur" + i, scene);
            offsetFur.furLength = 4;
            offsetFur.furAngle = 0;
            offsetFur.furColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            offsetFur.diffuseTexture = diffuseTexture;
            offsetFur.furOffset = i / shells;
            offsetFur.furTexture = furTexture;
            offsetFur.highLevelFur = fur.highLevelFur;

            var offsetMesh = mesh.clone(mesh.name + i);
            offsetMesh.isVisible = fur.highLevelFur;
            offsetMesh.material = offsetFur;
            offsetMesh.skeleton = mesh.skeleton;
        }
        */

        // Simulate gravity thanks to the mouse
        scene.registerBeforeRender(function () {
            var middleX = engine.getRenderingCanvas().width;
            var middleY = engine.getRenderingCanvas().height;
            var multiplierX = 1;
            var multiplierY = 1;

            if (scene.pointerX < middleX) {
                multiplierX = -1;
            }
            if (scene.pointerY < middleY) {
                multiplierY = -1;
            }

            fur.furGravity.x = (scene.pointerX * multiplierX) / middleX * 3 + 1.5;
            fur.furGravity.y = (scene.pointerY * multiplierY) / middleY * 3 + 1.5;
            fur.furGravity.z = (fur.furGravity.x + fur.furGravity.y) / 2;
        });
    }

    BABYLON.SceneLoader.Append("/assets/Rabbit/", "rabbit.babylon", scene, function () {
        scene.activeCamera = camera;

        configureFur(scene.meshes[1]);
    });

    return scene;
};