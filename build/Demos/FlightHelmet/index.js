var CreateFlightHelmetScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	engine.setHardwareScalingLevel(0.5);

	BABYLON.SceneLoader.Append("/Assets/FlightHelmet/glTF/", "FlightHelmet_Materials.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);

		scene.activeCamera.lowerRadiusLimit = 20;
		scene.activeCamera.upperRadiusLimit = 80;
		scene.activeCamera.alpha = 2.5;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.useAutoRotationBehavior = true;

		var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(2, -3, -1), scene);
		light.position = new BABYLON.Vector3(-20, 20, 6);
		var generator = new BABYLON.ShadowGenerator(512, light);
		generator.useBlurExponentialShadowMap = true;
		generator.blurKernel = 32;
		generator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

		for (var i = 0; i < scene.meshes.length; i++) {
			generator.addShadowCaster(scene.meshes[i]);
		}

		var helper = scene.createDefaultEnvironment({
			groundShadowLevel: 0.6,
		});

		helper.setMainColor(new BABYLON.Color3(.42, .41, .33));

		var options = new BABYLON.SceneOptimizerOptions(50, 2000);
		options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));

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