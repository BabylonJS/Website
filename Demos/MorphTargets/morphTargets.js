var addSpike = function(mesh) {
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var indices = mesh.getIndices();

    for (var index = 0; index < 5; index++) {
        var randomVertexID = (mesh.getTotalVertices() * Math.random()) | 0;
        var position = BABYLON.Vector3.FromArray(positions, randomVertexID * 3);
        var normal = BABYLON.Vector3.FromArray(normals, randomVertexID * 3);
        
        position.addInPlace(normal);

        position.toArray(positions, randomVertexID * 3);
    }

    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, false, false);
    mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, false, false);
}

var CreateMorphTargetsTestScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("camera1", 1.14, 1.13, 10, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    var hdrTexture = new BABYLON.HDRCubeTexture("/assets/room.hdr", scene, 512);

    var exposure = 0.6;
    var contrast = 1.6;
    var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.cameraExposure = exposure;
    glass.cameraContrast = contrast;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    sphere.material = glass; 

    var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
    sphere2.setEnabled(false);
    addSpike(sphere2);

    var sphere3 = BABYLON.Mesh.CreateSphere("sphere3", 16, 2, scene);
    sphere3.setEnabled(false);
    addSpike(sphere3);

    var sphere4 = BABYLON.Mesh.CreateSphere("sphere4", 16, 2, scene);
    sphere4.setEnabled(false);
    addSpike(sphere4);

    var sphere5 = BABYLON.Mesh.CreateSphere("sphere5", 16, 2, scene);
    sphere5.setEnabled(false);
    addSpike(sphere5);

    var manager = new BABYLON.MorphTargetManager();
    sphere.morphTargetManager = manager;

    var target0 = BABYLON.MorphTarget.FromMesh(sphere2, "sphere2", 0.25);
    manager.addTarget(target0);

    var target1 = BABYLON.MorphTarget.FromMesh(sphere3, "sphere3", 0.25);
    manager.addTarget(target1);

    var target2 = BABYLON.MorphTarget.FromMesh(sphere4, "sphere4", 0.25);
    manager.addTarget(target2);   

    var target3 = BABYLON.MorphTarget.FromMesh(sphere5, "sphere5", 0.25);
    manager.addTarget(target3);       

    var oldgui = document.querySelector("#datGUI");
	if (oldgui != null){
		oldgui.remove();
	}
	
	var gui = new dat.GUI();	
	gui.domElement.style.marginTop = "100px";
	gui.domElement.id = "datGUI";
    var options = {
	    influence0: 0.25,
        influence1: 0.25,
        influence2: 0.25,
        influence3: 0.25,
    }

    gui.add(options, "influence0", 0, 1).onChange(function(value) {
		target0.influence = value;
    });

    gui.add(options, "influence1", 0, 1).onChange(function(value) {
		target1.influence = value;
    });

    gui.add(options, "influence2", 0, 1).onChange(function(value) {
		target2.influence = value;
    });  

    gui.add(options, "influence3", 0, 1).onChange(function(value) {
		target3.influence = value;
    });        

    var button = { switch:function(){
         if (sphere.morphTargetManager) {
             sphere.morphTargetManager = null;
         } else {
             sphere.morphTargetManager = manager;
         }
    }};

    gui.add(button,'switch');

    return scene;

};