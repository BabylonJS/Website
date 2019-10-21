var CreateCellShadingScene = function (engine) {
    
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 40, BABYLON.Vector3.Zero(), scene);
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene);
    var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 32, 3, scene);
    var cylinder = BABYLON.Mesh.CreateCylinder("Sphere1", 5, 3, 2, 32, 1, scene);
    var torus = BABYLON.Mesh.CreateTorus("Sphere2", 3, 1, 32, scene);

    var cellShadingMaterial = new BABYLON.ShaderMaterial("cellShading", scene, "../../Assets/shaders/cellShading",
    {
        uniforms: ["world", "viewProjection"],
        samplers: ["textureSampler"]
    });
    cellShadingMaterial.setTexture("textureSampler", new BABYLON.Texture("../../Assets/Ground.jpg", scene))
                       .setVector3("vLightPosition", light.position)
                       .setFloats("ToonThresholds", [0.95, 0.5, 0.2, 0.03])
                       .setFloats("ToonBrightnessLevels", [1.0, 0.8, 0.6, 0.35, 0.01])
                       .setColor3("vLightColor", light.diffuse);
    
    sphere.material = cellShadingMaterial;
    sphere.position = new BABYLON.Vector3(-10, 0, 0);
    cylinder.material = cellShadingMaterial;
    torus.material = cellShadingMaterial;
    torus.position = new BABYLON.Vector3(10, 0, 0);
    
    // Animations
    var alpha = 0;
    scene.registerBeforeRender(function () {
        sphere.rotation.y = alpha;
        sphere.rotation.x = alpha;
        cylinder.rotation.y = alpha;
        cylinder.rotation.x = alpha;
        torus.rotation.y = alpha;
        torus.rotation.x = alpha;

        alpha += 0.05;
    });
    
    return scene;
};