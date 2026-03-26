var CreateLinesTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(20, 200, 400));

    camera.maxZ = 20000;

    camera.lowerRadiusLimit = 150;

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Create a whirlpool
    var points = [];

    var radius = 0.5;
    var angle = 0;
    for (var index = 0; index < 1000; index++) {
        points.push(new BABYLON.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
        radius += 0.3;
        angle += 0.1;
    }

    var whirlpool = BABYLON.Mesh.CreateLines("whirlpool", points, scene, true);
    whirlpool.color = new BABYLON.Color3(1, 1, 1);

    var positionData = whirlpool.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var heightRange = 10;
    var alpha = 0;
    scene.registerBeforeRender(function() {
        for (var index = 0; index < 1000; index++) {
            positionData[index * 3 + 1] = heightRange * Math.sin(alpha + index * 0.1);
        }

        whirlpool.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, positionData);

        alpha += 0.05 * scene.getAnimationRatio();
    });

    return scene;
};