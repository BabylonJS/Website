var demo = {
    constructor: CreateChibiRexScene,
    onload: function () {
        scene.activeCamera.alpha = 2.5;
        scene.activeCamera.beta = 1.5;
        scene.activeCamera.lowerRadiusLimit = 2;
        scene.activeCamera.upperRadiusLimit = 10;
        scene.activeCamera.useAutoRotationBehavior = true;

        var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
        light.position = new BABYLON.Vector3(1, 7, -2);
        var generator = new BABYLON.ShadowGenerator(512, light);
        generator.useBlurExponentialShadowMap = true;
        generator.blurKernel = 32;

        for (var i = 0; i < scene.meshes.length; i++) {
            generator.addShadowCaster(scene.meshes[i]);
            scene.meshes[i].alwaysSelectAsActiveMesh = true;
        }

        var helper = scene.createDefaultEnvironment({
            groundShadowLevel: 0.6,
        });
        helper.setMainColor(new BABYLON.Color3(.19, .23, .12));

        scene.meshes[0].position.y -= 0.1;
    }
};