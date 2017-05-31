var CreateSSAOScene = function (engine) {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", -2.5, 1.0, 200, new BABYLON.Vector3(0, 0, 0), scene);

	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.Append("/assets/cat/", "cat.babylon", scene, function () {

		scene.activeCamera = camera;

		// Create ssao 2 rendering pipeline

		// Create SSAO and configure all properties (for the example)
		var ssaoRatio = {
		    ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
		    blurRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
		};

		var ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, ssaoRatio);
		ssao.radius = 42;
		ssao.totalStrength = 0.9;
		ssao.base = 0.2;
		ssao.expensiveBlur = true;
		ssao.samples = 16;
		ssao.maxZ = 2500;

		// Attach camera to the SSAO render pipeline
		scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);

		window.addEventListener("keydown", function (evt) {
			// draw SSAO with scene when pressed "1"
			if (evt.keyCode === 49) {
				scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
				scene.postProcessRenderPipelineManager.enableEffectInPipeline("ssao", ssao.SSAOCombineRenderEffect, camera);
			}
				// draw without SSAO when pressed "2"
			else if (evt.keyCode === 50) {
				scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssao", camera);
			}
				// draw only SSAO when pressed "3"
			else if (evt.keyCode === 51) {
				scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
				scene.postProcessRenderPipelineManager.disableEffectInPipeline("ssao", ssao.SSAOCombineRenderEffect, camera);
			}
		});

		var gui = new dat.GUI({ autoPlace : false});
		var elt = document.getElementById("gui");
		elt.style.position = "absolute";
		elt.style.right = "0px";
		elt.style.bottom = "0px";
		elt.appendChild(gui.domElement);
		gui.add(ssao, "radius", 1.0, 150.0);
		gui.add(ssao, "totalStrength", 0.1, 10);
		gui.add(ssao, "base", 0.0, 1.0);
		var samples = gui.add(ssao, "samples", 2, 32).step(1);
		gui.add(ssao, "expensiveBlur");

		ssao.ssaoRatio = 0.5;
		ssao.blurRatio = 1.0;
		var ssaoRatio = gui.add(ssao, "ssaoRatio", { Quarter: 0.25, Half: 0.5, Full: 1 });
		var blurRatio = gui.add(ssao, "blurRatio", { Quarter: 0.25, Half: 0.5, Full: 1 });

		ssaoRatio.onChange(function(value) {
		    ssao._blurHPostProcess._options = value;
		});

		blurRatio.onChange(function(value) {
		    ssao._blurVPostProcess._options = value;
		    ssao._ssaoCombinePostProcess._options = value;
		});

	});

	return scene;
};