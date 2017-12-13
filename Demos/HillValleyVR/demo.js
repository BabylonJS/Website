var demo = {
    scene: "HillValley",
    incremental: true,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        scene.collisionsEnabled = false;
        var VRHelper = scene.createDefaultVRExperience();
        VRHelper.enableTeleportation({
            floorMeshName: "Road1"
        });
    }
};