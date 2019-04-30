var demo = {
    scene: "flat2009",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        var ecran = scene.getMeshByName("Ecran");
        ecran.material.diffuseTexture = new BABYLON.VideoTexture("video", ["/Scenes/Flat2009/babylonjs.mp4", "/Scenes/Flat2009/babylonjs.webm"], scene, true, true);
        scene.createOrUpdateSelectionOctree();
        scene.gravity.scaleInPlace(0.5);
    }
};