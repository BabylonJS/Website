/*
	How to use the Web Audio 3D Analyser to create stunning effects
	by Steve 'Stv' Duran for BabylonJS featured demos on 06.12.2015
*/
var bar = [];
var square = "http://yoda.blob.core.windows.net/wwwbabylonjs/assetsdemos/3danalyser/square.jpg";
var bjs = "http://yoda.blob.core.windows.net/wwwbabylonjs/assetsdemos/3danalyser/metal.png";
var fft;

// Better random function
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Create the equalizer
function createRingcubes(r, nb, scene) {
    var TWO_PI = Math.PI * 2;
    var angle = TWO_PI / nb;
    var cube;

    // Create a really cool metal material with bump :)
    var m1 = new BABYLON.StandardMaterial("m", scene);
    m1.diffuseTexture = new BABYLON.Texture(square, scene);
    m1.bumpTexture = new BABYLON.Texture("http://yoda.blob.core.windows.net/wwwbabylonjs/assetsdemos/3danalyser/grained_uv.png", scene);
    m1.reflectionTexture = new BABYLON.Texture(bjs, scene);
    m1.reflectionTexture.level = 0.8;
    m1.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

    for (var i = 0; i <= nb; i++) {
        if (i === 0) {
            bar[i] = BABYLON.Mesh.CreateBox("b", 0.02, scene);

            bar[i].material = m1;
            bar[i].isVisible = false;
        }
        else {
            bar[i] = bar[0].createInstance("b" + i);

            bar[i].position.x = r * Math.sin(angle * i);
            bar[i].position.y = r * Math.cos(angle * i);
            bar[i].position.z = 0;

            bar[i].scaling.y = 20.0;
            bar[i].scaling.x = 200.0;

            // Remember, you learned it in the "Lookat" PG !
            bar[i].lookAt(new BABYLON.Vector3(0, 0, 0));
        }

    }
}

var CreateCoolAudio3DAnalyser = function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 25, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // (Down)load and plau it when it's loaded. 
    var music = new BABYLON.Sound("Music", "http://yoda.blob.core.windows.net/wwwbabylonjs/assetsdemos/3danalyser/cosmosis.mp3", scene, function () {
        music.play();
    });

    // Here we go !
    createRingcubes(20, 256, scene);

    // Create some cool material.
    var mball = new BABYLON.StandardMaterial("m", scene);
    mball.backFaceCulling = false;
    mball.bumpTexture = new BABYLON.Texture("http://yoda.blob.core.windows.net/wwwbabylonjs/assetsdemos/3danalyser/grained_uv.png", scene);
    mball.reflectionTexture = new BABYLON.Texture(bjs, scene);
    mball.reflectionTexture.level = 0.8;
    mball.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

    // Center sphere
    var sphere = BABYLON.Mesh.CreateSphere("s", 32, 20, scene);
    sphere.material = mball;

    // Start the analyser
    var myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 512;
    myAnalyser.SMOOTHING = 0.9;

    var t = 0.0;
    scene.registerBeforeRender(function () {

        fft = myAnalyser.getByteFrequencyData();

        // Scale cubes according to music ! :)
        // here we multiply by 4 because we are working on a very little scene like (20x20x20)
        for (var i = 0; i < bar.length; i++) {
            bar[i].scaling.z = fft[i] * 4;
        }

        // Move camera
        camera.alpha = 4.0 * (Math.PI / 20 + Math.cos(t / 35));
        camera.beta = 1.5 * (Math.PI / 20 + Math.sin(t / 50));
        camera.radius = 100 + (-25 + 25 * Math.sin(t / 30));

        t += 0.1;
    });

    return scene;
};