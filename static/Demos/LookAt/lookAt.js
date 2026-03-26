/*
	How to use lookat to make an eye-candy effect ! :)
	by Steve 'Stv' Duran for BabylonJS featured demos on 02.12.2015
*/
var camera;
var scene;

var cubes = [];
var cubes_mat;

// better random function
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Create random cubes in a box of 100x100x100
function createCubesBall(num) {
    for (var i = 0; i < num; i++) {
        if (i === 0)
            cubes[i] = BABYLON.Mesh.CreateBox("b", 1.0, scene);
        else
            cubes[i] = cubes[0].createInstance("b" + i);

        var x = rnd(-50, 50);
        var y = rnd(-50, 50);
        var z = rnd(-50, 50);

        cubes[i].scaling = new BABYLON.Vector3(rnd(1.0, 1.5), rnd(1.0, 1.5), rnd(1.0, 10.0));

        cubes[i].position = new BABYLON.Vector3(x, y, z);

        cubes[i].lookAt(new BABYLON.Vector3(0, 0, 0));
    }
}

var CreateLookAtTestScene = function (engine) {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    engine.backFaceCulling = false;

    camera = new BABYLON.ArcRotateCamera("Camera", 33.7081, 0.9001, 39.91, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 10, 0), scene);

    var light1 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 10, 0), scene);
    light1.diffuseColor = new BABYLON.Color3(1, 1, 1);

    var sphere = BABYLON.Mesh.CreateSphere("s", 32, 5, scene);

    createCubesBall(1000);

    var mat_sphere = new BABYLON.StandardMaterial("s", scene);
    sphere.material = mat_sphere;

    var probe = new BABYLON.ReflectionProbe("probe", 512, scene);
    probe.renderList.push(sphere);

    cubes_mat = new BABYLON.StandardMaterial("m", scene);
    cubes_mat.diffuseTexture = new BABYLON.Texture("square.jpg", scene);

    cubes[0].material = cubes_mat;

    var container = BABYLON.Mesh.CreateBox("cont", 110, scene);
    var mat_cont = new BABYLON.StandardMaterial("mc", scene);
    mat_cont.alpha = 0.1;
    container.material = mat_cont;

    var px = 0, py = 0, pz = 0;
    var cr = 0, cg = 0, cb = 0;
    var t = 0.0;

    scene.registerBeforeRender(function () {

        // sin/cos random direction
        px = 25.0 * Math.cos(t / 3.5);
        py = 25.0 + 10.0 * Math.sin(t / 4.0);
        pz = 25.0 * Math.cos(t / 4.5);

        // sin/cos random color between 0,1
        cr = 0.5 + 0.5 * Math.sin(t / 12);
        cg = 0.5 + 0.5 * Math.sin(t / 14);
        cb = 0.5 + 0.5 * Math.sin(t / 16);

        // Change sphere and cubes colors
        mat_sphere.diffuseColor = new BABYLON.Color3(cr, cg, cb);
        mat_sphere.emissiveColor = new BABYLON.Color3(cr, cg, cb);
        cubes_mat.diffuseColor = new BABYLON.Color3(cr, cg, cb);

        // Move our sphere
        sphere.position = new BABYLON.Vector3(px, py, pz);

        // Make all cubes look at the moving sphere
        for (var i = 0; i < cubes.length; i++) {
            cubes[i].lookAt(new BABYLON.Vector3(px, py, pz));
        }

        camera.alpha = 4.0 * (Math.PI / 20 + Math.cos(t / 30));
        camera.beta = 2.0 * (Math.PI / 20 + Math.sin(t / 50));
        camera.radius = 180 + (-50 + 50 * Math.sin(t / 10));

        t += 0.1;
    });

    return scene;
};