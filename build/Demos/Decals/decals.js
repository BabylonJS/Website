var CreateDecalsTestScene = function (engine) {
	var scene = new BABYLON.Scene(engine);

	//Adding a light
	var light = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), scene);

	//Adding an Arc Rotate Camera
	var camera = new BABYLON.ArcRotateCamera("Camera", -1.85, 1.2, 200, BABYLON.Vector3.Zero(), scene);

	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.ImportMesh("Shcroendiger'scat", "../../assets/", "SSAOcat.babylon", scene, function (newMeshes) {
		var cat = newMeshes[0];

		// Set the target of the camera to the first imported mesh
		camera.target = cat;

		var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
		decalMaterial.diffuseTexture = new BABYLON.Texture("../../assets/impact.png", scene);
		decalMaterial.diffuseTexture.hasAlpha = true;
		decalMaterial.zOffset = -2;

		var onPointerDown = function (evt) {
			if (evt.button !== 0) {
				return;
			}

			// check if we are under a mesh
			var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh === cat; });
			if (pickInfo.hit) {
				var decalSize = new BABYLON.Vector3(10, 10, 10);

				var newDecal = BABYLON.Mesh.CreateDecal("decal", cat, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
				newDecal.material = decalMaterial;
			}
		}
		var canvas = engine.getRenderingCanvas();
		canvas.addEventListener("pointerdown", onPointerDown, false);

		scene.onDispose = function () {
			canvas.removeEventListener("pointerdown", onPointerDown);
		}
	});

	return scene;
};