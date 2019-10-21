var CreateStarfieldScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, -30, BABYLON.Vector3.Zero(), scene);

    //get spaceship
    var spaceDek;
    BABYLON.SceneLoader.ImportMesh("Vaisseau", "http://david.blob.core.windows.net/babylonjs/banner/SpaceDek/", "SpaceDek.babylon", scene, function (newMeshes, particleSystems) {
        spaceDek = newMeshes[0];
        spaceDek.position = new BABYLON.Vector3(6, 0, 0);
        spaceDek.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        spaceDek.rotation.y = Math.PI;
        spaceDek.rotation.z = -Math.PI / 7 * 3;
        spaceDek.rotation.x = Math.PI;

        scene.stopAnimation(spaceDek);
        for (var i = 0; i < particleSystems.length; i++) {
            if (particleSystems[i].emitter.name == "Part006" || particleSystems[i].emitter.name == "Part007") {
                particleSystems[i].stop();
            }
        }
    });

    var hemisphericLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), scene);

    var spaceScale = 10.0;
    var space = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, scene);

    var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", 512, scene);
    var starfieldMaterial = new BABYLON.StandardMaterial("starfield", scene);
    starfieldMaterial.diffuseTexture = starfieldPT;
    starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    starfieldMaterial.backFaceCulling = false;
    starfieldPT.beta = 0.1;

    space.material = starfieldMaterial;

    scene.registerBeforeRender(function () {
        starfieldPT.time += scene.getAnimationRatio() * 0.8;
    });

    return scene;
}