function createScene(engine) {
    var scene = new BABYLON.Scene(engine);

    var material = new BABYLON.PBRMaterial("material", scene);
    material.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
    material.metallic = 0;
    material.bumpTexture = new BABYLON.Texture("/Assets/normal.png", scene, false, false);
    material.invertNormalMapX = true;

    createPlane("planeWithTangentsLH", scene, material, new BABYLON.Vector3(-1.1, +1.1, 0), true, true, false);
    createPlane("planeWithoutTangentsLH", scene, material, new BABYLON.Vector3(-1.1, -1.1, 0), true, false, false);
    createPlane("planeWithTangentsRH", scene, material, new BABYLON.Vector3(+1.1, +1.1, 0), true, true, true);
    createPlane("planeWithoutTangentsRH", scene, material, new BABYLON.Vector3(+1.1, -1.1, 0), true, false, true);

    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(1, -1, 1), scene);

    var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 0.1, scene);
    sphere.material = new BABYLON.PBRMaterial("spherMaterial", scene);
    sphere.material.metallic = 0;

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 6);
    camera.wheelPrecision = 100;
    camera.attachControl(scene.getEngine().getRenderingCanvas());

    return scene;
}

function createPlane(name, scene, material, center, normals, tangents, rightHanded) {
    var plane = new BABYLON.Mesh(name, scene);
    plane.material = material.clone();
    plane.position.addInPlace(center);

    var vertexData = BABYLON.VertexData.CreatePlane({ size: 2 });

    for (var i = 0; i < vertexData.uvs.length; i += 2) {
        vertexData.uvs[i + 1] = 1 - vertexData.uvs[i + 1];
    }

    if (tangents) {
        vertexData.tangents = [
            1, 0, 0, -1,
            1, 0, 0, -1,
            1, 0, 0, -1,
            1, 0, 0, -1
        ];
    }

    if (rightHanded) {
        for (var i = 0; i < vertexData.positions.length; i += 3) {
            vertexData.positions[i + 2] = -vertexData.positions[i + 2];
        }

        for (var i = 0; i < vertexData.normals.length; i += 3) {
            vertexData.normals[i + 2] = -vertexData.normals[i + 2];
        }

        if (vertexData.tangents) {
            for (var i = 0; i < vertexData.tangents.length; i += 4) {
                vertexData.tangents[i + 2] = -vertexData.tangents[i + 2];
                vertexData.tangents[i + 3] = -vertexData.tangents[i + 3];
            }
        }

        var root = new BABYLON.Mesh("root", scene);
        root.scaling.z = -1;
        plane.setParent(root);
    }

    vertexData.applyToMesh(plane);

    addLines(scene, plane);
}

function addLines(scene, mesh) {
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var tangents = mesh.getVerticesData(BABYLON.VertexBuffer.TangentKind);

    if (!positions || !normals) {
        return;
    }

    var scale = new BABYLON.Vector3();
    var rotation = new BABYLON.Quaternion();
    var position = new BABYLON.Vector3();
    mesh.getWorldMatrix().decompose(scale, rotation, position);
    var size = 0.1 / scale.length();

    var nlines = [];
    var tlines = [];
    var blines = [];
    for (var i = 0; i < normals.length; i++) {
        var v = BABYLON.Vector3.FromArray(positions, i * 3);
        var n = BABYLON.Vector3.FromArray(normals, i * 3);
        nlines.push([v, v.add(n.scale(size))]);

        if (tangents !== null) {
            var t4 = BABYLON.Vector4.FromArray(tangents, i * 4);

            var t = t4.toVector3();
            tlines.push([v, v.add(t.scale(size))]);

            var b = BABYLON.Vector3.Cross(n, t).scale(t4.w);
            blines.push([v, v.add(b.scale(size))]);
        }
    }

    var lines = {};

    lines.normals = BABYLON.MeshBuilder.CreateLineSystem("normalLines", { lines: nlines }, scene);
    lines.normals.color = new BABYLON.Color3(0, 0, 1);
    lines.normals.parent = mesh;

    if (tangents !== null) {
        lines.tangents = BABYLON.MeshBuilder.CreateLineSystem("tangentLines", { lines: tlines }, scene);
        lines.tangents.color = new BABYLON.Color3(1, 0, 0);
        lines.tangents.parent = mesh;

        lines.bitangents = BABYLON.MeshBuilder.CreateLineSystem("bitangentLines", { lines: blines }, scene);
        lines.bitangents.color = new BABYLON.Color3(0, 1, 0);
        lines.bitangents.parent = mesh;
    }
}
