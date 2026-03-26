var CreateInstancesTestScene = function (engine) {
    var obj = null, obj_datas, vertices, total_vertices, emitter_pos;

    var rings1 = [];
    var rings2 = [];
    var rings3 = [];
    var rings4 = [];
    var rings5 = [];

    var radius = 280;
    var numPoints = 10;
    var TWO_PI = Math.PI * 2;
    var angle = TWO_PI / numPoints;

    var scale = 600;
    var scene = new BABYLON.Scene(engine);
    engine.backFaceCulling = false;

    camera = new BABYLON.ArcRotateCamera("Camera", 1.7, 0.7, 1350, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0, 10), scene);
    light.intensity = 0.2;

    var plight = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 0, 180), scene);

    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture("test8q_dDo_d.jpg", scene);
    mat.bumpTexture = new BABYLON.Texture("test8q_dDo_n.jpg", scene);
    mat.specularTexture = new BABYLON.Texture("test8q_dDo_s.jpg", scene);

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/nebula", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;


    BABYLON.SceneLoader.ImportMesh("", "./", "killer.babylon", scene,
            function (mesh) {
                obj = mesh[0];
                obj.material = mat;

                for (var index = 0; index < numPoints; index++) {
                    rings1[index] = obj.createInstance("i_" + index);
                    rings2[index] = obj.createInstance("i_" + index);
                    rings3[index] = obj.createInstance("i_" + index);
                    rings4[index] = obj.createInstance("i_" + index);
                    rings5[index] = obj.createInstance("i_" + index);
                }

                obj.rotation.x = 200;
                obj.isVisible = false;

                var t = 0.0;
                scene.registerBeforeRender(function () {

                    for (var index = 0; index < numPoints; index++) {
                        var speed = t / 10.0;
                        var x = radius * Math.sin(speed + angle * index);
                        var z = radius * Math.cos(speed + angle * index);

                        rings1[index].position.x = x;
                        rings1[index].position.z = z;

                        rings1[index].lookAt(new BABYLON.Vector3.Zero());
                        rings1[index].rotate(BABYLON.Axis.Y, 1.6, BABYLON.Space.LOCAL);
                    }

                    for (var index = 0; index < numPoints; index++) {
                        var speed = -t / 8.0;
                        var x = radius * Math.sin(speed + angle * index);
                        var z = radius * Math.cos(speed + angle * index);

                        rings2[index].position.x = x;
                        rings2[index].position.y = 70;
                        rings2[index].position.z = z;

                        rings2[index].lookAt(new BABYLON.Vector3(0, 100, 0));
                        rings2[index].rotate(BABYLON.Axis.Y, 1.6, BABYLON.Space.LOCAL);
                    }

                    for (var index = 0; index < numPoints; index++) {
                        var speed = t / 12.0;
                        var x = 200 * Math.sin(speed + angle * index);
                        var z = 200 * Math.cos(speed + angle * index);

                        rings3[index].position.x = x;
                        rings3[index].position.y = 180;
                        rings3[index].position.z = z;

                        rings3[index].lookAt(new BABYLON.Vector3(0, 150, 0));
                        rings3[index].rotate(BABYLON.Axis.Y, 1.6, BABYLON.Space.LOCAL);
                        rings3[index].rotate(BABYLON.Axis.Z, -1.2, BABYLON.Space.LOCAL);
                    }

                    for (var index = 0; index < numPoints; index++) {
                        var speed = -t / 6.0;
                        var x = 150 * Math.sin(speed + angle * index);
                        var z = 150 * Math.cos(speed + angle * index);

                        rings4[index].position.x = x;
                        rings4[index].position.y = 180;
                        rings4[index].position.z = z;

                        rings4[index].scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);

                        rings4[index].lookAt(new BABYLON.Vector3(0, 150, 0));
                        rings4[index].rotate(BABYLON.Axis.Y, 1.6, BABYLON.Space.LOCAL);
                        rings4[index].rotate(BABYLON.Axis.Z, -1.2, BABYLON.Space.LOCAL);
                    }

                    for (var index = 0; index < numPoints; index++) {
                        var speed = -t / 10.0;
                        var x = 750 * Math.sin(speed + angle * index);
                        var z = 750 * Math.cos(speed + angle * index);

                        rings5[index].position.x = x;
                        rings5[index].position.z = z;

                        rings5[index].scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);

                        rings5[index].lookAt(new BABYLON.Vector3.Zero());
                        rings5[index].rotate(BABYLON.Axis.Y, 1.6, BABYLON.Space.LOCAL);
                    }

                    plight.intensity = 1 + Math.random() * 1.0 - 0.5;
                    scale = Math.random() * 100 - 500;
                    emitter.mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
                    t += 0.1;
                });
            });

    var emitter = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    emitter.mesh.material.diffuseTexture = new BABYLON.Texture("sun.png", scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    emitter.mesh.material.diffuseTexture.hasAlpha = true;
    emitter.mesh.position = new BABYLON.Vector3(0, 180, 0);

    return scene;
};