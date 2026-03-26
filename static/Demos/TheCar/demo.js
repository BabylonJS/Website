var demo = {
    scene: "TheCar",
    incremental: false,
    binary: true,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function () {
        scene.getMeshByName("C-Max_Pneu_arrière_gauche").material.bumpTexture = null;
        scene.getMeshByID("b73467cc-d1b0-4b8b-a767-12a95e0e28cf").alphaIndex = 0;
    }
};