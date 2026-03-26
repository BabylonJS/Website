var CreatePBRGlossyScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;
	scene.imageProcessingConfiguration.vignetteWeight = 4;
    scene.imageProcessingConfiguration.vignetteColor = new BABYLON.Color4(0, 0, 0, 0);
    scene.imageProcessingConfiguration.vignetteEnabled = true;

	var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
	hdrTexture.gammaSpace = false;

    BABYLON.SceneLoader.Append("/Assets/DamagedHelmet/glTF/", "DamagedHelmet.gltf", scene, function () {
	    scene.createDefaultCameraOrLight(true, true, true);
		scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

		scene.activeCamera.lowerRadiusLimit = 2;
		scene.activeCamera.upperRadiusLimit = 20;

		var pipeline = new BABYLON.DefaultRenderingPipeline(
			"default", // The name of the pipeline
			true, 
			scene, // The scene instance
			[scene.activeCamera] // The list of cameras to be attached to
		);

		pipeline.fxaaEnabled = true;
		pipeline.bloomEnabled = true;
		pipeline.bloomWeight = 0.2;
	});

	return scene;
};