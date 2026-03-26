var CreateSSAOScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", -2.5, 1.0, 200, new BABYLON.Vector3(0, 0, 0), scene);

	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.Append("/assets/cat/", "cat.babylon", scene, function () {

		scene.activeCamera = camera;

		// Create ssao rendering pipeline
		/*
		SSAO is a rendering pipeline, so we have to attach it to cameras
		The ratio is used by SSAO & Blur post-processes before adding to the
		original scene color to save performances. It is advised to use a ratio
		between 0.5 or 0.25 for enough good results and performances.
		You can also attach cameras directly by passing an array of Camera to the
		last parameter.
		*/

		var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', scene, { ssaoRatio: 0.5, combineRatio: 1.0 });
		ssao.fallOff = 0.000001;
		ssao.area = 1;
		ssao.radius = 0.0004;
		ssao.totalStrength = 2;
		ssao.base = 1.3;

		scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", camera);

		window.addEventListener("keydown", function (evt) {
			// draw SSAO with scene when pressed "1"
			if (evt.keyCode === 49) {
				scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", camera);
				scene.postProcessRenderPipelineManager.enableEffectInPipeline("ssaopipeline", ssao.SSAOCombineRenderEffect, camera);
			}
				// draw without SSAO when pressed "2"
			else if (evt.keyCode === 50) {
				scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssaopipeline", camera);
			}
				// draw only SSAO when pressed "3"
			else if (evt.keyCode === 51) {
				scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", camera);
				scene.postProcessRenderPipelineManager.disableEffectInPipeline("ssaopipeline", ssao.SSAOCombineRenderEffect, camera);
			}
		});
	});

	return scene;
};