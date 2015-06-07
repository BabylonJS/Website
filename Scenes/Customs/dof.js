var CreateDOFTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);

    //Adding a light
    var light = new BABYLON.HemisphericLight("omni", new BABYLON.Vector3(0, 1, 0.1), scene);
    light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.17);
    light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
    var light2 = new BABYLON.HemisphericLight("dirlight", new BABYLON.Vector3(1, -0.75, 0.25), scene);
    light2.diffuse = new BABYLON.Color3(0.95, 0.7, 0.4);
    light.specular = new BABYLON.Color3(0.7, 0.7, 0.4);

    //Adding an Arc Rotate Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.2, 1.0, 300, new BABYLON.Vector3(0, 10.0, 0), scene);
    camera.attachControl(engine.getRenderingCanvas(), false);
    camera.lowerRadiusLimit = 1;
    camera.maxZ = 2000;

    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 1.0,
        chromatic_aberration: 1.0,
        distortion: 1.0,
        dof_focus_depth: 200 / camera.maxZ,	// this sets the focus depth at a distance of 200
        dof_aperture: 3.0,		// set high to increase effect
        grain_amount: 1.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
    }, scene, 1.0, camera);

    // generate ground
    var ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 2, scene);
    var ground_material = new BABYLON.StandardMaterial('ground', scene);
    ground_material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.4);
    ground_material.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
    ground_material.specularPower = 10;
    ground.material = ground_material;

    // skull material
    var material = new BABYLON.StandardMaterial('building', scene);
    material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.85);
    material.specularColor = new BABYLON.Color3(0.07, 0.07, 0.07);
    material.specularPower = 100;

    BABYLON.SceneLoader.ImportMesh("", "/scenes/assets/", "skull.babylon", scene, function (newMeshes) {
        var mesh = newMeshes[0];

        var inst;
        var size;
        var angle;
        var dist;
        var count = 12;

        // generate skull instances
        for (var i = 0; i < count; i++) {
            angle = Math.PI * 2 * i / count;

            inst = mesh.createInstance('skull_inst');
            size = 0.75 + 0.5 * Math.random();
            dist = 100.0 + 15 * Math.random();

            inst.scaling.copyFromFloats(size, size, size);
            inst.rotation.y = -angle + Math.PI / 2;

            inst.position.y = size * 30.0;
            inst.position.x = Math.cos(angle) * dist;
            inst.position.z = Math.sin(angle) * dist;
        }

        for (var i = 0; i < count; i++) {
            angle = Math.PI * 2 * i / count;

            inst = mesh.createInstance('skull_inst');
            size = 0.25 + 0.25 * Math.random();
            dist = 30.0 + 5 * Math.random();

            inst.scaling.copyFromFloats(size, size, size);
            inst.rotation.y = -angle - Math.PI / 2;

            inst.position.y = size * 30.0;
            inst.position.x = Math.cos(angle) * dist;
            inst.position.z = Math.sin(angle) * dist;

        }

        mesh.setEnabled(false);

    });

    return scene;
}
