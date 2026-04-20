var CreateRibbonsTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0.2);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2 - 0.5, 0.5, 6, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(engine.getRenderingCanvas(), false);
    camera.wheelPrecision = 100;

    // fire material
    var fireMaterial = new BABYLON.StandardMaterial("fireMaterial", scene);
    var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, scene);
    fireTexture.level = 2;
    fireTexture.vScale = 0.5;
    fireMaterial.diffuseColor = new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2);
    fireMaterial.diffuseTexture = fireTexture;
    fireMaterial.alpha = 1;
    fireMaterial.specularTexture = fireTexture;
    fireMaterial.emissiveTexture = fireTexture;
    fireMaterial.specularPower = 4;
    fireMaterial.backFaceCulling = false;
    fireTexture.fireColors = [
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2),
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2),
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2),
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2),
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2),
    new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2)
    ];

    // initial vars
    var delay = 4000;
    var steps = Math.floor(delay / 80);;

    var paths = [];
    var targetPaths = [];
    var m = [1, 3, 1, 5, 1, 7, 1, 9];
    var lat = 50;
    var lng = 50;
    var deltas = [];
    var colors = fireTexture.fireColors;
    var deltaColors = [];
    var morph = false;
    var counter = 0;
    var rx = 0.0;
    var ry = 0.0;
    var deltarx = Math.random() / 200;
    var deltary = Math.random() / 400;

    // harmonic function : populates paths array according to m array
    var harmonic = function (m, lat, long, paths) {
        var pi = Math.PI;
        var pi2 = Math.PI * 2;
        var steplat = pi / lat;
        var steplon = pi2 / long;
        var index = 0;
        for (var theta = 0; theta <= pi2; theta += steplon) {
            var path = [];
            for (var phi = 0; phi <= pi; phi += steplat) {
                var r = 0;
                r += Math.pow(Math.sin(Math.floor(m[0]) * phi), Math.floor(m[1]));
                r += Math.pow(Math.cos(Math.floor(m[2]) * phi), Math.floor(m[3]));
                r += Math.pow(Math.sin(Math.floor(m[4]) * theta), Math.floor(m[5]));
                r += Math.pow(Math.cos(Math.floor(m[6]) * theta), Math.floor(m[7]));
                var p = new BABYLON.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
                path.push(p);
            }
            paths[index] = path;
            index++;
        }
    };

    // new SH function : fill targetPaths and delta arrays with Vector3 and colors
    var newSH = function (m, paths, targetPaths, deltas, deltaColors) {
        morph = true;
        var scl = 1 / steps;
        // new harmonic
        for (var i = 0; i < m.length; i++) {
            var rand = parseInt(Math.random() * 10);
            m[i] = rand;
        }
        harmonic(m, lat, lng, targetPaths);
        // deltas computation
        var index = 0;
        for (var p = 0; p < targetPaths.length; p++) {
            var targetPath = targetPaths[p];
            var path = paths[p];
            for (var i = 0; i < targetPath.length; i++) {
                deltas[index] = (targetPath[i].subtract(path[i])).scale(scl);
                index++;
            }
        }
        // delta colors
        for (var c = 0; c < colors.length; c++) {
            deltaColors[c] = (new BABYLON.Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2)).subtract(colors[c]).scale(scl);
        }
        // new rotation speeds
        deltarx = Math.random() / 200;
        deltary = Math.random() / 400;
    };

    // morphing function : update ribbons with intermediate m values
    var morphing = function (mesh, m, paths, targetPaths, deltas, deltaColors) {
        if (counter == steps) {
            counter = 0;
            morph = false;
            paths = targetPaths;
        }
        else {
            // update paths
            var index = 0;
            for (var p = 0; p < paths.length; p++) {
                var path = paths[p];
                for (var i = 0; i < path.length; i++) {
                    path[i] = path[i].add(deltas[index]);
                    index++;
                }
            }
            mesh = BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, mesh);
            // update colors
            for (var c = 0; c < colors.length; c++) {
                colors[c] = colors[c].add(deltaColors[c]);
            }
        }
        counter++;
        return mesh;
    };

    // SH init & ribbon creation
    harmonic(m, lat, lng, paths);
    var mesh = BABYLON.Mesh.CreateRibbon("ribbon", paths, true, false, 0, scene, true);
    mesh.freezeNormals();
    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
    mesh.material = fireMaterial;
    // Volumetric Light
    var volLight = new BABYLON.VolumetricLightScatteringPostProcess("vl", 1.0, camera, mesh, 50, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    volLight.exposure = 0.15;
    volLight.decay = 0.95;
    volLight.weight = 0.5;

    // interval setting
    var interval = window.setInterval(function () {
        newSH(m, paths, targetPaths, deltas, deltaColors);
        mesh = morphing(mesh, m, paths, targetPaths, deltas, deltaColors);
    }, delay);

    // immediate first SH
    newSH(m, paths, targetPaths, deltas, deltaColors);

    // then animation
    scene.registerBeforeRender(function () {
        if (morph) {
            mesh = morphing(mesh, m, paths, targetPaths, deltas, deltaColors);
        }
        rx += deltarx;
        ry -= deltary;
        mesh.rotation.y = ry;
        mesh.rotation.z = rx;
    });

    scene.onDispose = function () {
        clearInterval(interval);
    }

    return scene;   
};