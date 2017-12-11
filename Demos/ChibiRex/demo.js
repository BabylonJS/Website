var demo = {
    constructor: CreateChibiRexScene,
    onload: function () {
        scene.activeCamera.alpha = 2.5;
        scene.activeCamera.beta = 1.5;
        scene.activeCamera.upperRadiusLimit = 6;
        scene.activeCamera.useAutoRotationBehavior = true;

        // Environment
        var helper = scene.createDefaultEnvironment({
            groundShadowLevel: 0.6,
        });
        helper.setMainColor(new BABYLON.Color3(.19, .23, .12));
    }
};