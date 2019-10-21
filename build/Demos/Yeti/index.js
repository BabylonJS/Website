var CreateYetiScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0);
	scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

	BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
		var currentPluginName = plugin.name;

		if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
			plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.ALL;
			plugin.compileMaterials = true;
		}
	}); 

	engine.setHardwareScalingLevel(0.75);
	BABYLON.SceneLoader.Append("/Assets/Yeti/glTF/", "Yeti_Idle.gltf", scene, function () {
		scene.createDefaultCameraOrLight(true, true, true);

		scene.activeCamera.alpha = 2;
		scene.activeCamera.beta = 1.5;
		scene.activeCamera.lowerRadiusLimit = 20;
		scene.activeCamera.upperRadiusLimit = 200;
		scene.activeCamera.useAutoRotationBehavior = true;

		for (var i = 0; i < scene.meshes.length; i++) {
			scene.meshes[i].alwaysSelectAsActiveMesh = true;
		}

		// Environment
		var helper = scene.createDefaultEnvironment({
			skyboxSize: 1000,
			groundShadowLevel: 0.6,
		});
		helper.setMainColor(BABYLON.Color3.White());

		// SNOW 
		var fountain = BABYLON.Mesh.CreateBox("fountain", .1, scene);
		fountain.position.y = 100;
		fountain.isVisible = false;

		var particleSystem = new BABYLON.ParticleSystem("particles", 1500, scene, null, true);
		particleSystem.particleTexture = new BABYLON.Texture("/Assets/Yeti/snowflake.png", scene);
		scene.registerBeforeRender(function() {
			particleSystem.startSpriteCellID = Math.round(Math.random() * 3 - 1);
			particleSystem.endSpriteCellID = particleSystem.startSpriteCellID;
		});
		particleSystem.startSpriteCellID = 0;
		particleSystem.endSpriteCellID = 0;
		particleSystem.spriteCellHeight = 512;
		particleSystem.spriteCellWidth = 512;

		// Where the particles come from
		particleSystem.emitter = fountain; // the starting object, the emitter
		particleSystem.minEmitBox = new BABYLON.Vector3(-100, 0, -100); // Starting all from
		particleSystem.maxEmitBox = new BABYLON.Vector3(100, 0, 100); // To...

		particleSystem.minSize = 0.5;
		particleSystem.maxSize = 4;

		particleSystem.minLifeTime = 1.2;
		particleSystem.maxLifeTime = 1.6;

		particleSystem.emitRate = 150;

		// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		particleSystem.gravity = new BABYLON.Vector3(0, -98, 0);
		particleSystem.direction1 = new BABYLON.Vector3(5.5, -1, 5.5);
		particleSystem.direction2 = new BABYLON.Vector3(-5.5, -1, -5.5);

		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		// Speed
		particleSystem.minEmitPower = 1;
		particleSystem.maxEmitPower = 10;
		particleSystem.updateSpeed = 0.005;

		var gui = new dat.GUI();
		gui.add(particleSystem, 'minSize', 0.1, 5);
		gui.add(particleSystem, 'maxSize', 0.1, 5);
		gui.add(particleSystem, 'emitRate', 1, 500);
		gui.add(particleSystem, 'updateSpeed', 0, 0.02);

		// Start the particle system
		particleSystem.start();
	});

	return scene;
};