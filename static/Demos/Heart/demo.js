var demo = {
    scene: "Heart",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        scene.getMeshByName("Labels").setEnabled(false);
        scene.getMeshByName("lums").useVertexColors = false;
        scene.gravity.scaleInPlace(0.5);
    }
};