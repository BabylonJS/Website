var btexture = "grained_uv.png";
var dcube = "cube.jpg";
var dsaturne = "saturne.jpg";
var dsun = "sun2.png";
var atexture = "asteroid.jpg";
var trings = "rings.png";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var CreateSPSTestScene = function (engine) {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    camera = new BABYLON.ArcRotateCamera("Camera", -1.5, 1.3, 500, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    camera.upperRadiusLimit = 600;
    camera.lowerRadiusLimit = 200;

    var light1 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 100), scene);
    light1.diffuseColor = new BABYLON.Color3(0, 10, 10);

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1500.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../assets/skybox/nebula", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    var saturne = BABYLON.Mesh.CreateSphere("saturne", 16, 80, scene);
    var saturne_material = new BABYLON.StandardMaterial("saturne_material", scene);
    saturne_material.reflectionTexture = new BABYLON.CubeTexture("../../assets/skybox/nebula", scene);
    saturne_material.diffuseTexture = new BABYLON.Texture(dsaturne, scene);
    saturne_material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    saturne_material.emissiveColor = BABYLON.Color3.White();
    saturne_material.specularColor = BABYLON.Color3.Black();
    saturne_material.backFaceCulling = true;

    saturne_material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    saturne_material.reflectionFresnelParameters.bias = 0.2;

    saturne_material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    saturne_material.emissiveFresnelParameters.bias = 0.6;
    saturne_material.emissiveFresnelParameters.power = 4;
    saturne_material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    saturne_material.emissiveFresnelParameters.rightColor = new BABYLON.Color3(0.6, 0.6, 0.6);

    saturne.material = saturne_material;

    // saturne.rotation.z = -90;
    saturne.rotation.y = -12;

    var rings = BABYLON.Mesh.CreatePlane("rings", 600, scene);
    var m = new BABYLON.StandardMaterial("m", scene);
    m.diffuseTexture = new BABYLON.Texture(trings, scene);
    m.diffuseTexture.hasAlpha = true;
    m.backFaceCulling = false;
    rings.material = m;

    rings.rotation.x = Math.PI / 2;

    var nb = 20000;

    var myVertexFunction = function (particle, vertex, i) {
        vertex.x *= (Math.random() + 0.01) / getRandomInt(5, 10);
        vertex.y *= (Math.random() + 0.01) / getRandomInt(5, 10);
        vertex.z *= (Math.random() + 0.01) / getRandomInt(5, 10);
    };

    var myPositionFunction = function (particle, i, s) {
        var radius = 1.0;
        var TWO_PI = Math.PI * 2;
        var angle = TWO_PI / nb;
        var x, y;

        x = getRandomInt(90, 350) * Math.sin(angle * i);
        z = getRandomInt(90, 350) * Math.cos(angle * i);

        particle.position.x = x;
        particle.position.y = z;
        particle.position.z = (Math.random() - 0.5) * 5;

        particle.scale.x = getRandomInt(5, 35) / 10;
        particle.scale.y = getRandomInt(5, 35) / 10;
        particle.scale.z = getRandomInt(5, 35) / 10;

        particle.rotation.x = Math.random() * 3.15;
        particle.rotation.y = Math.random() * 3.15;
        particle.rotation.z = Math.random() * 1.5;
    };

    var rock = BABYLON.Mesh.CreateSphere("s", 0.5, 16, scene);
    var rock_material = new BABYLON.StandardMaterial("rock_material", scene);
    rock_material.diffuseTexture = new BABYLON.Texture(atexture, scene);
    rock_material.diffuseTexture.uScale = 16;
    rock_material.diffuseTexture.vScale = 16;
    rock_material.backFaceCulling = false;

    // SPS creation : Immutable {updatable: false}
    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, { updatable: false });
    SPS.addShape(rock, nb, { positionFunction: myPositionFunction, vertexFunction: myVertexFunction });
    var mesh = SPS.buildMesh();
    SPS.mesh.material = rock.material;
    SPS.mesh.rotation.y = 90;
    SPS.mesh.rotation.x = Math.PI / 2;

    rock.dispose();

    var emitter = new BABYLON.VolumetricLightScatteringPostProcess('godrays', { passRatio: 0.5, postProcessRatio: 1.0 }, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    emitter.mesh.material.diffuseTexture = new BABYLON.Texture("sun.png", scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    emitter.mesh.material.diffuseTexture.hasAlpha = true;
    emitter.mesh.position = new BABYLON.Vector3(200, 0, 500);
    emitter.mesh.scaling = new BABYLON.Vector3(250, 250, 250);

    var t = 0.0;
    scene.registerBeforeRender(function () {

        SPS.mesh.rotation.z = t / 10;

        t += 0.1;
    });

    return scene;
};