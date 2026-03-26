var CreateInstancesTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -0.3), scene);
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 10, -20), scene);
    camera.speed = 0.4;

    light.position = new BABYLON.Vector3(20, 60, 30);

    scene.ambientColor = BABYLON.Color3.FromInts(10, 30, 10);
    scene.clearColor = BABYLON.Color3.FromInts(127, 165, 13);
    scene.gravity = new BABYLON.Vector3(0, -0.5, 0);

    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.02;
    scene.fogColor = scene.clearColor;

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 150.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Scenes/Customs/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Invisible borders
    var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border0.scaling = new BABYLON.Vector3(1, 100, 100);
    border0.position.x = -50.0;
    border0.checkCollisions = true;
    border0.isVisible = false;

    var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border1.scaling = new BABYLON.Vector3(1, 100, 100);
    border1.position.x = 50.0;
    border1.checkCollisions = true;
    border1.isVisible = false;

    var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border2.scaling = new BABYLON.Vector3(100, 100, 1);
    border2.position.z = 50.0;
    border2.checkCollisions = true;
    border2.isVisible = false;

    var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border3.scaling = new BABYLON.Vector3(100, 100, 1);
    border3.position.z = -50.0;
    border3.checkCollisions = true;
    border3.isVisible = false;

    // Ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "Scenes/Customs/heightMap.png", 100, 100, 100, 0, 5, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("Scenes/Customs/ground.jpg", scene);

    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.checkCollisions = true;

    ground.onReady = function () {
        ground.optimize(100);

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

        // Trees
        BABYLON.SceneLoader.ImportMesh("", "/Scenes/Tree/", "tree.babylon", scene, function(newMeshes) {
            newMeshes[0].material.opacityTexture = null;
            newMeshes[0].material.backFaceCulling = false;
            newMeshes[0].isVisible = false;
            newMeshes[0].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object

            shadowGenerator.getShadowMap().renderList.push(newMeshes[0]);
            var range = 60;
            var count = 100;
            for (var index = 0; index < count; index++) {
                var newInstance = newMeshes[0].createInstance("i" + index);
                var x = range / 2 - Math.random() * range;
                var z = range / 2 - Math.random() * range;

                var y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object

                newInstance.position = new BABYLON.Vector3(x, y, z);

                newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);

                var scale = 0.5 + Math.random() * 2;
                newInstance.scaling.addInPlace(new BABYLON.Vector3(scale, scale, scale));

                shadowGenerator.getShadowMap().renderList.push(newInstance);
            }
            shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
            shadowGenerator.usePoissonSampling = true;

            // Collisions
            camera.checkCollisions = true;
            camera.applyGravity = true;
        });
    }

    return scene;
};