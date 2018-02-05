var demo = {
    scene: "Espilit",
    incremental: false,
    binary: true,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function () {
        scene.autoClear = true;
        scene.createOrUpdateSelectionOctree();
        scene.getMeshByName("Sol loin").useVertexColors = false;
        scene.gravity.scaleInPlace(0.5);

        var gl = new BABYLON.GlowLayer("glow", scene, {
            mainTextureSamples: 4 
        });
        gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === "Bandes lum") {
                result.set(1, 1, 1, 1);
            } else {
                result.set(0, 0, 0, 0);
            }
        }
    }
};