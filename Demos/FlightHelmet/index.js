var CreateFlightHelmetScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	engine.setHardwareScalingLevel(0.5);

	var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
	hdrTexture.gammaSpace = false;

	BABYLON.SceneLoader.Append("/Assets/FlightHelmet/glTF/", "FlightHelmet_Materials.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);

		scene.activeCamera.lowerRadiusLimit = 20;
		scene.activeCamera.upperRadiusLimit = 80;
		scene.activeCamera.alpha = 2.5;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.useAutoRotationBehavior = true;
	});

	return scene;
};