var CreateChibiRexScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);


	engine.setHardwareScalingLevel(0.75);

	BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
		var currentPluginName = plugin.name;

		if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
			plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.ALL;
			plugin.compileMaterials = true;
		}
	});

	var loader = BABYLON.SceneLoader.Append("/Assets/ChibiRex/glTF/", "ChibiRex_Saturated.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);

		scene.activeCamera.alpha = 2.5;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.lowerRadiusLimit = 2;
		scene.activeCamera.upperRadiusLimit = 10;
		scene.activeCamera.useAutoRotationBehavior = true;
		scene.lights[0].dispose();

		var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
		light.position = new BABYLON.Vector3(1, 7, -2);
		var generator = new BABYLON.ShadowGenerator(512, light);
		generator.useBlurExponentialShadowMap = true;
		generator.blurKernel = 32;
		light.intensity = 0.7;

		for (var i = 0; i < scene.meshes.length; i++) {
			generator.addShadowCaster(scene.meshes[i], false);
			scene.meshes[i].alwaysSelectAsActiveMesh = true;
		}

		var helper = scene.createDefaultEnvironment({
			cameraContrast: 1.5,
			cameraExposure: 1.66,
			toneMappingEnabled: true,

			groundShadowLevel: 0.8,

			groundOpacity: 0.7, 

			skyboxColor: new BABYLON.Color3(.060, .0777, .082),
			groundColor: new BABYLON.Color3(.07, .087, .0893)

		});

		scene.imageProcessingConfiguration.colorCurvesEnabled = true;
		scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
		scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;

	});

	loader.onMaterialLoadedObservable.add(function (mat) {
		mat.useHorizonOcclusion = false;
	})
	return scene;
};