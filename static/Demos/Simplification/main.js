var createScene = function (engine, canvas) {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 100, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .5;

	var simplificationObject = new SimplificationGUI(scene);

	scene.registerBeforeRender(function () {
		if (simplificationObject.turnObject) {
			camera.alpha += 0.005;
		}
		if (scene.meshes.length === 0) return;
		var totals = scene.meshes.filter(function (mesh) {
			return !mesh._masterMesh
		}).map(function (mesh) {
			var lodObj = mesh.getLOD(camera);
			return {
				vertices: lodObj.getTotalVertices(),
				indices: lodObj.getTotalIndices()
			};
		}).reduce(function (prev, curr) {
			return {
				vertices: curr.vertices + prev.vertices,
				indices: curr.indices + prev.indices
			}
		});

		simplificationObject.vertices = totals.vertices;
		simplificationObject.indices = totals.indices;
	});
	generateGui(simplificationObject, scene, engine);
	
	var selectElement = document.getElementsByTagName("select")[0];
	selectElement.value = "Dude";
	fireEvent(selectElement, "change");

	return scene;
};

var SimplificationGUI = function (scene) {
	this.running = false;
	this.Click_To_Simplify = function () {
		if (this.running) return;
		this.running = true;

		this.state = "Simplifying...";
		var now = new Date().getTime() / 1000;
		var _this = this;

		scene.meshes.forEach(function (mesh) {
			if(!mesh.isVisible) return;
			if (mesh.hasLODLevels) {
				for (var index = 0; index < mesh._LODLevels.length; index++) {
					mesh._LODLevels[index].mesh.dispose();
					mesh.removeLODLevel(mesh._LODLevels[index].mesh);
				}
			}
			mesh.simplify([{ quality: _this.quality, distance: _this.atDistance, optimizeMesh: _this.optimizeMesh }],
				false, BABYLON.SimplificationType.QUADRATIC, function () {
					_this.running = false;
					var ms = Math.floor((new Date().getTime() / 1000 - now) * 1000) / 1000;
					_this.state = "Simplified in " + ms + " sec";
				});
		});
	};
	this.state = "Loaded";
	this.optimizeMesh = false;
	this.quality = 0.6;
	this.meshType = "HeightMap";
	this.atDistance = 40;
	this.vertices = 0;
	this.indices = 0;
	this.turnObject = true;
}

function fireEvent(obj, evt){
     var fireOnThis = obj;
     if( document.createEvent ) {
       var evObj = document.createEvent('MouseEvents');
       evObj.initEvent( evt, true, false );
       fireOnThis.dispatchEvent( evObj );
     }
} 

var generateGui = function (simplificationObject, scene, engine) {
	var gui = new dat.GUI();
	gui.add(simplificationObject, 'state').listen();
	gui.add(simplificationObject, 'optimizeMesh').listen();
	gui.add(simplificationObject, 'quality', 0.01, 0.99);
	gui.add(simplificationObject, 'atDistance').min(0);
	var meshController = gui.add(simplificationObject, 'meshType', ['HeightMap', 'Skull', 'Cat', 'Snowman', 'Rabbit', 'Dude']);
	meshController.onChange(function (value) {
		engine.displayLoadingUI();
		simplificationObject.state = "Loading";
		scene.meshes.forEach(function (mesh) {
			if (mesh.hasLODLevels) {
				for (var index = 0; index < mesh._LODLevels.length; index++) {
					mesh._LODLevels[index].mesh.dispose();
				}
			}
			mesh.dispose();
		});
		scene.meshes = [];
		switch (value) {
			case "HeightMap":
				simplificationObject.optimizeMesh = false;
				BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/Assets/heightmap.jpg", 100, 100, 150, 0, 20, scene, false, function (mesh) {
					engine.hideLoadingUI();
					scene.activeCamera.target = mesh;
					simplificationObject.state = "Loaded";
				});
				break;
			default:
				simplificationObject.optimizeMesh = true;
				var meshToLoad = (value==="Cat") ? "Shcroendiger'scat" : "";
				BABYLON.SceneLoader.ImportMesh(meshToLoad, "/Assets/" + value + "/", value + ".babylon", scene, function (newMeshes) {
					var selectedMesh = newMeshes[2] || newMeshes[1] || newMeshes[0];
					scene.activeCamera.target = selectedMesh.getBoundingInfo().boundingBox.center || newMeshes[0];
					engine.hideLoadingUI();
					simplificationObject.state = "Loaded";
				});
				break;
		}
	});

	gui.add(simplificationObject, 'vertices').listen();
	gui.add(simplificationObject, 'indices').listen();
	gui.add(simplificationObject, 'turnObject');
	gui.add(simplificationObject, 'Click_To_Simplify');
}