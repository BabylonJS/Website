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
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.0, 1.3, 80, new BABYLON.Vector3(0, 10.0, 0), scene);
    camera.attachControl(engine.getRenderingCanvas(), false);
    camera.lowerRadiusLimit = 1;
    camera.maxZ = 2000;

    /*
		This is where we create the rendering pipeline and attach it to the camera.
		The pipeline accepts many parameters, but all of them are optional.
		Depending on what you set in your parameters array, some effects will be
		enabled or disabled. Here is a list of the possible parameters:
        {
               chromatic_aberration: number;       // from 0 to x (1 for realism)
               edge_blur: number;                  // from 0 to x (1 for realism)
               distortion: number;                 // from 0 to x (1 for realism)
               grain_amount: number;               // from 0 to 1
               grain_texture: BABYLON.Texture;     // texture to use for grain effect; if unset, use random B&W noise
               dof_focus_distance: number;         // depth-of-field: focus distance; unset to disable (disabled by default)
               dof_aperture: number;               // depth-of-field: focus blur bias (default: 1)
               dof_darken: number;                 // depth-of-field: darken that which is out of focus (from 0 to 1, disabled by default)
               dof_pentagon: boolean;              // depth-of-field: makes a pentagon-like "bokeh" effect
               dof_gain: number;                   // depth-of-field: highlights gain; unset to disable (disabled by default)
               dof_threshold: number;              // depth-of-field: highlights threshold (default: 1)
               blur_noise: boolean;                // add a little bit of noise to the blur (default: true)
        }
	*/

    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 1.0,
        chromatic_aberration: 1.0,
        distortion: 1.0,
        dof_focus_distance: 50,
        dof_aperture: 6.0,			// set this very high for tilt-shift effect
        grain_amount: 1.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
        dof_darken: 0.25
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

    // uncomment for debug!
    //scene.debugLayer.show();

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
            inst.rotation.y = -angle - Math.PI / 2;

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