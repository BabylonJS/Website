var CreatePointLightShadowScene = function (engine) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 30, BABYLON.Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 40;
    camera.minZ = 0;

    camera.attachControl(engine.getRenderingCanvas());

    var light = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 0.7;

    var lightImpostor = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
    var lightImpostorMat = new BABYLON.StandardMaterial("mat", scene);
    lightImpostor.material = lightImpostorMat;
    lightImpostorMat.emissiveColor = BABYLON.Color3.Yellow();
    lightImpostorMat.linkEmissiveWithDiffuse = true;

    lightImpostor.parent = light;

    var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.2, 128, 64, 4, 1, scene);
    var torus = BABYLON.Mesh.CreateTorus("torus", 8, 1, 32, scene, false);

    var torusMat = new BABYLON.StandardMaterial("mat", scene);
    torus.material = torusMat;
    torusMat.diffuseColor = BABYLON.Color3.Red();

    var knotMat = new BABYLON.StandardMaterial("mat", scene);
    knot.material = knotMat;
    knotMat.diffuseColor = BABYLON.Color3.White();

    // Container
    var container = BABYLON.Mesh.CreateSphere("sphere2", 16, 50, scene, false, BABYLON.Mesh.BACKSIDE);
    var containerMat = new BABYLON.StandardMaterial("mat", scene);
    container.material = containerMat;
    containerMat.diffuseTexture = new BABYLON.Texture("../../assets/amiga.jpg", scene);
    containerMat.diffuseTexture.uScale = 10.0;
    containerMat.diffuseTexture.vScale = 10.0;

    // Shadow
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.getShadowMap().renderList.push(knot, torus);
    shadowGenerator.setDarkness(0.5);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.bias = 0;

    container.receiveShadows = true;
    torus.receiveShadows = true;

    scene.registerBeforeRender(function () {
        knot.rotation.y += 0.01;
        knot.rotation.x += 0.01;

        torus.rotation.y += 0.05;
        torus.rotation.z += 0.03;
    });

    return scene;

};