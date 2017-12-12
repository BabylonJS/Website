var demo = {
    scene: "Mansion",
    incremental: false,
    binary: false,
    doNotUseCDN: true,
    collisions: true,
    offline: false,
    onload: function () {
        var VRHelper = scene.createDefaultVRExperience();
        VRHelper.enableTeleportation({ floorMeshName: "Allée" });
    }
};