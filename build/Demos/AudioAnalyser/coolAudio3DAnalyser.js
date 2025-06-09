﻿/*
	How to use the Web Audio 3D Analyser to create stunning effects
	by Steve 'Stv' Duran for BabylonJS featured demos on 06.12.2015
*/
var bar = [];
var square = "/Demos/AudioAnalyser/square.jpg";
var bjs = "/Demos/AudioAnalyser/metal.png";
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
    m1.bumpTexture = new BABYLON.Texture("/Demos/AudioAnalyser/grained_uv.png", scene);
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

    BABYLON.AbstractEngine.audioEngine = new BABYLON.AudioEngine();

    // Show the unmute button.
    BABYLON.Engine.audioEngine.lock();

    // Streaming sound using HTML5 Audio element
    var music = new BABYLON.Sound("Music", "/Demos/AudioAnalyser/cosmosis.mp3",
        scene, null, { streaming: true, autoplay: true, loop: true });

    // Here we go !
    createRingcubes(20, 256, scene);

    // Create some cool material.
    var mball = new BABYLON.StandardMaterial("m", scene);
    mball.backFaceCulling = false;
    mball.bumpTexture = new BABYLON.Texture("/Demos/AudioAnalyser/grained_uv.png", scene);
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