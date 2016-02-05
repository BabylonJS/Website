/// <reference path="../../babylon.max.js"/>
/// <reference path=".dat.gui.min.js"/>

if (BABYLON.Engine.isSupported()) {
    var canvas = document.getElementById("renderCanvas");

    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 5, 10));
    camera.attachControl(canvas, false);

    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 500;

    var sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(50, 50, 30), scene);

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    window.addEventListener("resize", function () {
        engine.resize();
    });

    engine.runRenderLoop(function () {
        scene.render();
    });

    var options;
    
    var earthSetup = function() {
        options = {
            biomes: "earth",
            clouds: true,
            mapSize: 1024,
            upperColor: new BABYLON.Color3(2.0, 1.0, 0),
            lowerColor: new BABYLON.Color3(0, 0.2, 1.0),
            haloColor: new BABYLON.Color3(0, 0.2, 1.0),
            maxResolution: 128,
            seed: 0.30,
            cloudSeed: 0.55,
            lowerClamp: new BABYLON.Vector2(0.6, 1),
            groundAlbedo: 1.2,
            cloudAlbedo: 1.0,
            rings: false,
            ringsColor: new BABYLON.Color3(0.6, 0.6, 0.6),
            directNoise: false,
            lowerClip: new BABYLON.Vector2(0, 0),
            range: new BABYLON.Vector2(0.3, 0.35)
        };
    }

    earthSetup();

    // Random texture
    var random = new BABYLON.DynamicTexture("random", 512, scene, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    var random2 = new BABYLON.DynamicTexture("random", 512, scene, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);

    var updateRandom = function (random) {
        var context = random.getContext();

        var data = context.getImageData(0, 0, 512, 512);

        for (var i = 0; i < 512 * 512 * 4; i++) {
            data.data[i] = (Math.random() * 256) | 0;
        }

        context.putImageData(data, 0, 0);
        random.update();
    }

    // Space
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    var files = [
        "./Space/space_left.jpg",
        "./Space/space_up.jpg",
        "./Space/space_front.jpg",
        "./Space/space_right.jpg",
        "./Space/space_down.jpg",
        "./Space/space_back.jpg",
    ];
    skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(files, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Lens flares
    BABYLON.Engine.ShadersRepository = "/src/shaders/";
    var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", sun, scene);
    var flare00 = new BABYLON.LensFlare(0.1, 0, new BABYLON.Color3(1, 1, 1), "Flare3.png", lensFlareSystem);
    var flare01 = new BABYLON.LensFlare(0.4, 0.1, new BABYLON.Color3(1, 1, 1), "Flare.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.2, 0.2, new BABYLON.Color3(1, 1, 1), "Flare.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.1, 0.3, new BABYLON.Color3(1, 1, 1), "Flare3.png", lensFlareSystem);
    var flare03 = new BABYLON.LensFlare(0.3, 0.4, new BABYLON.Color3(0.5, 0.5, 1), "Flare.png", lensFlareSystem);
    var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "Flare2.png", lensFlareSystem);
    var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "Flare.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.1, 1.3, new BABYLON.Color3(1, 1, 1), "Flare.png", lensFlareSystem);
    var flare03 = new BABYLON.LensFlare(0.15, 1.4, new BABYLON.Color3(0.5, 0.5, 1.0), "Flare.png", lensFlareSystem);
    var flare04 = new BABYLON.LensFlare(0.05, 1.5, new BABYLON.Color3(1, 1, 1), "Flare3.png", lensFlareSystem);

    // Noise
    var noiseTexture;
    var cloudTexture;

    // Planet
    var planet = BABYLON.Mesh.CreateSphere("planet", 64, 30, scene);
    var planetImpostor = BABYLON.Mesh.CreateSphere("planetImpostor", 16, 28, scene);
    planetImpostor.isBlocker = true;
    planetImpostor.material = new BABYLON.StandardMaterial("impostor", scene);

    // Material
    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "./planet",
        fragment: "./planet",
    },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
            needAlphaBlending: true
        });
    shaderMaterial.setVector3("cameraPosition", camera.position);
    shaderMaterial.setVector3("lightPosition", sun.position);

    planet.material = shaderMaterial;

    // Rings
    var rings = BABYLON.Mesh.CreateGround("rings", 60, 60, 1, scene);
    rings.parent = planet;
    var ringsMaterial = new BABYLON.StandardMaterial("ringsMaterial", scene);
    ringsMaterial.diffuseTexture = new BABYLON.Texture("rings.png", scene);
    ringsMaterial.diffuseTexture.hasAlpha = true;
    ringsMaterial.backFaceCulling = false;
    rings.material = ringsMaterial;
    rings.receiveShadows = true;

    // Shadow generator
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, sun);
    shadowGenerator.getShadowMap().renderList.push(planetImpostor);
    shadowGenerator.setDarkness(0.3);
    shadowGenerator.usePoissonSampling = true;

    // Rotation
    var angle = 0;
    scene.registerBeforeRender(function () {
        var ratio = scene.getAnimationRatio()
        planet.rotation.y += 0.001 * ratio;

        shaderMaterial.setMatrix("rotation", BABYLON.Matrix.RotationY(angle));
        angle -= 0.0004 * ratio;

        shaderMaterial.setVector3("options", new BABYLON.Vector3(options.clouds, options.groundAlbedo, options.cloudAlbedo));
    });

    var engageRings = function() {
        rings.setEnabled(options.rings);
        ringsMaterial.diffuseColor = options.ringsColor;
        scene.shadowsEnabled = options.rings;
    }

    // Biome generator
    var generateBiome = function () {
        if (noiseTexture) {
            noiseTexture.dispose();
            cloudTexture.dispose();
        }

        updateRandom(random);
        updateRandom(random2);

        // Noise
        noiseTexture = new BABYLON.ProceduralTexture("noise", options.mapSize, "./noise", scene, null, true, true);
        noiseTexture.setColor3("upperColor", options.upperColor);
        noiseTexture.setColor3("lowerColor", options.lowerColor);
        noiseTexture.setFloat("mapSize", options.mapSize);
        noiseTexture.setFloat("maxResolution", options.maxResolution);
        noiseTexture.setFloat("seed", options.seed);
        noiseTexture.setVector2("lowerClamp", options.lowerClamp);
        noiseTexture.setTexture("randomSampler", random);
        noiseTexture.setVector2("range", options.range);
        noiseTexture.setVector3("options", new BABYLON.Vector3(options.directNoise ? 1.0 : 0, options.lowerClip.x, options.lowerClip.y));
        noiseTexture.refreshRate = 0;

        shaderMaterial.setTexture("textureSampler", noiseTexture);

        // Cloud
        cloudTexture = new BABYLON.ProceduralTexture("cloud", options.mapSize, "./noise", scene, null, true, true);
        cloudTexture.setTexture("randomSampler", random2);
        cloudTexture.setFloat("mapSize", options.mapSize);
        cloudTexture.setFloat("maxResolution", 256);
        cloudTexture.setFloat("seed", options.cloudSeed);
        cloudTexture.setVector3("options", new BABYLON.Vector3(1.0, 0, 1.0));
        cloudTexture.refreshRate = 0;

        shaderMaterial.setTexture("cloudSampler", cloudTexture);

        shaderMaterial.setColor3("haloColor", options.haloColor);

        engageRings();
    }

    // UI

    var gui = new dat.GUI();

    var updateUI = function() {
        // Iterate over all controllers
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    };

    gui.add(options, 'biomes', ['earth', "volcanic", "jungle", "icy", "desert", "islands", "moon"]).onFinishChange(function (biome) {
        switch (biome) {
            case "earth":
                earthSetup();
                break;
            case "volcanic":
                options.upperColor = new BABYLON.Color3(0.9, 0.45, 0.45);
                options.lowerColor = new BABYLON.Color3(1.0, 0, 0);
                options.haloColor = new BABYLON.Color3(1.0, 0, 0.3);
                options.seed = 0.30;
                options.cloudSeed = 0.60;
                options.clouds = false;
                options.lowerClamp = new BABYLON.Vector2(0, 1);
                options.maxResolution = 256;
                options.cloudAlbedo = 0;
                options.groundAlbedo = 1.0;
                options.rings = false;
                options.directNoise = false;
                options.lowerClip = new BABYLON.Vector2(0, 0);
                options.range = new BABYLON.Vector2(0.3, 0.4);
                break;
            case "jungle":
                options.upperColor = new BABYLON.Color3(0.1, 0.6, 0.4);
                options.lowerColor = new BABYLON.Color3(0, 1.0, 0.1);
                options.haloColor = new BABYLON.Color3(0.5, 1.0, 0.5);
                options.seed = 0.40;
                options.cloudSeed = 0.70;
                options.clouds = true;
                options.lowerClamp = new BABYLON.Vector2(0, 1);
                options.maxResolution = 512;
                options.cloudAlbedo = 1.0;
                options.groundAlbedo = 1.1;
                options.rings = false;
                options.directNoise = false;
                options.lowerClip = new BABYLON.Vector2(0, 0);
                options.range = new BABYLON.Vector2(0.2, 0.4);
                break;
            case "icy":
                options.upperColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                options.lowerColor = new BABYLON.Color3(0.7, 0.7, 0.9);
                options.haloColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                options.seed = 0.80;
                options.cloudSeed = 0.40;
                options.clouds = true;
                options.lowerClamp = new BABYLON.Vector2(0, 1);
                options.maxResolution = 256;
                options.cloudAlbedo = 1.0;
                options.groundAlbedo = 1.1;
                options.rings = true;
                options.ringsColor = new BABYLON.Color3(0.6, 0.6, 0.6);
                options.directNoise = false;
                options.lowerClip = new BABYLON.Vector2(0, 0);
                options.range = new BABYLON.Vector2(0.3, 0.4);
                break;
            case "desert":
                options.upperColor = new BABYLON.Color3(0.9, 0.30, 0);
                options.lowerColor = new BABYLON.Color3(1.0, 0.5, 0.1);
                options.haloColor = new BABYLON.Color3(1.0, 0.5, 0.1);
                options.seed = 0.18;
                options.cloudSeed = 0.60;
                options.clouds = false;
                options.lowerClamp = new BABYLON.Vector2(0.3, 1);
                options.maxResolution = 512;
                options.cloudAlbedo = 1.0;
                options.groundAlbedo = 1.0;
                options.rings = false;
                options.directNoise = false;
                options.lowerClip = new BABYLON.Vector2(0, 0);
                options.range = new BABYLON.Vector2(0.3, 0.4);
                break;
            case "islands":
                options.upperColor = new BABYLON.Color3(0.4, 2.0, 0.4);
                options.lowerColor = new BABYLON.Color3(0, 0.2, 2.0);
                options.haloColor = new BABYLON.Color3(0, 0.2, 2.0);
                options.seed = 0.15;
                options.cloudSeed = 0.60;
                options.clouds = true;
                options.lowerClamp = new BABYLON.Vector2(0.6, 1);
                options.maxResolution = 512;
                options.cloudAlbedo = 1.0;
                options.groundAlbedo = 1.2;
                options.rings = false;
                options.directNoise = false;
                options.lowerClip = new BABYLON.Vector2(0, 0);
                options.range = new BABYLON.Vector2(0.2, 0.3);
                break;
            case "moon":
                options.haloColor = new BABYLON.Color3(0, 0, 0);
                options.seed = 0.5;
                options.clouds = false;
                options.maxResolution = 256;
                options.groundAlbedo = 0.7;
                options.rings = false;
                options.directNoise = true;
                options.lowerClip = new BABYLON.Vector2(0.5, 0.9);
                break;
        }

        generateBiome();

        updateUI();
    });

    gui.add(options, 'maxResolution', [128, 256, 512]).onChange(function () {
        generateBiome();
    });

    gui.add(options, 'clouds').onChange(function (value) {
        options.clouds = value
    });

    gui.add(options, 'rings').onChange(function (value) {
        options.rings = value;
        engageRings();
    });

    gui.add(options, 'seed', 0.1, 1.0).onFinishChange(function () {
        generateBiome();
    });

    gui.add(options, 'cloudSeed', 0.1, 1.0).onFinishChange(function () {
        generateBiome();
    });

    generateBiome();
}
