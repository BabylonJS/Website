/* ==========================================================================
   Main JS
   ========================================================================== */

var createHTML = function () {
    // Demos
    var demos = [
        { title: "ACTION BUILDER", scene: "ActionBuilder", screenshot: "absmall.jpg", size: "6 MB", author: "Michel Rousseau", anchor: "AB" },
        { title: "MOLVWR", url: "http://gleborgne.github.io/molvwr/#1GCN", screenshot: "molecule.jpg", author: "Guillaume Leborgne", anchor: "MOLVWR", github: "https://github.com/gleborgne/molvwr" },
        { title: "CZECH STARTUPS", url: "http://czechstartups.org/#3Dmap", screenshot: "czech.jpg", author: "EPK Technologies" },
        { title: "DOLBY EXPERIMENT", url: "http://audioexperience.dolby.com/", screenshot: "dolby.jpg", author: "DOLBY AUDIO" },
        { title: "MANSION", scene: "Mansion", big: false, screenshot: "Mansion400.jpg", size: "75 MB", author: "Michel Rousseau", incremental: false, doNotUseCDN: false, anchor: "MANSION" },
        { title: "FLIGHT ARCADE", url: "http://flightarcade.com", big: false, screenshot: "flightarcade.jpg", author: "Microsoft Edge" },
        { title: "DINO HUNT", url: "http://dinohuntcanada.history.ca", big: false, screenshot: "dino800.jpg", author: "History Channel" },
        { title: "RETAIL", scene: "Retail", screenshot: "retail.jpg", size: "3 MB", author: "Michel Rousseau", incremental: false, doNotUseCDN: false, anchor: "RETAIL" },
        {
            title: "V8 ENGINE", scene: "V8", screenshot: "v8small.jpg", size: "15 MB", author: "Michel Rousseau", incremental: false, doNotUseCDN: false, anchor: "V8",
            onload: function () {
                scene.activeCamera.minZ = 1;
                scene.lights[0].getShadowGenerator().usePoissonSampling = true;
                scene.lights[0].getShadowGenerator().bias *= 2;
            }
        },
        {
            title: "ACP", url: "http://race.assassinscreedpirates.com/", screenshot: "ACP.jpg", size: "Assassin's Creed Pirates", author: "Ubisoft"
        },
        {
            title: "HILLVALLEY", scene: "HillValley", screenshot: "hill2.jpg", size: "70 MB", author: "Camille JOLY & Michel ROUSSEAU", doNotUseCDN: false, incremental: true, onload: function () {
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
            title: "TRAIN", scene: "Train", screenshot: "train.jpg", size: "70 MB", author: "Romuald ROUHIER ", binary: true, doNotUseCDN: false, onload: function () {
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
            title: "ROBOT", url: "Scenes/Robot/index.html", screenshot: "robot.jpg", size: "8.5 MB", author: "Michel Rousseau", onload: function () {
                scene.collisionsEnabled = false;
            }
        },
        { title: "WORLDMONGER", url: "Scenes/Worldmonger/index.html", screenshot: "worldmonger.jpg", size: "8.5 MB", author: "David Catuhe" },
        {
            title: "HEART", scene: "Heart", screenshot: "heart.jpg", doNotUseCDN: false, size: "14 MB", author: "Michel Rousseau", onload: function () {
                scene.getMeshByName("Labels").setEnabled(false);
                scene.getMeshByName("lums").useVertexColors = false;
                scene.gravity.scaleInPlace(0.5);
            }
        },

        {
            title: "ESPILIT", scene: "Espilit", screenshot: "espilit.jpg", size: "50 MB", author: "Michel Rousseau", doNotUseCDN: false, binary: true, onload: function () {
                scene.autoClear = true;
                scene.createOrUpdateSelectionOctree();
                scene.getMeshByName("Sol loin").useVertexColors = false;
                scene.gravity.scaleInPlace(0.5);

                var postProcess = new BABYLON.RefractionPostProcess("Refraction", "/scenes/customs/refMap.jpg", new BABYLON.Color3(1.0, 1.0, 1.0), 0.5, 0.5, 1.0, scene.cameras[1]);
            }
        },

        { title: "WINDOWS CAFE", scene: "WCafe", screenshot: "wcafe.jpg", doNotUseCDN: false, size: "28 MB", author: "Michel Rousseau", anchor: "WCAFE" },
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
            title: "THE CAR", scene: "TheCar", screenshot: "thecar.jpg", size: "100 MB", author: "Michel Rousseau", binary: true, anchor: "THECAR", onload: function () {
                scene.getMeshByName("C-Max_Pneu_arrière_gauche").material.bumpTexture = null;
                scene.getMeshByID("b73467cc-d1b0-4b8b-a767-12a95e0e28cf").alphaIndex = 0;
            }
        },
        { title: "VIPER", scene: "Viper", screenshot: "viper.jpg", size: "18 MB" },
        { title: "SPACESHIP", scene: "Spaceship", screenshot: "spaceship.jpg", size: "1 MB" },
        {
            title: "OMEGA CRUSHER", scene: "SpaceDeK", screenshot: "omegacrusher.jpg", size: "10 MB", author: "Michel Rousseau", anchor: "OMEGA", onload: function () {
                scene.collisionsEnabled = false;
            }
        }];

    var tests = [
        { title: "POINT LIGHT SHADOW MAP", id: 38, screenshot: "pointLightShadow.jpg", size: "1 MB", anchor: "POINTLIGHTSHADOWMAP", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/pointLightShadow.js" },
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
        { title: "PROCEDURAL TEXTURES", id: 26, screenshot: "ProceduralTextures.jpg", size: "5 MB", anchor: "PROCEDURAL", github: "https://github.com/BabylonJS/Samples/blob/master/Scenes/Customs/proceduralTexture.js" },
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
        { title: "360 Panorama Viewer", url: "http://www.villa-aesculap.de/unser-haus/360-panoramen/", screenshot: "pano.jpg", author: "Mediatack" },
		{ title: "SURVIVAL", url: "http://www.castorengine.com/babylon/Survival/index.php", screenshot: "survival.jpg", author: "Dad72" },
        { title: "CHARACTER STUDY", url: "http://www.visualiser.fr/Babylon/character/default.htm", screenshot: "characterstudy.jpg", author: "Samuel Girardin" },
        {
            title: "DANCE MOVES", scene: "DanceMoves", screenshot: "mixamo.jpg", author: "MIXAMO &<BR/>Jerry Richards", anchor: "DANCEMOVES", onload: function () {

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
        { title: "SHINOBOMB", url: "http://www.pixelcodr.com/games/shinobomb/index.html", screenshot: "shinobomb.jpg", author: "Jb. Bledowski &<BR/>J. Chenard" },
        { title: "CYBROX SUPRA", url: "http://www.3dpanacea.com/automotive_showroom/cybrox.html", screenshot: "Cybrox Supra.jpg", author: "3D Panacea" },
        { title: "DESIGN THE 5", url: "http://designthe5.com", screenshot: "design5.jpg", author: "Realpie Media &<BR/>Jumpkick Studios" },
        { title: "Evasion", url: "http://www.castorengine.com/babylon/Evasion/index.html", screenshot: "evasion.jpg", author: "Dad72" },
        { title: "Wanaplan", url: "http://www.wanaplan.com/en/", screenshot: "wanaplan.jpg", author: "Wanadev" },
        { title: "DotVision Motion & Bing Maps", url: "http://live2.dotvision.com/live/virtualTour?guid=f0045a3c-6c11-4329-b881-8d8a170538fb&lang=fr&intro=true", screenshot: "myGeoLive3D.jpg", author: "Dotvision" },
        { title: "BLUE LADY", url: "http://www.3dworlds.ca/1webgl/blady/index.html", screenshot: "lady.jpg", author: "Gryff" },
        { title: "LIGHT SPEED READY", url: "http://xanmia.github.io/Light-Speed-Ready/game.html", screenshot: "Light Speed Ready.jpg", author: "Xanmia" },
        { title: "DRIFT", url: "http://www.visualiser.fr/Babylon/Drift/default.htm", screenshot: "Drift.jpg", author: "S. Girardin" },
        { title: "BING 3D MAPS", url: "http://babylonbing.azurewebsites.net/", screenshot: "bing3D.jpg", author: "A. Beaulieu" },
        { title: "CAR GAME", url: "http://babylon.azurewebsites.net", screenshot: "car.jpg", author: "G. Carlander" },
        { title: "CYCLE GAME", url: "http://tronbabylon.azurewebsites.net/", screenshot: "tron.jpg", author: "G. Carlander" },
        { title: "GALLERY", url: "http://guillaume.carlander.fr/Babylon/Gallery/", screenshot: "gallery.png", author: "G. Carlander" },
        { title: "Catalog3D", url: "http://apps.microsoft.com/windows/en-gb/app/catalog-3d-by-sokrate/43771ce3-02f0-4365-98c3-557cd8acdad2", screenshot: "sokrate3D.jpg", author: "SOKRATE" },
        { title: "PSN TELECENTRES", url: "http://psntelecentres.com/visite_virtuelle.html", screenshot: "psn.jpg", author: "SOKRATE" },
        { title: "VIRTUAL EXPO", url: "http://www.sokrate.fr/expovirtuelle/index.htm", screenshot: "expo.jpg", author: "SOKRATE" },
        { title: "3delyvisions SKYBOX TOUR", url: "http://urbanproductions.com/wingy/babylon/skyboxes/skybox_tour.htm", screenshot: "tour.jpg", author: "Wingnut" }
    ];

    // UI
    var maindemossection = document.querySelector("#maindemossection .gallery");
    var featuresdemossection = document.querySelector("#featuresdemossection .gallery");
    var thirdpartydemossection = document.querySelector("#thirdpartydemossection .gallery");

    var createItem = function (item, root) {
        var article = document.createElement("article");
        article.className = "gallery-item";
        article.setAttribute("itemscope", "");
        article.setAttribute("itemtype", "http://schema.org/CreativeWork");

        var ahref = document.createElement("a");
        ahref.className = "gallery-item-link";
        ahref.href = item.url;
        ahref.title = item.title;
        ahref.target = "blank";
        ahref.setAttribute("itemprop", "url");

        var imgScene = document.createElement("img");
        imgScene.className = "gallery-item-img";
        imgScene.src = "../Screenshots/" + item.screenshot;
        imgScene.alt = "WebGL scene for " + item.title;
        imgScene.setAttribute("itemprop", "image");

        var divItemInfos = document.createElement("div");
        divItemInfos.className = "gallery-item-infos";

        var h3Title = document.createElement("h3");
        h3Title.className = "gallery-item-title";
        h3Title.innerHTML = item.title;
        h3Title.setAttribute("itemprop", "name");

        var divItemOthers = document.createElement("div");
        divItemOthers.className = "gallery-item-others";

        if (item.size) {
            var divItemSize = document.createElement("div");
            divItemSize.className = "gallery-item-size";
            divItemSize.innerHTML = item.size;
            divItemOthers.appendChild(divItemSize);
        }

        if (item.author) {
            var divItemAuthor = document.createElement("div");
            divItemAuthor.className = "gallery-item-author";
            var spanAuthor = document.createElement("span");
            spanAuthor.setAttribute("itemprop", "author");
            spanAuthor.innerHTML = item.author;
            divItemAuthor.innerHTML = "by ";
            divItemAuthor.appendChild(spanAuthor);
            divItemOthers.appendChild(divItemAuthor);
        }

        if (item.github) {
            var ahrefGithub = document.createElement("div");
            ahrefGithub.href = item.github;
            ahrefGithub.innerHTML = "github";
            ahrefGithub.target = "blank";
            ahrefGithub.className = "gallery-item-author";
            ahrefGithub.setAttribute("itemprop", "url");
            divItemOthers.appendChild(ahrefGithub);
        }

        divItemInfos.appendChild(h3Title);
        divItemInfos.appendChild(divItemOthers);

        ahref.appendChild(imgScene);
        ahref.appendChild(divItemInfos);

        article.appendChild(ahref);
        root.appendChild(article);
    };

    // Demos
    for (var index = 0; index < demos.length; index++) {
        var demo = demos[index];
        createItem(demo, maindemossection);
    }

    // Tests
    for (index = 0; index < tests.length; index++) {
        var test = tests[index];
        createItem(test, featuresdemossection);
    }

    // 3rd party
    for (index = 0; index < thirdParties.length; index++) {
        var thirdParty = thirdParties[index];
        createItem(thirdParty, thirdpartydemossection);
    }

    //// Query string
    //var queryString = window.location.search;

    //if (queryString) {
    //    var query = queryString.replace("?", "");
    //    index = parseInt(query);

    //    if (!isNaN(index)) {
    //        if (index >= demos.length) {
    //            itemClick(tests[index - demos.length])();
    //        } else {
    //            itemClick(demos[index])();
    //        }
    //    } else {
    //        for (index = 0; index < demos.length; index++) {
    //            if (demos[index].anchor && demos[index].anchor === query || demos[index].title === query) {
    //                itemClick(demos[index])();
    //                return;
    //            }
    //        }
    //        for (index = 0; index < tests.length; index++) {
    //            if (tests[index].anchor && tests[index].anchor === query || tests[index].title === query) {
    //                itemClick(tests[index])();
    //                return;
    //            }
    //        }
    //        for (index = 0; index < thirdParties.length; index++) {
    //            if (thirdParties[index].anchor && thirdParties[index].anchor === query || thirdParties[index].title === query) {
    //                itemClick(thirdParties[index])();
    //                return;
    //            }
    //        }
    //    }

    //}

};

document.addEventListener("DOMContentLoaded", function() {
	// Extract from jQuery Easing v1.3
	jQuery.extend( jQuery.easing,{
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	});

	// Bulletproof ease scrolling function
	$("a[href^='#']").click(function(e){
		e.preventDefault();
		var anchor = this.hash;
		if(anchor === ""){ return false; }
	    // Add exceptions here
		$('body').addClass("filteredscrolling");
		$('html,body').stop().animate({ 'scrollTop': Math.ceil($(anchor).offset().top) }, 1000, 'easeInOutQuint', function () {
		    anchor == "#top" ? window.location.hash = '' : window.location.hash = anchor;
		    $('body').removeClass("filteredscrolling");
		});
	});

	createHTML();
});

