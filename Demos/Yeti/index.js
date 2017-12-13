var CreateYetiScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
		currentPluginName = plugin.name;

		if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
			plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.ALL;
			plugin.compileMaterials = true;
		}
	});

	engine.setHardwareScalingLevel(0.5);
	BABYLON.SceneLoader.Append("/Assets/Yeti/glTF/", "Yeti_Idle.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);
	});

	return scene;
};