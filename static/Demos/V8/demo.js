var demo = {
    scene: "V8",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function () {
        scene.activeCamera.minZ = 1;
        scene.lights[0].getShadowGenerator().usePoissonSampling = true;
        scene.lights[0].getShadowGenerator().bias = 0.01;
    }
};