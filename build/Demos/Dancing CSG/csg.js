var CreateCSGTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0.9, 1.96, 150, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(new BABYLON.Vector3(0, -150, 0));
    camera.attachControl(canvas, true);

    var pl1 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(240, 240, 0), scene);
    pl1.diffuse = new BABYLON.Color3(219 / 255, 138 / 255, 73 / 255);
    pl1.specular = new BABYLON.Color3(219 / 255, 138 / 255, 73 / 255);
    var pl2 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-150, 240, 150), scene);
    pl2.diffuse = new BABYLON.Color3(226 / 255, 217 / 255, 184 / 255);
    pl2.specular = new BABYLON.Color3(226 / 255, 217 / 255, 184 / 255);
    var pl3 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 240, 100), scene);
    pl3.diffuse = new BABYLON.Color3(226 / 255, 217 / 255, 184 / 255);
    pl3.specular = new BABYLON.Color3(226 / 255, 217 / 255, 184 / 255);

    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture("cube.jpg", scene);
    mat.diffuseTexture.uScale = 4;
    mat.diffuseTexture.vScale = 4;
    mat.backFaceCulling = true;

    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1.3, scene);
    var cube = BABYLON.Mesh.CreateBox("box", 1, scene);

    var finalMesh = BABYLON.CSG.FromMesh(cube).subtract(BABYLON.CSG.FromMesh(sphere)).toMesh("hb", mat, scene, true);

    cube.isVisible = false;
    sphere.isVisible = false;

    var m1 = new BABYLON.PBRMaterial("m1", scene);
    m1.bumpTexture = new BABYLON.Texture("grained_uv.jpg", scene);
    m1.bumpTexture.uScale = 2;
    m1.bumpTexture.vScale = 2;
    m1.reflectionTexture = new BABYLON.Texture("metal.png", scene);
    m1.reflectionTexture.level = 0.4;
    m1.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

    var m2 = new BABYLON.StandardMaterial("Material2", scene);
    m2.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    m2.diffuseColor = new BABYLON.Color3(0, 0, 0);
    m2.bumpTexture = new BABYLON.Texture("grained_uv.jpg", scene);
    m2.bumpTexture.uScale = 2;
    m2.bumpTexture.vScale = 2;
    m2.reflectionTexture = new BABYLON.Texture("metal.png", scene);
    m2.reflectionTexture.level = 0.4;
    m2.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

    var box = BABYLON.Mesh.CreateBox("b", 5000, scene, false, BABYLON.Mesh.DOUBLESIDE);
    box.material = mat;

    var hballs = [];
    for (var i = 0; i < 15; i++) {
        hballs[i] = finalMesh.clone("hball");
        var scale = i * 40;
        hballs[i].scaling = new BABYLON.Vector3(scale, scale, scale);

        hballs[i].position.y = -150;

        if ((i & 1) == 0) {
            hballs[i].material = m1;
        }
        else {
            hballs[i].material = m2;
        }
    }

    finalMesh.isVisible = false;

    finalMesh.convertToFlatShadedMesh();

    var emitter = new BABYLON.VolumetricLightScatteringPostProcess('godrays', {
        passRatio: 0.5,
        postProcessRatio: 1.0
    }, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    emitter.mesh.material.diffuseTexture = new BABYLON.Texture("sun.png", scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    emitter.mesh.material.diffuseTexture.hasAlpha = true;
    emitter.mesh.position = new BABYLON.Vector3(0, -150, 0);
    emitter.mesh.scaling = new BABYLON.Vector3(200, 200, 200);

    var music = new BABYLON.Sound("Music", "ultra_violet.mp3", scene,
		function () {
		    music.play();

		}, { streaming: true });

    var analyzer = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(analyzer);
    analyzer.FFT_SIZE = 32;
    analyzer.SMOOTHING = 0.9;

    var time = 0;
    var workingArray;
    scene.registerBeforeRender(function () {

        workingArray = analyzer.getByteFrequencyData();

        if (workingArray) {
            for (var j = 1; j < hballs.length; j++) {
                hballs[j].rotation.x = -1.8 * Math.sin((j / 2.0 - time) / 10) * workingArray[1] / 100;
                hballs[j].rotation.y = -2.2 * Math.cos((j / 2.0 - time) / 10) * workingArray[1] / 100;
                hballs[j].rotation.z = -1.6 * Math.sin((j / 2.0 - time) / 10) * workingArray[1] / 100;
            }

            camera.radius = 600 + (100 * Math.sin(time / 15)) + workingArray[0] * 4;
        }

        pl1.intensity = 1 + Math.random() * 0.2 - 0.1;
        pl2.intensity = 0.8 + Math.random() * 0.2 - 0.1;
        pl3.intensity = 0.5 + Math.random() * 0.2 - 0.1;

        camera.alpha = (Math.PI / 20 + Math.cos(time / 20));
        camera.beta = (Math.PI / 20 + Math.sin(time / 25));

        camera.setTarget(hballs[0].position);

        time += 0.1;
    });

    return scene;

};