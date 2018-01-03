var CreateChibiRexScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	engine.setHardwareScalingLevel(0.75);

	BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
		currentPluginName = plugin.name;

		if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
			plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.ALL;
			plugin.compileMaterials = true;
		}
	});

	BABYLON.SceneLoader.Append("/Assets/ChibiRex/glTF/", "ChibiRex_Idle_fix.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);

		scene.activeCamera.alpha = 2.5;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.lowerRadiusLimit = 2;
		scene.activeCamera.upperRadiusLimit = 10;
		scene.activeCamera.useAutoRotationBehavior = true;

		var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
		light.position = new BABYLON.Vector3(1, 7, -2);
		var generator = new BABYLON.ShadowGenerator(512, light);
		generator.useBlurExponentialShadowMap = true;
		generator.blurKernel = 32;

		for (var i = 0; i < scene.meshes.length; i++) {
			generator.addShadowCaster(scene.meshes[i]);
			scene.meshes[i].alwaysSelectAsActiveMesh = true;
		}

		var helper = scene.createDefaultEnvironment({
			groundShadowLevel: 0.6,
		});
		helper.setMainColor(new BABYLON.Color3(.19, .23, .12));

		scene.meshes[0].position.y -= 0.8;
	});

	return scene;
};