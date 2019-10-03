var createScene = function () {
    
    var scene = new BABYLON.Scene(engine);  

    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/", "flightHelmet.glb", scene, function (meshes) {          
        scene.createDefaultCameraOrLight(true, true, true);
		scene.createDefaultEnvironment();
		
        meshes[0].rotationQuaternion = null;        
		BABYLON.Animation.CreateAndStartAnimation("turnTable", meshes[0], "rotation.y", 60, 480, 0, Math.PI * 2);
    });

    return scene;
};