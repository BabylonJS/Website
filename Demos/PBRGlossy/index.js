var CreatePBRGlossyScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	engine.setHardwareScalingLevel(0.5);

	var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
	hdrTexture.gammaSpace = false;

	BABYLON.SceneLoader.Append("/Assets/DamagedHelmet/glTF/", "DamagedHelmet.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);
		scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

		scene.activeCamera.lowerRadiusLimit = 2;
		scene.activeCamera.upperRadiusLimit = 20;

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