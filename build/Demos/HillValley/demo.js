var demo = {
    scene: "HillValley",
    incremental: true,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        scene.collisionsEnabled = false;
        scene.lightsEnabled = false;
        scene.activeCamera.applyGravity = true;
        scene.createOrUpdateSelectionOctree();
        for (var matIndex = 0; matIndex < scene.materials.length; matIndex++) {
            scene.materials[matIndex].checkReadyOnEveryCall = false;
        }
    }
};