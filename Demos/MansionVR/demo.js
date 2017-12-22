var demo = {
    scene: "Mansion",
    incremental: false,
    binary: false,
    doNotUseCDN: true,
    collisions: true,
    offline: false,
    onload: function () {
        var VRHelper = scene.createDefaultVRExperience();
        VRHelper.raySelectionPredicate = function (mesh) {
            return mesh.checkCollisions;
        }
        VRHelper.enableTeleportation({ floorMeshName: "Allée" });
    }
};