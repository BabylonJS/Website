var CreateHDRMapScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 6, Math.PI / 2.0, 200, BABYLON.Vector3.Zero(), scene);
    camera.minZ = 0.1;

    // Environment Texture
    var hdrTexture = new BABYLON.HDRCubeTexture("environment.babylon.hdr", scene);

    // Skybox
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.cameraExposure = 0.6;
    hdrSkyboxMaterial.cameraContrast = 1.6;
    hdrSkyboxMaterial.environmentIntensity = 1.2;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;

    // Create meshes
    var sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 80, 80.0, scene);

    // Create materials
    var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.environmentIntensity = 1.2;
    glass.cameraExposure = 0.6;
    glass.cameraContrast = 1.6;
    glass.microSurface = 1.0;
    glass.reflectivityColor = new BABYLON.Color3(0.25, 0.25, 0.25);
    glass.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    sphereGlass.material = glass;

    var alpha = 0;
    var animationEnabled = false;
    var animate = function () {
        alpha += 0.1;
        if (engine.getCaps().textureLOD) {
            glass.microSurface = Math.cos(alpha) * 0.4 + 0.6;
        }
        else {
            // None Texture LOD Browser support. 
            alpha += 0.04;
            glass.microSurface = Math.cos(alpha) * 0.25 + 0.75;
        }
    };

    // UI
    var canvas2d = new BABYLON.ScreenSpaceCanvas2D(scene, { id: "ScreenCanvas", cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE });
    canvas2d.backgroundFill = BABYLON.Canvas2D.GetSolidColorBrushFromHex("#40404040");
    canvas2d.backgroundRoundRadius = 10;
    var text = new BABYLON.Text2D("Start Animate blur", { marginAlignment: "h: center, v: center", fontName: "Bold 20pt Arial" });
    var buttonRect = new BABYLON.Rectangle2D({ parent: canvas2d, id: "button", marginAlignment: "v: top, h:center", margin: 50, width: 250, height: 80, fill: "#40C040FF", roundRadius: 10, children: [text] });

    buttonRect.pointerEventObservable.add(function (d, s) {
        if (!animationEnabled) {
            animationEnabled = true;
            scene.registerBeforeRender(animate);
            text.text = "Stop Animate blur";
            buttonRect.fill = BABYLON.Canvas2D.GetSolidColorBrushFromHex("#771010FF");
        }
        else {
            animationEnabled = false;
            scene.unregisterBeforeRender(animate);
            text.text = "Start Animate blur";
            buttonRect.fill = BABYLON.Canvas2D.GetSolidColorBrushFromHex("#40C040FF");
        }

    }, BABYLON.PrimitivePointerInfo.PointerUp);

    return scene;
};