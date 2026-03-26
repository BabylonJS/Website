var CreateSoftShadowsTestScene = function (engine) {
   var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", -2.5, 1.0, 200, new BABYLON.Vector3(0, 1.0, 0), scene);

	BABYLON.SceneLoader.Append("../../assets/", "SSAOcat.babylon", scene, function () {

		scene.lights[0].dispose();
		scene.activeCamera = camera;
		camera.attachControl(engine.getRenderingCanvas(), false);

		var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 0.8), scene);
		var light2 = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 0.8), scene);
		var light3 = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 0.8), scene);

		light.position = new BABYLON.Vector3(0, 120.0, -10);
		light2.position = new BABYLON.Vector3(0, 120.0, -10);
		light3.position = new BABYLON.Vector3(0, 120.0, -10);

		light.diffuse = BABYLON.Color3.Red();
		light2.diffuse = BABYLON.Color3.Green();
		light3.diffuse = BABYLON.Color3.Blue();

		var cat = scene.meshes[2];
		cat.receiveShadows = false;

		// Shadows
		var generator = new BABYLON.ShadowGenerator(512, light);
		generator.getShadowMap().renderList.push(cat);
		generator.useBlurExponentialShadowMap = true;
		generator.blurBoxOffset = 2.0;

		var generator2 = new BABYLON.ShadowGenerator(512, light2);
		generator2.getShadowMap().renderList.push(cat);
		generator2.useBlurExponentialShadowMap = true;
		generator2.blurBoxOffset = 2.0;

		var generator3 = new BABYLON.ShadowGenerator(512, light3);
		generator3.getShadowMap().renderList.push(cat);
		generator3.useBlurExponentialShadowMap = true;
		generator3.blurBoxOffset = 2.0;

		// Animations
		var alpha = 0;
		scene.registerBeforeRender(function() {
			light.direction.z = 0.8 * Math.cos(alpha);
			light.direction.x = 0.3 * Math.sin(alpha);

			light2.direction.z = 0.3 * Math.cos(alpha);
			light2.direction.x = 0.8 * Math.sin(alpha);

			light3.direction.x = 0.3 * Math.cos(alpha);
			light3.direction.z = 0.8 * Math.sin(alpha);
			alpha += 0.01;
		});
	});

	return scene;
};