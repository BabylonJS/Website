var CreateRefractionTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

    camera.setPosition(new BABYLON.Vector3(0, 5, -10));

    camera.attachControl(canvas);

    camera.upperBetaLimit = Math.PI / 2;
    camera.lowerRadiusLimit = 4;

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var knot = BABYLON.Mesh.CreateTorusKnot("knot", 1, 0.4, 128, 64, 2, 3, scene);

    var yellowSphere = BABYLON.Mesh.CreateSphere("yellowSphere", 16, 1.5, scene);
    yellowSphere.setPivotMatrix(BABYLON.Matrix.Translation(3, 0, 0));
    var yellowMaterial = new BABYLON.StandardMaterial("yellowMaterial", scene);
    yellowMaterial.diffuseColor = BABYLON.Color3.Yellow();
    yellowSphere.material = yellowMaterial;

    var greenSphere = BABYLON.Mesh.CreateSphere("greenSphere", 16, 1.5, scene);
    greenSphere.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 3));
    var greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    greenMaterial.diffuseColor = BABYLON.Color3.Green();
    greenSphere.material = greenMaterial;

    // Ground
    var ground = BABYLON.Mesh.CreateBox("Mirror", 1.0, scene);
    ground.scaling = new BABYLON.Vector3(100.0, 0.01, 100.0);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("/assets/amiga.jpg", scene);
    ground.material.diffuseTexture.uScale = 10;
    ground.material.diffuseTexture.vScale = 10;
    ground.position = new BABYLON.Vector3(0, -2, 0);

    // Main material	
    var mainMaterial = new BABYLON.StandardMaterial("main", scene);
    knot.material = mainMaterial;

    var probe = new BABYLON.ReflectionProbe("main", 512, scene);
    probe.renderList.push(yellowSphere);
    probe.renderList.push(greenSphere);
    probe.renderList.push(ground);
    mainMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
    mainMaterial.refractionTexture = probe.cubeTexture;
    mainMaterial.refractionFresnelParameters = new BABYLON.FresnelParameters();
    mainMaterial.refractionFresnelParameters.bias = 0.5;
    mainMaterial.refractionFresnelParameters.power = 16;
    mainMaterial.refractionFresnelParameters.leftColor = BABYLON.Color3.Black();
    mainMaterial.refractionFresnelParameters.rightColor = BABYLON.Color3.White();
    mainMaterial.refractionFresnelParameters.isEnabled = false;
    mainMaterial.indexOfRefraction = 1.05;

    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = scene.clearColor;
    scene.fogStart = 20.0;
    scene.fogEnd = 50.0;

    // Animations
    scene.registerBeforeRender(function () {
        yellowSphere.rotation.y += 0.01;
        greenSphere.rotation.y += 0.01;
    });

    // UI
    var configObject = {
        bump: false,
        fresnel: false,
        indexOfRef: 1.05
    }
    var gui = new dat.GUI();
    gui.add(configObject, 'bump').onChange(function (value) {
        configObject.bump = value;

        if (!value) {
            if (mainMaterial.bumpTexture) {
                mainMaterial.bumpTexture.dispose();
                mainMaterial.bumpTexture = null;
            }
        } else {
            mainMaterial.bumpTexture = new BABYLON.Texture("/assets/normalMap.jpg", scene);
        }
    });
    gui.add(configObject, 'fresnel').onChange(function (value) {
        configObject.fresnel = value;

        mainMaterial.refractionFresnelParameters.isEnabled = value;
    });
    gui.add(configObject, 'indexOfRef', 0.1, 1.3).onChange(function (value) {
        configObject.indexOfRef = value;

        mainMaterial.indexOfRefraction = value;
    });

    return scene;
};