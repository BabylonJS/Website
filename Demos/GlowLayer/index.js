var CreateScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
    scene.imageProcessingConfiguration.contrast = 1.6;
    scene.imageProcessingConfiguration.exposure = 0.6;
    scene.imageProcessingConfiguration.toneMappingEnabled = true;

    // Load the model
    BABYLON.SceneLoader.Append("https://www.babylonjs.com/Assets/NeonPipe/glTF/", "NeonPipe.gltf", scene, function (meshes) {
        // Create a camera pointing at your model.
        scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.lowerRadiusLimit = 20;
        scene.activeCamera.upperRadiusLimit = 80;
        scene.activeCamera.alpha = 2.5;
        scene.activeCamera.beta = 1.5;
        scene.activeCamera.useAutoRotationBehavior = true;
        
        var gl = new BABYLON.GlowLayer("glow", scene, { mainTextureSamples: 2 });

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel = new BABYLON.GUI.StackPanel();
        panel.width = "200px";
        panel.isVertical = false;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel);

        var checkbox = new BABYLON.GUI.Checkbox();
        checkbox.width = "20px";
        checkbox.height = "20px";
        checkbox.isChecked = true;
        checkbox.color = "green";
        checkbox.onIsCheckedChangedObservable.add(function(value) {
            gl.isEnabled = value;
        });
        panel.addControl(checkbox);

        var header = new BABYLON.GUI.TextBlock();
        header.text = "Glow Enabled";
        header.width = "180px";
        header.marginLeft = "5px";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        header.color = "white";
        panel.addControl(header);

        var helper = scene.createDefaultEnvironment();
        helper.setMainColor(BABYLON.Color3.Gray());
    });

    return scene;
};