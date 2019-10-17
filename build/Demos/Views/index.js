var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera0", 0, 0.8, 5, new BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 20;

    var camera1 = new BABYLON.ArcRotateCamera("Camera1", 0, 0.8, 10, new BABYLON.Vector3.Zero(), scene);

    var camera2 = new BABYLON.ArcRotateCamera("Camera2", 0, 0.8, 10, new BABYLON.Vector3.Zero(), scene);

    var camera3 = new BABYLON.ArcRotateCamera("Camera3", 0, 0.8, 10, new BABYLON.Vector3.Zero(), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var box = BABYLON.MeshBuilder.CreateBox("Box", {size: 2}, scene);

    box.position.y = 0.5;

    var mat = new BABYLON.PBRMetallicRoughnessMaterial("mat", scene);

    mat.metallic = 1;
    mat.roughness = 0.5;

    box.material = mat;

    scene.createDefaultEnvironment();
    
    engine.registerView(document.getElementById("renderCanvas1"), camera1);
    engine.registerView(document.getElementById("renderCanvas2"), camera2);
    engine.registerView(document.getElementById("renderCanvas3"), camera3);

    // Some animations
    var alpha = 0;
    scene.registerBeforeRender(() => {
        camera1.radius = 10 + Math.cos(alpha) * 5;
        camera2.alpha += 0.01;
        camera3.beta = Math.cos(alpha);

        alpha += 0.01;
    })

    return scene;

};