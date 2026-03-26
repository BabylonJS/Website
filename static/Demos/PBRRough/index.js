var CreatePBRRoughScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
	hdrTexture.gammaSpace = false;

    BABYLON.SceneLoader.Append("/Assets/", "Alien.glb", scene, function () {
	    scene.createDefaultCameraOrLight(true, true, true);
	    var sky = scene.createDefaultSkybox(hdrTexture, true, 100, 0.5);

	    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
	    light.position = new BABYLON.Vector3(-2, 4, -1);
	    light.setDirectionToTarget(new BABYLON.Vector3(0, 1, 0));
	    light.intensity = 20;
	    light.shadowMinZ = 2.5;
	    light.shadowMaxZ = 6;
	    light.shadowEnabled = true;

	    var light2 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-1, -2, -1), scene);
	    light2.position = new BABYLON.Vector3(2, 4, -1);
	    light2.setDirectionToTarget(new BABYLON.Vector3(0, 0.5, 0));
	    light2.intensity = 0;
	    light2.shadowMinZ = 2.5;
	    light2.shadowMaxZ = 6;

	    var generator = new BABYLON.ShadowGenerator(512, light);
	    generator.useBlurCloseExponentialShadowMap = true;
	    generator.useKernelBlur = true;
	    generator.blurScale = 1.0;
	    generator.blurKernel = 10.0;

	    for (var index = 0; index < scene.meshes.length; index++) {
			var m = scene.meshes[index];
	        if (m === sky) {
	            continue;
	        }
	        m.receiveShadows = true;
	        generator.getShadowMap().renderList.push(m);
	    }

	    scene.materials[0].environmmentIntensity = 0.5;
	});

	return scene;
};