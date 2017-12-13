var demo = {
    constructor: CreateFlightHelmetScene,
    onload: function () {
        var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(2, -3, -1), scene);
        light.position = new BABYLON.Vector3(-20, 20, 6);
        var generator = new BABYLON.ShadowGenerator(512, light);
        generator.useBlurExponentialShadowMap = true;
        generator.blurKernel = 32;
        generator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

        for (var i = 0; i < scene.meshes.length; i++) {
            generator.addShadowCaster(scene.meshes[i]);
        }

        var helper = scene.createDefaultEnvironment({
            skyboxSize: 1500,
            groundShadowLevel: 0.6,
        });

        helper.setMainColor(new BABYLON.Color3(.42, .41, .33));

        scene.meshes[0].position.y -= 0.5;
    }
};