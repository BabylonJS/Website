var CreateShadowsTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);

    // Setup environment
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -20), scene);
    camera.attachControl(canvas, true);
    // light1
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);

    // Torus
    var torus = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);
    torus.position.x = -5;

    var torus2 = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);
    torus2.position.x = 5;

    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light, true);
    shadowGenerator.getShadowMap().renderList.push(torus);
    shadowGenerator.useBlurExponentialShadowMap = true;
    light.shadowMinZ = 1;
    light.shadowMaxZ = 2500;
    shadowGenerator.depthScale = 2500;
    shadowGenerator.bias = 0.001;

    torus.receiveShadows = true;

    scene.registerBeforeRender(function() {
        torus.rotation.x += 0.01;
        torus2.rotation.x += 0.01;
    });

    return scene;
};