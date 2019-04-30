var CreateTunnelScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 400, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 0, 10), scene);
    light.position = camera.position;

    var tunnelTexture = new BABYLON.Texture("Inundation.jpg", scene);

    var tunnelShader = new BABYLON.PostProcess("Tunnel", "./tunnelpp", ["time"], ["tunnelSampler"], 0.9, camera);

    var time = 0.0;

    tunnelShader.onApply = function (effect) {
        effect.setFloat("time", time / 5.0);
        if (tunnelTexture.isReady()) {
            effect.setTexture("tunnelSampler", tunnelTexture);
        }
        time += 0.1;
    };

    return scene;
};