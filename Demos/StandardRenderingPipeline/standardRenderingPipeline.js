var CreateStandardRenderingPipelineTestScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true, false);
    camera.minZ = 0.1;

    // Light
    new BABYLON.PointLight("point", new BABYLON.Vector3(0, 40, 0), scene);

    // Environment Texture
    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/assets/environment.dds", scene);

    // Skybox
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.cameraExposure = 0.6;
    hdrSkyboxMaterial.cameraContrast = 1.6;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;

    // Create meshes
    var woodPlank = BABYLON.MeshBuilder.CreateBox("plane", { width: 65, height: 1, depth: 65 }, scene);

    // Create materials
    var wood = new BABYLON.PBRMaterial("wood", scene);
    wood.reflectionTexture = hdrTexture;
    wood.directIntensity = 1.5;
    wood.environmentIntensity = 0.5;
    wood.specularIntensity = 0.3;
    wood.cameraExposure = 0.9;
    wood.cameraContrast = 1.6;

    wood.reflectivityTexture = new BABYLON.Texture("/assets/reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;

    wood.albedoColor = BABYLON.Color3.White();
    wood.albedoTexture = new BABYLON.Texture("/assets/albedo.png", scene);
    woodPlank.material = wood;

    // Create rendering pipeline
    var pipeline = new BABYLON.StandardRenderingPipeline("standard", scene, 1.0, null, [camera]);
    pipeline.lensTexture = pipeline.lensFlareDirtTexture = new BABYLON.Texture("/assets/lensdirt.jpg", scene);
    pipeline.lensStarTexture = new BABYLON.Texture("/assets/lensstar.png", scene);
    pipeline.lensColorTexture = new BABYLON.Texture("/assets/lenscolor.png", scene);
    pipeline.lensFlareDistortionStrength = 35;
    pipeline.depthOfFieldDistance = 0.002;
    pipeline.depthOfFieldBlurWidth = 32;
    pipeline.lensFlareStength = 5;
    pipeline.motionStrength = 0.1;
    pipeline.motionBlurSamples = 32;

    // GUI
    var gui = new dat.GUI();
    gui.add(pipeline, "brightThreshold").min(0.0).max(2.0).step(0.01);
    gui.add(pipeline, "exposure").min(0.0).max(10.0).step(0.1);
    gui.add(pipeline, "blurWidth").min(0).max(512).step(0.01);
    gui.add(pipeline, "horizontalBlur");

    var lensFlare = gui.addFolder("Lens Flare");
    lensFlare.open();
    lensFlare.add(pipeline, "LensFlareEnabled");
    lensFlare.add(pipeline, "lensFlareStrength").min(0).max(50).step(0.01);
    lensFlare.add(pipeline, "lensFlareHaloWidth").min(0).max(10).step(0.01);
    lensFlare.add(pipeline, "lensFlareGhostDispersal").min(0).max(100).step(0.1);
    lensFlare.add(pipeline, "lensFlareDistortionStrength").min(0).max(100).step(0.1);

    var luminance = gui.addFolder("Luminance Adaptation");
    luminance.open();
    luminance.add(pipeline, "HDREnabled");
    luminance.add(pipeline, "hdrMinimumLuminance").min(0).max(2);
    luminance.add(pipeline, "hdrDecreaseRate").min(0).max(2);
    luminance.add(pipeline, "hdrIncreaseRate").min(0).max(2);

    var depthOfField = gui.addFolder("Depth Of Field");
    depthOfField.open();
    depthOfField.add(pipeline, "DepthOfFieldEnabled");
    depthOfField.add(pipeline, "depthOfFieldDistance").min(0).max(1).step(0.01);

    var motionBlur = gui.addFolder("Motion Blur");
    motionBlur.open();
    motionBlur.add(pipeline, "MotionBlurEnabled");
    motionBlur.add(pipeline, "motionStrength").min(0).max(10);
    motionBlur.add(pipeline, "motionBlurSamples").step(1).min(1).max(64);

    gui.width = 400;

    return scene;
};
