var CreateLODTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 0), scene);
    var hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1.0, 0), scene);

    scene.fogColor = scene.clearColor;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogStart = 10;
    scene.fogEnd = 50;

    // Materials
    var materialAmiga = new BABYLON.StandardMaterial("amiga", scene);
    materialAmiga.diffuseTexture = new BABYLON.Texture("/assets/amiga.jpg", scene);
    materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    materialAmiga.diffuseTexture.uScale = 5;
    materialAmiga.diffuseTexture.vScale = 5;

    var materialRed = new BABYLON.StandardMaterial("red", scene);
    materialRed.emissiveColor = new BABYLON.Color3(0.5, 0, 0);

    // Create a wall of knots
    var count = 3;
    var scale = 4;

    var knot00 = BABYLON.Mesh.CreateTorusKnot("knot0", 0.5, 0.2, 128, 64, 2, 3, scene);
    var knot01 = BABYLON.Mesh.CreateTorusKnot("knot1", 0.5, 0.2, 32, 16, 2, 3, scene);
    var knot02 = BABYLON.Mesh.CreateTorusKnot("knot2", 0.5, 0.2, 24, 12, 2, 3, scene);
    var knot03 = BABYLON.Mesh.CreateTorusKnot("knot3", 0.5, 0.2, 16, 8, 2, 3, scene);

    knot00.setEnabled(false);
    knot01.setEnabled(false);
    knot02.setEnabled(false);
    knot03.setEnabled(false);

    knot00.material = materialAmiga;
    knot01.material = materialAmiga;
    knot02.material = materialRed;
    knot03.material = materialRed;

    knot00.addLODLevel(15, knot01);
    knot00.addLODLevel(30, knot02);
    knot00.addLODLevel(45, knot03);
    knot00.addLODLevel(55, null);

    for (var x = -count; x <= count; x++) {
        for (var y = -count; y <= count; y++) {
            for (var z = 5; z < 10; z++) {
                var knot = knot00.createInstance("knotI");

                knot.position = new BABYLON.Vector3(x * scale, y * scale, z * scale);
            }
        }
    }

    return scene;
};