var CreateScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	engine.setHardwareScalingLevel(0.5);

	// Load the model
    BABYLON.SceneLoader.Append("https://www.babylonjs.com/Assets/DamagedHelmet/glTF/", "DamagedHelmet.gltf", scene, function (meshes) {
        // Create a camera pointing at your model.
		scene.createDefaultCameraOrLight(true, true, true);
		scene.activeCamera.lowerRadiusLimit = 20;
		scene.activeCamera.upperRadiusLimit = 80;
		scene.activeCamera.alpha = 2.5;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.useAutoRotationBehavior = true;
        
        var gl = new BABYLON.GlowLayer("glow", scene, { mainTextureSamples: 16 });
        
        var helper = scene.createDefaultEnvironment();
        helper.setMainColor(BABYLON.Color3.Gray());

		var postProcess = new BABYLON.AsciiArtPostProcess("AsciiArt", scene.activeCamera, "10px Monospace" );

		// Optimizer
		var optimizer = new BABYLON.SceneOptimizer(scene, options);
		optimizer.start();

		optimizer.onNewOptimizationAppliedObservable.add(function (optim) {
			console.log(optim.getDescription());
		});
		optimizer.onSuccessObservable.add(function () {
			console.log("Optimization done")
		});
	});

	return scene;
};