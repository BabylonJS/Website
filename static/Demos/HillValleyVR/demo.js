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
        VRHelper.raySelectionPredicate = function (mesh) {
            return mesh.checkCollisions;
        }
        VRHelper.enableTeleportation({
            floorMeshName: "Road1"
        });
    }
};