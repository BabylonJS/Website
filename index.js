/// <reference path="babylon.js" />
document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

var onload = function () {
    var canvas = document.getElementById("renderCanvas");

    var backImg = document.getElementById("back");
    backImg.style.maxWidth = window.innerWidth + "px";
    window.addEventListener("resize", function () {
        backImg.style.maxWidth = window.innerWidth + "px";
    });

    function hideAllUI() {
        var divsToHide = document.querySelectorAll("#renderZone > div");
        for (var i = 0; i < divsToHide.length; ++i) {
            if (divsToHide[i].id === "fps") continue;
            divsToHide[i].className += " hidden";
        }
    }

    function restoreAllUI() {
        var divsToHide = document.querySelectorAll("#renderZone > div");
        for (var i = 0; i < divsToHide.length; ++i) {
            if (divsToHide[i].id === "fps") continue;
            divsToHide[i].className = divsToHide[i].className.replace(" hidden", "");
        }
    }
    // Demos
    var demos = [
        { title: "ACTION BUILDER", scene: "ActionBuilder", big: true, screenshot: "ab.jpg", size: "6 MB<BR>by Michel Rousseau", anchor: "AB", forceLocal: true },
        { title: "CZECH STARTUPS", url: "http://czechstartups.org/#3Dmap", screenshot: "czech.jpg", size: "EPK Technologies" },
        { title: "DOLBY EXPERIMENT", url: "http://audioexperience.dolby.com/", screenshot: "dolby.jpg", size: "DOLBY AUDIO" },
        {
            title: "MANSION", scene: "Mansion", big: false, screenshot: "Mansion400.jpg", size: "75 MB<BR>by Michel Rousseau", incremental: false, doNotUseCDN: true, anchor: "MANSION",
            onload: function () {
                //var moon = scene.getMeshByName("Moon");

                //var vls = new BABYLON.VolumetricLightScatteringPostProcess('vls', 1.0, scene.activeCamera, moon, 65, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
                //vls.exposure = 0.15;
                //vls.weight = 0.54;
            }
        },
        {
            title: "FLIGHT ARCADE", url: "http://flightarcade.com", big: false, screenshot: "flightarcade.jpg", size: "Microsoft Edge"
        },
        {
            title: "DINO HUNT", url: "http://dinohuntcanada.history.ca", big: false, screenshot: "dino800.jpg", size: "History Channel"
        },
        {
            title: "RETAIL", scene: "Retail", screenshot: "Retail800.jpg", size: "3 MB<BR>by Michel Rousseau", incremental: false, doNotUseCDN: false, anchor: "RETAIL",
            onload: function () {
            }
        },
        {
            title: "V8 ENGINE", scene: "V8", screenshot: "V8small.jpg", size: "15 MB<BR>by Michel Rousseau", incremental: false, doNotUseCDN: true, anchor: "V8",
            onload: function () {
                scene.activeCamera.minZ = 1;
                scene.lights[0].getShadowGenerator().usePoissonSampling = true;
                scene.lights[0].getShadowGenerator().bias *= 2;
            }
        },
        {
            title: "ACP", url: "http://race.assassinscreedpirates.com/", screenshot: "ACP.jpg", size: "Assassin's Creed Pirates<BR>by Ubisoft"
        },
        {
            title: "HILLVALLEY", scene: "HillValley", screenshot: "hill2.jpg", size: "70 MB - Original by Camille JOLY<BR>Optimized by Michel ROUSSEAU", doNotUseCDN: true, incremental: true, onload: function () {
                scene.collisionsEnabled = false;
                scene.lightsEnabled = false;
                scene.activeCamera.applyGravity = true;
                scene.createOrUpdateSelectionOctree();
                for (var matIndex = 0; matIndex < scene.materials.length; matIndex++) {
                    scene.materials[matIndex].checkReadyOnEveryCall = false;
                }
            }
        },
        {
            title: "TRAIN", scene: "Train", screenshot: "train.jpg", size: "70 MB<BR>by Romuald ROUHIER ", binary: true, doNotUseCDN: true, onload: function () {
                scene.collisionsEnabled = false;
                for (var index = 0; index < scene.cameras.length; index++) {
                    scene.cameras[index].minZ = 10;
                }

                for (index = 0; index < scene.meshes.length; index++) {
                    var mesh = scene.meshes[index];

                    mesh.isBlocker = mesh.checkCollisions;
                }

                scene.activeCamera.detachControl(canvas);
                scene.activeCamera = scene.cameras[6];
                scene.activeCamera.attachControl(canvas);
                scene.getMaterialByName("terrain_eau").bumpTexture = null;

                // Postprocesses
                var bwPostProcess = new BABYLON.BlackAndWhitePostProcess("Black and White", 1.0, scene.cameras[2]);
                scene.cameras[2].name = "B&W";

                var sepiaKernelMatrix = BABYLON.Matrix.FromValues(
                    0.393, 0.349, 0.272, 0,
                    0.769, 0.686, 0.534, 0,
                    0.189, 0.168, 0.131, 0,
                    0, 0, 0, 0
                );
                var sepiaPostProcess = new BABYLON.FilterPostProcess("Sepia", sepiaKernelMatrix, 1.0, scene.cameras[3]);
                scene.cameras[3].name = "SEPIA";

                var serializationObject = BABYLON.SceneSerializer.Serialize(scene);
                var string = JSON.stringify(serializationObject);
            }
        },
        {
            title: "ROBOT", url: "Scenes/Robot/index.html", screenshot: "robot.jpg", size: "8.5 MB<BR>by Michel Rousseau", onload: function () {
                scene.collisionsEnabled = false;
            }
        },
        { title: "WORLDMONGER", url: "Scenes/Worldmonger/index.html", screenshot: "worldmonger.jpg", size: "8.5 MB" },
        {
            title: "HEART", scene: "Heart", screenshot: "heart.jpg", doNotUseCDN: false, size: "14 MB<BR>by Michel Rousseau", onload: function () {
                scene.getMeshByName("Labels").setEnabled(false);
                scene.getMeshByName("lums").useVertexColors = false;
                scene.gravity.scaleInPlace(0.5);
            }
        },

        {
            title: "ESPILIT", scene: "Espilit", screenshot: "espilit.jpg", size: "50 MB<BR>by Michel Rousseau", doNotUseCDN: false, binary: true, onload: function () {
                scene.autoClear = true;
                scene.createOrUpdateSelectionOctree();
                scene.getMeshByName("Sol loin").useVertexColors = false;
                scene.gravity.scaleInPlace(0.5);

                var postProcess = new BABYLON.RefractionPostProcess("Refraction", "/scenes/customs/refMap.jpg", new BABYLON.Color3(1.0, 1.0, 1.0), 0.5, 0.5, 1.0, scene.cameras[1]);
            }
        },

        { title: "WINDOWS CAFE", scene: "WCafe", screenshot: "wcafe.jpg", doNotUseCDN: false, size: "28 MB<BR>by Michel Rousseau", anchor: "WCAFE" },
        {
            title: "FLAT 2009",
            scene: "flat2009",
            screenshot: "flat2009.jpg",
            binary: true,
            doNotUseCDN: false,
            size: "44 MB<BR>by Michel Rousseau",
            onload: function () {
                var ecran = scene.getMeshByName("Ecran");
                ecran.material.diffuseTexture = new BABYLON.VideoTexture("video", ["Scenes/Flat2009/babylonjs.mp4", "Scenes/Flat2009/babylonjs.webm"], scene, true, true);
                scene.createOrUpdateSelectionOctree();
                scene.gravity.scaleInPlace(0.5);
            }
        },
        {
            title: "THE CAR", scene: "TheCar", screenshot: "thecar.jpg", size: "100 MB<BR>by Michel Rousseau", binary: true, anchor: "THECAR", onload: function () {
                scene.getMeshByName("C-Max_Pneu_arrière_gauche").material.bumpTexture = null;
                scene.getMeshByID("b73467cc-d1b0-4b8b-a767-12a95e0e28cf").alphaIndex = 0;
            }
        },
        { title: "VIPER", scene: "Viper", screenshot: "viper.jpg", size: "18 MB" },
        { title: "SPACESHIP", scene: "Spaceship", screenshot: "spaceship.jpg", size: "1 MB" },
        {
            title: "OMEGA CRUSHER", scene: "SpaceDeK", screenshot: "omegacrusher.jpg", size: "10 MB<BR>by Michel Rousseau", anchor: "OMEGA", onload: function () {
                scene.collisionsEnabled = false;
            }
        }];

    var tests = [
        { title: "REFLECTION PROBE", id: 37, screenshot: "reflectionProbe.jpg", size: "1 MB", anchor: "REFPROBE", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/reflectionProbe.js" },
        { title: "DEPTH OF FIELD / LENS", id: 36, screenshot: "dof.jpg", size: "30 MB", anchor: "DOF", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/dof.js" },
        { title: "SIMD.JS", url: "http://www.babylonjs.com/scenes/simd.html", screenshot: "simd.jpg", size: "60 MB", anchor: "SIMD", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/simd.html" },
        { title: "RIBBONS", id: 35, screenshot: "ribbons.jpg", size: "1 MB", anchor: "RIBBONS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/ribbons.js" },
		{ title: "DECALS", id: 34, screenshot: "decals.jpg", size: "1 MB", anchor: "DECALS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/decals.js" },
		{ title: "SOFT SHADOWS", id: 33, screenshot: "softShadows.jpg", size: "1 MB", anchor: "SOFTSHADOWS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/softShadows.js" },
		{ title: "ADVANCED SHADOWS", id: 32, screenshot: "advancedShadows.jpg", size: "1 MB", anchor: "ADVANCEDSHADOWS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/advancedShadows.js" },
		{ title: "VOLUMETRIC LIGHT SCATTERING", id: 31, screenshot: "volumetriclightscattering.jpg", size: "10 MB", anchor: "VOLUMETRICLIGHTSCATTERING", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/volumetricLightScattering.js" },
        { title: "SSAO", id: 30, screenshot: "ssao.jpg", size: "10 MB", anchor: "SSAO", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/ssao.js" },
        { title: "POLYGON MESH", id: 29, screenshot: "polygon.jpg", size: "1 MB", anchor: "POLYGON", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/polygon.js" },
        { title: "INSTANCED BONES", id: 28, screenshot: "bones2.jpg", size: "10 MB", anchor: "INSTANCEDBONES", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/bones2.js" },
        { title: "LEVEL OF DETAIL", id: 27, screenshot: "lod.jpg", size: "1 MB", anchor: "LOD", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/lod.js" },
        { title: "PROCEDURAL TEXTURES", id: 26, screenshot: "ProceduralTextures.png", size: "5 MB", anchor: "PROCEDURAL", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/proceduralTexture.js" },
        { title: "ENHANCED PARTICLES", id: 25, screenshot: "particles2.jpg", size: "1 MB", anchor: "PARTICLES2", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/particles2.js" },
        { title: "FRESNEL", id: 23, screenshot: "fresnel.jpg", size: "1 MB", anchor: "FRESNEL", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/fresnel.js" },
        { title: "CUSTOM RENDER TARGET", id: 24, screenshot: "customRenderTarget.jpg", size: "1 MB", anchor: "CUSTOMRENDERTARGET", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/customRenderTarget.js" },
        { title: "ASSETS MANAGER", url: "scenes/assets/index.html", screenshot: "assets.jpg", size: "1 MB", anchor: "ASSETS", github: "https://github.com/BabylonJS/Samples/tree/master/Scenes/Assets" },
        { title: "DISPLACEMENT MAP (CPU)", id: 22, screenshot: "displacement.jpg", size: "1 MB", anchor: "DISPLACEMENTMAP", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/displacementMap.js" },
        { title: "DRAG'N'DROP", id: 21, screenshot: "dragdrop.jpg", size: "1 MB", anchor: "DRAGNDROP", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/dragdrop.js" },
        { title: "LINES", id: 20, screenshot: "lines.jpg", size: "1 MB", anchor: "LINES", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/lines.js" },
        { title: "INSTANCES", id: 18, screenshot: "instances.jpg", size: "1 MB", anchor: "INSTANCES", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/instances.js" },
        { title: "ACTIONS", id: 17, screenshot: "actions.jpg", size: "1 MB", anchor: "ACTIONS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/actions.js" },
        { title: "PARTICLES", id: 19, screenshot: "particles.jpg", size: "1 MB", anchor: "PARTICLES", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/particles.js" },
        { title: "CREATE YOUR OWN SHADER", url: "CYOS", screenshot: "cyos.jpg", size: "1 MB", anchor: "CYOS", github: "https://github.com/BabylonJS/Samples/tree/master/CYOS" },
        { title: "VERTEXDATA", url: "Scenes/Clouds/index.html", screenshot: "clouds.jpg", size: "1 MB", anchor: "CLOUDS", github: "https://github.com/BabylonJS/Samples/tree/master/Scenes/Clouds" },
        { title: "POSTPROCESS - CONVOLUTION", id: 16, screenshot: "convolution.jpg", size: "1 MB", anchor: "PPCONVOLUTION", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/postprocessConvolution.js" },
        { title: "CONSTRUCTIVE SOLID GEOMETRIES", id: 15, screenshot: "csg.jpg", size: "1 MB", anchor: "CSG", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/csg.js" },
        { title: "CUSTOM SHADER - CELL SHADING", id: 14, screenshot: "cellshading.jpg", size: "1 MB", anchor: "CUSTOMSHADER", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/cellShading.js" },
        { title: "PHYSICS", id: 13, screenshot: "physics.jpg", size: "1.0 MB", anchor: "PHYSICS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/physics.js" },
        { title: "LENS FLARES", id: 12, screenshot: "lens.jpg", size: "1.0 MB", anchor: "LENS", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/lensFlares.js" },
        { title: "POSTPROCESS - REFRACTION", id: 11, screenshot: "postprocessRefraction.jpg", size: "1.0 MB", anchor: "PPREF", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/postprocessRefraction.js" },
        { title: "POSTPROCESS - BLOOM", id: 10, screenshot: "postprocessBloom.jpg", size: "1.0 MB", anchor: "PPBLOOM", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/postprocessBloom.js" },
        { title: "OCTREE - 8000 spheres", id: 8, screenshot: "octree.jpg", size: "0.1 MB", anchor: "OCTREE", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/octree.js" },
        { title: "BONES", id: 9, screenshot: "bones.jpg", size: "10 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/bones.js" },
        { title: "CHARTING", id: 7, screenshot: "charting.jpg", size: "0.1 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/charting.js" },
        { title: "SHADOWS", id: 6, screenshot: "shadows.jpg", size: "1.0 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/shadows.js" },
        { title: "HEIGHTMAP", id: 5, screenshot: "heightmap.jpg", size: "1.0 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/heightMap_test.js" },
        { title: "LIGHTS", id: 1, screenshot: "testlight.jpg", size: "0.1 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/lights_test.js" },
        { title: "BUMP", id: 2, screenshot: "bump.jpg", size: "0.1 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/bump_test.js" },
        { title: "FOG", id: 3, screenshot: "fog.jpg", size: "0.1 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/fog_test.js" },
        { title: "MULTIMATERIAL", id: 4, screenshot: "multimat.jpg", size: "0.1 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/multimat.js" },
        { title: "BLENDER", scene: "blender", screenshot: "blender.jpg", size: "0.2 MB", incremental: true, github: "https://github.com/BabylonJS/Samples/tree/master/Scenes/Blender" },
        { title: "SCENE #1", id: 0, screenshot: "testscene.jpg", size: "10 MB", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/test.js" }
    ];

    var thirdParties = [
        { title: "SURVIVAL", url: "http://www.castorengine.com/babylon/Survival/index.php", screenshot: "survival.jpg", size: "by Dad72" },
        { title: "CHARACTER STUDY", url: "http://www.visualiser.fr/Babylon/character/default.htm", screenshot: "characterstudy.jpg", size: "by Samuel Girardin" },
        {
            title: "DANCE MOVES", scene: "DanceMoves", screenshot: "mixamo.jpg", size: "by MIXAMO &<BR>Jerry Richards", anchor: "DANCEMOVES", onload: function () {

                var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
                groundMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
                groundMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, 0);
                groundMaterial.reflectionTexture.renderList = [scene.meshes[0], scene.meshes[1]];
                groundMaterial.reflectionTexture.level = 0.5;

                // Ground
                var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);

                groundMaterial.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

                ground.material = groundMaterial;
                ground.receiveShadows = true;

                scene.beginAnimation(scene.skeletons[0], 2, 100, true, 0.05);
            }
        },
        { title: "SHINOBOMB", url: "http://www.pixelcodr.com/games/shinobomb/index.html", screenshot: "shinobomb.jpg", size: "by Jb. Bledowski &<BR> J. Chenard" },
        { title: "CYBROX SUPRA", url: "http://www.3dpanacea.com/automotive_showroom/cybrox.html", screenshot: "Cybrox Supra.jpg", size: "3D Panacea" },
        { title: "DESIGN THE 5", url: "http://designthe5.com", screenshot: "design5.jpg", size: "Realpie Media &<BR>Jumpkick Studios" },
        { title: "Evasion", url: "http://www.castorengine.com/babylon/Evasion/index.html", screenshot: "evasion.jpg", size: "by Dad72" },
        { title: "Wanaplan", url: "http://www.wanaplan.com/en/", screenshot: "wanaplan.jpg", size: "by Wanadev" },
        { title: "DotVision Motion & Bing Maps", url: "http://live2.dotvision.com/live/virtualTour?guid=f0045a3c-6c11-4329-b881-8d8a170538fb&lang=fr&intro=true", screenshot: "myGeoLive3D.jpg", size: "by Dotvision" },
        { title: "BLUE LADY", url: "http://www.3dworlds.ca/1webgl/blady/index.html", screenshot: "lady.jpg", size: "by Gryff" },
        { title: "LIGHT SPEED READY", url: "http://xanmia.github.io/Light-Speed-Ready/game.html", screenshot: "Light Speed Ready.jpg", size: "by Xanmia" },
        { title: "DRIFT", url: "http://www.visualiser.fr/Babylon/Drift/default.htm", screenshot: "Drift.jpg", size: "by S. Girardin" },
        { title: "BING 3D MAPS", url: "http://babylonbing.azurewebsites.net/", screenshot: "bing3D.jpg", size: "by A. Beaulieu" },
        { title: "CAR GAME", url: "http://babylon.azurewebsites.net", screenshot: "car.jpg", size: "by G. Carlander" },
        { title: "CYCLE GAME", url: "http://tronbabylon.azurewebsites.net/", screenshot: "tron.jpg", size: "by G. Carlander" },
        { title: "GALLERY", url: "http://guillaume.carlander.fr/Babylon/Gallery/", screenshot: "gallery.png", size: "by G. Carlander" },
        { title: "Catalog3D", url: "http://apps.microsoft.com/windows/en-gb/app/catalog-3d-by-sokrate/43771ce3-02f0-4365-98c3-557cd8acdad2", screenshot: "sokrate3D.jpg", size: "by SOKRATE" },
        { title: "PSN TELECENTRES", url: "http://psntelecentres.com/visite_virtuelle.html", screenshot: "psn.jpg", size: "by SOKRATE" },
        { title: "VIRTUAL EXPO", url: "http://www.sokrate.fr/expovirtuelle/index.htm", screenshot: "expo.jpg", size: "by SOKRATE" },
        { title: "3delyvisions SKYBOX TOUR", url: "http://urbanproductions.com/wingy/babylon/skyboxes/skybox_tour.htm", screenshot: "tour.jpg", size: "by Wingnut" }
    ];

    // UI
    var menuPanel = document.getElementById("screen1");
    var items = document.getElementById("items");
    var testItems = document.getElementById("testItems");
    var _3rdItems = document.getElementById("3rdItems");
    var renderZone = document.getElementById("renderZone");
    var controlPanel = document.getElementById("controlPanel");
    var cameraPanel = document.getElementById("cameraPanel");
    var divFps = document.getElementById("fps");
    var aboutPanel = document.getElementById("aboutPanel");
    var enableDebug = document.getElementById("enableDebug");
    var status = document.getElementById("status");
    var fullscreen = document.getElementById("fullscreen");
    var touchCamera = document.getElementById("touchCamera");
    var deviceOrientationCamera = document.getElementById("deviceOrientationCamera");
    var gamepadCamera = document.getElementById("gamepadCamera");
    var virtualJoysticksCamera = document.getElementById("virtualJoysticksCamera");
    var anaglyphCamera = document.getElementById("anaglyphCamera");
    var camerasList = document.getElementById("camerasList");
    var toggleFsaa4 = document.getElementById("toggleFsaa4");
    var toggleFxaa = document.getElementById("toggleFxaa");
    var toggleBandW = document.getElementById("toggleBandW");
    var toggleSepia = document.getElementById("toggleSepia");

    var sceneChecked;

    var itemClick = function (demo) {
        return function () {
            var sceneLocation = "Scenes/";

            // Check support
            if (!BABYLON.Engine.isSupported()) {
                document.getElementById("notSupported").className = "";
            } else {

                restoreAllUI();

                if (window.location.hostname.indexOf("localhost") === -1 && ! demo.forceLocal) {
                    if (demo.doNotUseCDN) {
                        sceneLocation = "http://yoda.blob.core.windows.net/wwwbabylonjs/Scenes/";
                    }
                    else {
                        sceneLocation = "http://cdn.babylonjs.com/wwwbabylonjs/Scenes/";
                    }
                }

                if (demo.url) {
                    window.location = demo.url;
                    return;
                }
                var mode = "";

                if (demo.incremental) {
                    mode = ".incremental";
                } else if (demo.binary) {
                    mode = ".binary";
                }

                loadScene(demo.id !== undefined ? demo.id : demo.scene, mode, sceneLocation, function () {
                    BABYLON.StandardMaterial.BumpTextureEnabled = true;
                    if (demo.collisions !== undefined) {
                        scene.collisionsEnabled = demo.collisions;
                    }

                    if (demo.onload) {
                        demo.onload();
                    }
                });
            };
        };
    };

    var removeChildren = function (root) {
        while (root.childNodes.length) {
            root.removeChild(root.childNodes[0]);
        }
    };

    var createItem = function (item, root) {
        var span = document.createElement("span");
        var img = document.createElement("img");
        var div = document.createElement("div");
        var label2 = document.createElement("label");

        if (item.big) {
            span.className = "big-item";
            var newImg = document.createElement("img");
            var newText = document.createElement("div");
            newImg.id = "newImg";
            newImg.src = "Assets/SpotLast.png";
            newText.innerHTML = "LATEST<br>UPDATE";
            newText.id = "newText";
            span.appendChild(newImg);
            span.appendChild(newText);
        } else {
            span.className = "item";
        }

        img.className = "item-image";
        img.src = "Screenshots/" + item.screenshot;
        span.appendChild(img);

        div.className = "item-text";
        div.innerHTML = item.title;
        span.appendChild(div);

        label2.className = "item-text-right";
        label2.innerHTML = item.size;
        span.appendChild(label2);

        if (item.github) {
            var a = document.createElement("a");
            a.href = item.github;
            a.innerHTML = "github";
            a.target = "blank";
            a.className = "item-text-sub-right";
            span.appendChild(a);
        }

        img.onclick = itemClick(item);

        root.appendChild(span);
    };

    // Demos

    removeChildren(items);
    for (var index = 0; index < demos.length; index++) {
        var demo = demos[index];
        createItem(demo, items);
    }

    // Tests
    removeChildren(testItems);
    for (index = 0; index < tests.length; index++) {
        var test = tests[index];
        createItem(test, testItems);
    }

    // 3rd party
    removeChildren(_3rdItems);
    for (index = 0; index < thirdParties.length; index++) {
        var thirdParty = thirdParties[index];
        createItem(thirdParty, _3rdItems);
    }

    // Go Back
    var goBack = function () {
        if (scene) {
            scene.dispose();
            scene = null;
        }

        if (engine) {
            engine.hideLoadingUI();
        }
        menuPanel.className = "";
        renderZone.className = "movedRight";
    };

    // History
    if (window.onpopstate !== undefined) {
        window.onpopstate = function () {
            goBack();
        };
    }

    // Babylon
    var engine = new BABYLON.Engine(canvas, true);
    var scene;

    var previousPickedMesh;
    var onPointerDown = function (evt, pickResult) {
        if (!panelIsClosed) {
            panelIsClosed = true;
            controlPanel.style.webkitTransform = "translateY(100px)";
            controlPanel.style.transform = "translateY(100px)";
        }

        if (pickResult.hit) {
            if (evt.ctrlKey) {
                status.innerHTML = "Selected object: " + pickResult.pickedMesh.name + "(" + pickResult.pickedPoint.x + "," + pickResult.pickedPoint.y + "," + pickResult.pickedPoint.z + ")";

                if (previousPickedMesh) {
                    previousPickedMesh.showBoundingBox = false;
                }

                pickResult.pickedMesh.showBoundingBox = true;

                // Emit particles
                var particleSystem = new BABYLON.ParticleSystem("particles", 400, scene);
                particleSystem.particleTexture = new BABYLON.Texture("Assets/Flare.png", scene);
                particleSystem.minAngularSpeed = -0.5;
                particleSystem.maxAngularSpeed = 0.5;
                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.5;
                particleSystem.minLifeTime = 0.5;
                particleSystem.maxLifeTime = 2.0;
                particleSystem.minEmitPower = 0.5;
                particleSystem.maxEmitPower = 1.0;
                particleSystem.emitter = pickResult.pickedPoint;
                particleSystem.emitRate = 400;
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
                particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
                particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
                particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
                particleSystem.color2 = new BABYLON.Color4(0, 1, 1, 1);
                particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);
                particleSystem.disposeOnStop = true;
                particleSystem.targetStopDuration = 0.1;
                particleSystem.start();

                previousPickedMesh = pickResult.pickedMesh;

            } else {
                var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
                dir.normalize();
                pickResult.pickedMesh.applyImpulse(dir.scale(10), pickResult.pickedPoint);
                status.innerHTML = "";
            }
        }
    };

    var restoreUI = function () {
        scene.onPointerDown = onPointerDown;

        sceneChecked = true;
        controlPanel.className = "";
        cameraPanel.className = "";
        divFps.className = "";

        camerasList.options.length = 0;

        for (var index = 0; index < scene.cameras.length; index++) {
            var camera = scene.cameras[index];
            var option = new Option();
            option.text = camera.name;
            option.value = camera;

            if (camera === scene.activeCamera) {
                option.selected = true;
            }

            camerasList.appendChild(option);
        }
    };

    var loadScene = function (name, incremental, sceneLocation, then) {
        sceneChecked = false;

        BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true;

        // History
        if (history.pushState) {
            history.pushState({}, name, window.location.pathname + window.location.search);
        }

        // Loading
        var importScene = function () {
            renderZone.removeEventListener("transitionend", importScene);

            // Cleaning
            if (scene) {
                scene.dispose();
                scene = null;
            }

            engine.resize();

            if (typeof name == "number") {
                var newScene;

                BABYLON.SceneLoader.ShowLoadingScreen = false;
                engine.displayLoadingUI();

                setTimeout(function () {
                    switch (name) {
                        case 0:
                            newScene = CreateTestScene(engine);
                            break;
                        case 1:
                            newScene = CreateLightsTestScene(engine);
                            break;
                        case 2:
                            newScene = CreateBumpScene(engine);
                            break;
                        case 3:
                            newScene = CreateFogScene(engine);
                            break;
                        case 4:
                            newScene = CreateMultiMaterialScene(engine);
                            break;
                        case 5:
                            newScene = CreateHeightMapTestScene(engine);
                            break;
                        case 6:
                            newScene = CreateShadowsTestScene(engine);
                            break;
                        case 7:
                            newScene = CreateChartingTestScene(engine);
                            break;
                        case 8:
                            newScene = CreateOctreeTestScene(engine);
                            break;
                        case 9:
                            newScene = CreateBonesTestScene(engine);
                            break;
                        case 10:
                            newScene = CreatePostProcessBloomTestScene(engine);
                            break;
                        case 11:
                            newScene = CreatePostProcessRefractionTestScene(engine);
                            break;
                        case 12:
                            newScene = CreateLensFlaresTestScene(engine);
                            break;
                        case 13:
                            newScene = CreatePhysicsScene(engine);
                            break;
                        case 14:
                            newScene = CreateCellShadingScene(engine);
                            break;
                        case 15:
                            newScene = CreateCSGTestScene(engine);
                            break;
                        case 16:
                            newScene = CreateConvolutionTestScene(engine);
                            break;
                        case 17:
                            newScene = CreateActionsTestScene(engine);
                            break;
                        case 18:
                            newScene = CreateInstancesTestScene(engine);
                            break;
                        case 19:
                            newScene = CreateParticlesTestScene(engine);
                            break;
                        case 20:
                            newScene = CreateLinesTestScene(engine);
                            break;
                        case 21:
                            newScene = CreateDragDropTestScene(engine);
                            break;
                        case 22:
                            newScene = CreateDisplacementTestScene(engine);
                            break;
                        case 23:
                            newScene = CreateFresnelTestScene(engine);
                            break;
                        case 24:
                            newScene = CreateCustomRenderTargetTestScene(engine);
                            break;
                        case 25:
                            newScene = CreateParticles2TestScene(engine);
                            break;
                        case 26:
                            newScene = CreateProceduralTextureTestScene(engine);
                            break;
                        case 27:
                            newScene = CreateLODTestScene(engine);
                            break;
                        case 28:
                            newScene = CreateBones2TestScene(engine);
                            break;
                        case 29:
                            newScene = CreatePolygonScene(engine);
                            break;
                        case 30:
                            newScene = CreateSSAOScene(engine);
                            break;
                        case 31:
                            newScene = CreateVolumetricLightScatteringScene(engine);
                            break;
                        case 32:
                            newScene = CreateAdvancedShadowsTestScene(engine);
                            break;
                        case 33:
                            newScene = CreateSoftShadowsTestScene(engine);
                            break;
                        case 34:
                            newScene = CreateDecalsTestScene(engine);
                            break;
                        case 35:
                            newScene = CreateRibbonsTestScene(engine);
                            break;
                        case 36:
                            newScene = CreateDOFTestScene(engine);
                            break;
                        case 37:
                            newScene = CreateReflectionProbeTestScene(engine);
                            break;
                    }
                    scene = newScene;
                    scene.executeWhenReady(function () {
                        canvas.style.opacity = 1;
                        engine.hideLoadingUI();
                        BABYLON.SceneLoader.ShowLoadingScreen = true;
                        if (scene.activeCamera) {
                            scene.activeCamera.attachControl(canvas);
                            if (then) {
                                then();
                            }
                        }

                        // UI
                        restoreUI();
                    });
                }, 15);

                return;
            };

            var dlCount = 0;
            BABYLON.SceneLoader.Load(sceneLocation + name + "/", name + incremental + ".babylon", engine, function (newScene) {
                scene = newScene;
                scene.executeWhenReady(function () {
                    canvas.style.opacity = 1;
                    if (scene.activeCamera) {
                        scene.activeCamera.attachControl(canvas);

                        if (newScene.activeCamera.keysUp) {
                            newScene.activeCamera.keysUp.push(90); // Z
                            newScene.activeCamera.keysUp.push(87); // W
                            newScene.activeCamera.keysDown.push(83); // S
                            newScene.activeCamera.keysLeft.push(65); // A
                            newScene.activeCamera.keysLeft.push(81); // Q
                            newScene.activeCamera.keysRight.push(69); // E
                            newScene.activeCamera.keysRight.push(68); // D
                        }
                    }

                    if (then) {
                        then();
                    }

                    // UI
                    restoreUI();

                });

            }, function (evt) {
                if (evt.lengthComputable) {
                    engine.loadingUIText = "Loading, please wait..." + (evt.loaded * 100 / evt.total).toFixed() + "%";
                } else {
                    dlCount = evt.loaded / (1024 * 1024);
                    engine.loadingUIText = "Loading, please wait..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
                }
            });
        };

        menuPanel.className = "movedLeft";
        renderZone.className = "";
        controlPanel.className = "hidden";
        cameraPanel.className = "hidden";
        divFps.className = "hidden";
        canvas.style.opacity = 0;

        renderZone.addEventListener("transitionend", importScene);
    };

    // Render loop
    var renderFunction = function () {
        // Fps
        divFps.innerHTML = engine.getFps().toFixed() + " fps";

        // Render scene
        if (scene) {
            if (!sceneChecked) {
                var remaining = scene.getWaitingItemsCount();
                engine.loadingUIText = "Streaming items..." + (remaining ? (remaining + " remaining") : "");
            }

            scene.render();

            // Streams
            if (scene.useDelayedTextureLoading) {
                var waiting = scene.getWaitingItemsCount();
                if (waiting > 0) {
                    status.innerHTML = "Streaming items..." + waiting + " remaining";
                } else {
                    status.innerHTML = "";
                }
            }
        }
    };

    // Launch render loop
    engine.runRenderLoop(renderFunction);

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // UI
    var panelIsClosed = true;
    var cameraPanelIsClosed = true;
    var aboutIsClosed = true;
    document.getElementById("clickableTag").addEventListener("click", function () {
        if (panelIsClosed) {
            panelIsClosed = false;
            controlPanel.style.webkitTransform = "translateY(0px)";
            controlPanel.style.transform = "translateY(0px)";
        } else {
            panelIsClosed = true;
            controlPanel.style.webkitTransform = "translateY(100px)";
            controlPanel.style.transform = "translateY(100px)";
        }
    });

    document.getElementById("cameraClickableTag").addEventListener("click", function () {
        if (cameraPanelIsClosed) {
            cameraPanelIsClosed = false;
            cameraPanel.style.webkitTransform = "translateX(0px)";
            cameraPanel.style.transform = "translateX(0px)";
        } else {
            hideCameraPanel();
        }
    });

    document.getElementById("aboutLink").addEventListener("click", function () {
        if (aboutIsClosed) {
            aboutIsClosed = false;
            aboutPanel.style.webkitTransform = "translateX(0px)";
            aboutPanel.style.transform = "translateX(0px)";
        } else {
            aboutIsClosed = true;
            aboutPanel.style.webkitTransform = "translateX(-120%)";
            aboutPanel.style.transform = "translateX(-120%)";
        }
    });

    document.getElementById("notSupported").addEventListener("click", function () {
        document.getElementById("notSupported").className = "hidden";
    });

    document.getElementById("aboutPanel").addEventListener("click", function (evt) {
        evt.cancelBubble = true;
    });

    var hideCameraPanel = function () {
        cameraPanelIsClosed = true;
        cameraPanel.style.webkitTransform = "translateX(17em)";
        cameraPanel.style.transform = "translateX(17em)";
    };

    document.getElementById("menuPanel").addEventListener("click", function () {
        if (!aboutIsClosed) {
            aboutIsClosed = true;
            aboutPanel.style.webkitTransform = "translateX(-120%)";
            aboutPanel.style.transform = "translateX(-120%)";

            hideCameraPanel();
        }
    });

    enableDebug.addEventListener("click", function () {
        if (scene) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });

    fullscreen.addEventListener("click", function () {
        if (engine) {
            engine.switchFullscreen(true);
        }
    });

    var switchCamera = function (camera) {
        if (scene.activeCamera.rotation) {
            camera.rotation = scene.activeCamera.rotation.clone();
        }
        camera.fov = scene.activeCamera.fov;
        camera.minZ = scene.activeCamera.minZ;
        camera.maxZ = scene.activeCamera.maxZ;

        if (scene.activeCamera.ellipsoid) {
            camera.ellipsoid = scene.activeCamera.ellipsoid.clone();
        }
        camera.checkCollisions = scene.activeCamera.checkCollisions;
        camera.applyGravity = scene.activeCamera.applyGravity;

        camera.speed = scene.activeCamera.speed;

        camera.postProcesses = scene.activeCamera.postProcesses;
        scene.activeCamera.postProcesses = [];
        scene.activeCamera.detachControl(canvas);
        if (scene.activeCamera.dispose) scene.activeCamera.dispose();

        scene.activeCamera = camera;

        scene.activeCamera.attachControl(canvas);

        hideCameraPanel();
    };

    touchCamera.addEventListener("click", function () {
        if (!scene) {
            return;
        }

        if (scene.activeCamera instanceof BABYLON.TouchCamera) {
            return;
        }

        var camera = new BABYLON.TouchCamera("touchCamera", scene.activeCamera.position, scene);
        switchCamera(camera);
    });

    gamepadCamera.addEventListener("click", function () {
        if (!scene) {
            return;
        }

        if (scene.activeCamera instanceof BABYLON.GamepadCamera) {
            return;
        }

        var camera = new BABYLON.GamepadCamera("gamepadCamera", scene.activeCamera.position, scene);

        switchCamera(camera);
    });

    virtualJoysticksCamera.addEventListener("click", function () {
        if (!scene) {
            return;
        }

        if (scene.activeCamera instanceof BABYLON.VirtualJoysticksCamera) {
            return;
        }

        var camera = new BABYLON.VirtualJoysticksCamera("virtualJoysticksCamera", scene.activeCamera.position, scene);

        switchCamera(camera);
    });

    anaglyphCamera.addEventListener("click", function () {
        if (!scene) {
            return;
        }

        if (scene.activeCamera instanceof BABYLON.AnaglyphArcRotateCamera) {
            return;
        }

        var camera = new BABYLON.AnaglyphFreeCamera("anaglyphCamera", scene.activeCamera.position, 0.2, scene);
        //var camera = new BABYLON.AnaglyphArcRotateCamera("anaglyphCamera", 0, Math.PI / 2, 20, BABYLON.Vector3.Zero(), 0.2, scene);

        switchCamera(camera);
    });

    deviceOrientationCamera.addEventListener("click", function () {
        if (!scene) {
            return;
        }

        if (scene.activeCamera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
            return;
        }

        var camera = new BABYLON.VRDeviceOrientationFreeCamera("deviceOrientationCamera", scene.activeCamera.position, scene);

        switchCamera(camera);
    });

    toggleBandW.addEventListener("click", function () {
        if (scene && scene.activeCamera) {
            if (scene.activeCamera.__bandw_cookie) {
                scene.activeCamera.__bandw_cookie.dispose(),
                scene.activeCamera.__bandw_cookie = null;
                toggleBandW.className = "smallButtonControlPanel";
            } else {
                scene.activeCamera.__bandw_cookie = new BABYLON.BlackAndWhitePostProcess("bandw", 1.0, scene.activeCamera);
                toggleBandW.className = "smallButtonControlPanel pushed";
            }
        }
    });

    toggleFxaa.addEventListener("click", function () {
        if (scene && scene.activeCamera) {
            if (scene.activeCamera.__fxaa_cookie) {
                scene.activeCamera.__fxaa_cookie.dispose(),
                scene.activeCamera.__fxaa_cookie = null;
                toggleFxaa.className = "smallButtonControlPanel";
            } else {
                scene.activeCamera.__fxaa_cookie = new BABYLON.FxaaPostProcess("fxaa", 1.0, scene.activeCamera);
                toggleFxaa.className = "smallButtonControlPanel pushed";
            }
        }
    });

    toggleFsaa4.addEventListener("click", function () {
        if (scene && scene.activeCamera) {
            if (scene.activeCamera.__fsaa_cookie) {
                scene.activeCamera.__fsaa_cookie.dispose(),
                scene.activeCamera.__fsaa_cookie = null;
                toggleFsaa4.className = "smallButtonControlPanel";
            } else {
                var fx = new BABYLON.PassPostProcess("fsaa", 2.0, scene.activeCamera);
                fx.renderTargetSamplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE;
                scene.activeCamera.__fsaa_cookie = fx;
                toggleFsaa4.className = "smallButtonControlPanel pushed";
            }
        }
    });

    toggleSepia.addEventListener("click", function () {
        if (scene && scene.activeCamera) {
            if (scene.activeCamera.__sepia_cookie) {
                scene.activeCamera.__sepia_cookie.dispose(),
                scene.activeCamera.__sepia_cookie = null;
                toggleSepia.className = "smallButtonControlPanel";
            } else {
                var sepiaKernelMatrix = BABYLON.Matrix.FromValues(
                    0.393, 0.349, 0.272, 0,
                    0.769, 0.686, 0.534, 0,
                    0.189, 0.168, 0.131, 0,
                    0, 0, 0, 0
                );
                scene.activeCamera.__sepia_cookie = new BABYLON.FilterPostProcess("Sepia", sepiaKernelMatrix, 1.0, scene.activeCamera);
                toggleSepia.className = "smallButtonControlPanel pushed";
            }
        }
    });


    // Cameras
    camerasList.addEventListener("change", function () {
        if (scene) {
            scene.activeCamera.detachControl(canvas);
            scene.activeCamera = scene.cameras[camerasList.selectedIndex];
            scene.activeCamera.attachControl(canvas);
        }
    });

    // Query string
    var queryString = window.location.search;

    if (queryString) {
        var query = queryString.replace("?", "");
        index = parseInt(query);

        if (!isNaN(index)) {
            if (index >= demos.length) {
                itemClick(tests[index - demos.length])();
            } else {
                itemClick(demos[index])();
            }
        } else {
            for (index = 0; index < demos.length; index++) {
                if (demos[index].anchor && demos[index].anchor === query || demos[index].title === query) {
                    itemClick(demos[index])();
                    return;
                }
            }
            for (index = 0; index < tests.length; index++) {
                if (tests[index].anchor && tests[index].anchor === query || tests[index].title === query) {
                    itemClick(tests[index])();
                    return;
                }
            }
            for (index = 0; index < thirdParties.length; index++) {
                if (thirdParties[index].anchor && thirdParties[index].anchor === query || thirdParties[index].title === query) {
                    itemClick(thirdParties[index])();
                    return;
                }
            }
        }

    }

};