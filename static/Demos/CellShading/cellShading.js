var CreateCellShadingScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.PointLight("point01", new BABYLON.Vector3(0, 8, 0), scene);
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, 7), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.speed = 0.4;

    scene.ambientColor = new BABYLON.Color3(0, 0, 0);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Ground
    var groundCellMaterial = new BABYLON.CellMaterial("cell", scene);
    groundCellMaterial.backFaceCulling = false;
    groundCellMaterial.diffuseTexture = new BABYLON.Texture("../../assets/albedo.png", scene);
    groundCellMaterial.diffuseTexture.uScale = 16;
    groundCellMaterial.diffuseTexture.vScale = 16;
    groundCellMaterial.computeHighLevel = true;

    var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 100, scene);
    ground.material = groundCellMaterial;

    // Torus
    var cellMaterial = new BABYLON.CellMaterial("cell", scene);
    cellMaterial.backFaceCulling = false;
    cellMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    cellMaterial.diffuseTexture = new BABYLON.Texture("/assets/wood.jpg", scene);
    cellMaterial.diffuseTexture.uScale = 3;
    cellMaterial.diffuseTexture.vScale = 3;
    cellMaterial.computeHighLevel = true;

    var knot = BABYLON.Mesh.CreateTorusKnot("knot", 1, 0.4, 128, 64, 2, 3, scene);
    knot.position.y = 3;
    knot.material = cellMaterial;

    var range = 60;
    var count = 100;
    for (var index = 0; index < count; index++) {
        var newInstance = knot.createInstance("i" + index);
        var x = range / 2 - Math.random() * range;
        var z = range / 2 - Math.random() * range;
        var y = 3;

        newInstance.position = new BABYLON.Vector3(x, y, z);
        newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);
        newInstance.scaling = new BABYLON.Vector3(1, 1, 1);
    }

    return scene;
};