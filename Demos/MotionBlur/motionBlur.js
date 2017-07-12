var CreateMotionBlurtScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.minZ = 0.1;

    // Light
    new BABYLON.PointLight("point", new BABYLON.Vector3(0, 40, 0), scene);

    // Environment Texture
    var hdrTexture = new BABYLON.HDRCubeTexture("/assets/room.hdr", scene, 512);

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
    var sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 48, 30.0, scene);
    sphereGlass.translate(new BABYLON.Vector3(1, 0, 0), -60);

    var sphereMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 30.0, scene);
    sphereMetal.translate(new BABYLON.Vector3(1, 0, 0), 60);

    var spherePlastic = BABYLON.Mesh.CreateSphere("spherePlastic", 48, 30.0, scene);
    spherePlastic.translate(new BABYLON.Vector3(0, 0, 1), -60);

    var woodPlank = BABYLON.MeshBuilder.CreateBox("plane", { width: 65, height: 1, depth: 65 }, scene);

    // Create materials
    var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.directIntensity = 0.0;
    glass.environmentIntensity = 0.5;
    glass.cameraExposure = 0.5;
    glass.cameraContrast = 1.7;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    sphereGlass.material = glass;

    var metal = new BABYLON.PBRMaterial("metal", scene);
    metal.reflectionTexture = hdrTexture;
    metal.directIntensity = 0.3;
    metal.environmentIntensity = 0.7;
    metal.cameraExposure = 0.55;
    metal.cameraContrast = 1.6;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    metal.albedoColor = new BABYLON.Color3(1, 1, 1);
    sphereMetal.material = metal;

    var plastic = new BABYLON.PBRMaterial("plastic", scene);
    plastic.reflectionTexture = hdrTexture;
    plastic.directIntensity = 0.6;
    plastic.environmentIntensity = 0.7;
    plastic.cameraExposure = 0.6;
    plastic.cameraContrast = 1.6;
    plastic.microSurface = 0.96;
    plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
    plastic.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    spherePlastic.material = plastic;

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
    pipeline.MotionBlurEnabled = true;
    pipeline.motionStrength = 0.2;
    pipeline.motionBlurSamples = 32;

    // Finish
    return scene;
};