var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    BABYLON.SceneLoader.ShowLoadingScreen = false;

    // create camera and lights for scene
    function initScene() {
        const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0.0, 0.06, -0.25), scene);
        camera.minZ = 0.01;
        camera.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(8), 0.0, 0.0);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        const env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/light/studio_512.env", scene);
        env512.name = "studio";
        env512.gammaSpace = false;
        env512.rotationY = BABYLON.Tools.ToRadians(275);
        scene.environmentTexture = env512;
    }

    const activeAnimations = [];
    /**
     * @param {*} target is the target object for the animation
     * @param {Object} anim is the animation object containing all animation parameters
     */
    function playAnimation(target, anim) {
        if (target !== undefined && anim !== undefined) {
            let newAnimation = new BABYLON.Animation(anim.name, anim.value, 60, anim.type, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            if (anim.easingFunction !== undefined || anim.easingFunction !== null) {
                anim.easingFunction.setEasingMode(anim.easingMode);
                newAnimation.setEasingFunction(anim.easingFunction);
            }

            // create animation
            scene.stopAnimation(target, anim.name);
            newAnimation.setKeys(anim.keys);
            scene.beginDirectAnimation(target, [newAnimation], 0, anim.keys[anim.keys.length - 1].frame, anim.looping, 1);
        }
    }

    const ui = {};
    // load material textures
    let loadTexturesAsync = async function() {
        let textures = [];

        staticTextures.morphShader = await BABYLON.NodeMaterial.ParseFromFileAsync("morphTexture", "assets/shaders/morphTextureShader.json", scene);
        staticTextures.morphTexture = staticTextures.morphShader.createProceduralTexture({ width: 2048, height: 1024 }, scene);

        return new Promise((resolve, reject) => {
            let textureUrls = [
                "assets/textures/device_blackPlastic_baseColor.jpg",
                "assets/textures/device_blackPlastic_ORM.png",
                "assets/textures/device_blackPlastic_normal.png",
                "assets/textures/device_no_clearcoat.png",
                "assets/textures/device_whitePlastic_baseColor.jpg",
                "assets/textures/device_whitePlastic_ORM.png",
                "assets/textures/device_whitePlastic_normal.png",
                "assets/textures/device_no_clearcoat.png",
                "assets/textures/device_wood_baseColor.jpg",
                "assets/textures/device_wood_ORM.png",
                "assets/textures/device_wood_normal.png",
                "assets/textures/device_wood_clearcoat.png",
                "assets/textures/device_light_emissive.png",
                "assets/textures/device_tempScreenUI_emissive.png",
                "assets/textures/ui_battery_inactive.png",
                "assets/textures/ui_calendar_active.png",
                "assets/textures/ui_calendar_inactive.png",
                "assets/textures/ui_contacts_active.png",
                "assets/textures/ui_contacts_inactive.png",
                "assets/textures/ui_music_active.png",
                "assets/textures/ui_music_inactive.png",
                "assets/textures/ui_next_inactive.png",
                "assets/textures/ui_pause_inactive.png",
                "assets/textures/ui_play_inactive.png",
                "assets/textures/ui_previous_inactive.png",
                "assets/textures/ui_wifi_inactive.png"
            ];

            for (let url of textureUrls) {
                textures.push(new BABYLON.Texture(url, scene, false, false));
            }

            whenAllReady(textures, () => resolve(textures));
        }).then(() => {
            populateTextureObjects(textures);
        });
    };

    // test if a texture is loaded
    let whenAllReady = function(textures, resolve) {
        let numRemaining = textures.length;
        if (numRemaining == 0) {
            resolve();
            return;
        }

        for (let i = 0; i < textures.length; i++) {
            let texture = textures[i];
            if (texture.isReady()) {
                if (--numRemaining === 0) {
                    resolve();
                    return;
                }
            } 
            else {
                let onLoadObservable = texture.onLoadObservable;
                if (onLoadObservable) {
                    onLoadObservable.addOnce(() => {
                        if (--numRemaining === 0) {
                            resolve();
                        }
                    });
                }
            }
        }
    };

    let retrieveTexture = function (key, channel, textures) {
        let texture, defaultClearcoat;
        for (let file of textures) {
            if (file.name.split("_")[1] === key) {
                let component = file.name.split("_")[2];
                if (component.split(".")[0] === channel) {
                    texture = file;
                    return texture;
                }
            }
            if (file.name.split("_")[1] == "no") {
                let component = file.name.split("_")[2];
                if (component.split(".")[0] === "clearcoat") {
                    defaultClearcoat = file;
                }    
            }
        }
        if (channel === "clearcoat" && texture === undefined) {
            texture = defaultClearcoat;
            return texture;
        }
    };

    // create object for textures and distribute the PBR texture sets to an array for material morphing
    const variant = {
        black: 0,
        white: 1,
        wood: 2
    };
    const variantTextures = [];
    const staticTextures = {};
    async function populateTextureObjects(textures) {
        variantTextures.push({
            baseColor: retrieveTexture("blackPlastic", "baseColor", textures),
            orm: retrieveTexture("blackPlastic", "ORM", textures),
            normal: retrieveTexture("blackPlastic", "normal", textures),
            clearcoat: retrieveTexture("blackPlastic", "clearcoat", textures)
        });
        variantTextures.push({
            baseColor: retrieveTexture("whitePlastic", "baseColor", textures),
            orm: retrieveTexture("whitePlastic", "ORM", textures),
            normal: retrieveTexture("whitePlastic", "normal", textures),
            clearcoat: retrieveTexture("whitePlastic", "clearcoat", textures)
       });
       variantTextures.push({
            baseColor: retrieveTexture("wood", "baseColor", textures),
            orm: retrieveTexture("wood", "ORM", textures),
            normal: retrieveTexture("wood", "normal", textures),
            clearcoat: retrieveTexture("wood", "clearcoat", textures)
        });
        staticTextures.emissive = retrieveTexture("light", "emissive", textures);
        staticTextures.tempUI = retrieveTexture("tempScreenUI", "emissive", textures);
        staticTextures.batteryInactive = retrieveTexture("battery", "inactive", textures);
        staticTextures.calendarActive = retrieveTexture("calendar", "active", textures);
        staticTextures.calendarInactive = retrieveTexture("calendar", "inactive", textures);
        staticTextures.contactsActive = retrieveTexture("contacts", "active", textures);
        staticTextures.contactsInactive = retrieveTexture("contacts", "inactive", textures);
        staticTextures.musicActive = retrieveTexture("music", "active", textures);
        staticTextures.musicInactive = retrieveTexture("music", "inactive", textures);
        staticTextures.nextInactive = retrieveTexture("next", "inactive", textures);
        staticTextures.pauseInactive = retrieveTexture("pause", "inactive", textures);
        staticTextures.playInactive = retrieveTexture("play", "inactive", textures);
        staticTextures.previousInactive = retrieveTexture("previous", "inactive", textures);
        staticTextures.wifiInactive = retrieveTexture("wifi", "inactive", textures);
    }

    // create, load, and build node materials for scene
    const deviceMaterials = {};
    const deviceBodyParameters = {};
    const deviceScreenParameters = {};
    BABYLON.NodeMaterial.IgnoreTexturesAtLoadTime = true;
    async function createMaterials() {
        deviceMaterials.body = new BABYLON.NodeMaterial("deviceBodyMat", scene, { emitComments: false });
        await deviceMaterials.body.loadAsync("assets/shaders/deviceBodyShader.json");
        deviceMaterials.body.build(false);

        deviceMaterials.screen = new BABYLON.NodeMaterial("deviceScreenMat", scene, { emitComments: false });
        await deviceMaterials.screen.loadAsync("assets/shaders/deviceScreenShader.json");
        deviceMaterials.screen.build(false);

        deviceMaterials.lens = new BABYLON.NodeMaterial("deviceLensMat", scene, { emitComments: false });
        await deviceMaterials.lens.loadAsync("assets/shaders/deviceLensShader.json");
        deviceMaterials.lens.build(false);

        deviceBodyParameters.currentBaseColor = deviceMaterials.body.getBlockByName("currentBaseColor");
        deviceBodyParameters.newBaseColor = deviceMaterials.body.getBlockByName("newBaseColor");
        deviceBodyParameters.currentORM = deviceMaterials.body.getBlockByName("currentORM");
        deviceBodyParameters.newORM = deviceMaterials.body.getBlockByName("newORM");        
        deviceBodyParameters.currentNormal = deviceMaterials.body.getBlockByName("currentNormal");
        deviceBodyParameters.newNormal = deviceMaterials.body.getBlockByName("newNormal");
        deviceBodyParameters.currentClearcoat = deviceMaterials.body.getBlockByName("currentClearcoat");
        deviceBodyParameters.newClearcoat = deviceMaterials.body.getBlockByName("newClearcoat");
        deviceBodyParameters.emissive = deviceMaterials.body.getBlockByName("emissiveTexture");
        deviceBodyParameters.glowMask = deviceMaterials.body.getBlockByName("glowMask");
        deviceBodyParameters.emissiveStrength = deviceMaterials.body.getBlockByName("emissiveStrength");
        deviceBodyParameters.ringLightOffset = deviceMaterials.body.getBlockByName("ringLightOffset");
        deviceBodyParameters.ringLightWipe = deviceMaterials.body.getBlockByName("wipeRange");
        deviceBodyParameters.morphX1 = staticTextures.morphShader.getBlockByName("xOffset1");
        deviceBodyParameters.morphY1 = staticTextures.morphShader.getBlockByName("yOffset1");
        deviceBodyParameters.morphX2 = staticTextures.morphShader.getBlockByName("xOffset2");
        deviceBodyParameters.morphY2 = staticTextures.morphShader.getBlockByName("yOffset2");
        deviceBodyParameters.morphScale1 = staticTextures.morphShader.getBlockByName("noiseScale1");
        deviceBodyParameters.morphScale2 = staticTextures.morphShader.getBlockByName("noiseScale2");
        deviceBodyParameters.morphTexture = deviceMaterials.body.getBlockByName("morphTexture");
        deviceBodyParameters.morphValue = deviceMaterials.body.getBlockByName("morphValue");
        deviceScreenParameters.dynamicTexture = deviceMaterials.screen.getBlockByName("dynamicTexture");
        deviceScreenParameters.alias = deviceMaterials.screen.getBlockByName("alias");
        deviceScreenParameters.radius = deviceMaterials.screen.getBlockByName("radius");
        deviceScreenParameters.uOffset = deviceMaterials.screen.getBlockByName("uOffset");
        deviceScreenParameters.vOffset = deviceMaterials.screen.getBlockByName("vOffset");
        deviceScreenParameters.bgColor = deviceMaterials.screen.getBlockByName("bgColor");
    }

    // assign textures to shaders
    const defaultVariant = 0;
    let currentVariant = defaultVariant;
    function assignTextures() {
        // deviceBodyParameters.morphTextureR.texture = deviceBodyParameters.morphTextureG.texture = deviceBodyParameters.morphTextureB.texture = staticTextures.morphTexture;
        deviceBodyParameters.morphTexture.texture = staticTextures.morphTexture;
        deviceBodyParameters.currentBaseColor.texture = variantTextures[defaultVariant].baseColor;
        deviceBodyParameters.currentORM.texture = variantTextures[defaultVariant].orm;
        deviceBodyParameters.currentNormal.texture = variantTextures[defaultVariant].normal;
        deviceBodyParameters.currentClearcoat.texture = variantTextures[defaultVariant].clearcoat;
        deviceBodyParameters.newBaseColor.texture = variantTextures[nextVariant(defaultVariant)].baseColor;
        deviceBodyParameters.newORM.texture = variantTextures[nextVariant(defaultVariant)].orm;
        deviceBodyParameters.newNormal.texture = variantTextures[nextVariant(defaultVariant)].normal;
        deviceBodyParameters.newClearcoat.texture = variantTextures[nextVariant(defaultVariant)].clearcoat;
        deviceBodyParameters.emissive.texture = staticTextures.emissive;
    }

    function nextVariant(currentVar) {
        let nextVar = currentVar + 1;
        if (nextVar >= variantTextures.length) {
            nextVar = 0;
        }
        return nextVar;
    }

    function prevVariant(currentVar) {
        let prevVar = currentVar - 1;
        if (prevVar > 0) {
            prevVar = variantTextures.length - 1;
        }
        return prevVar;
    }

    let morphScale1 = 4;
    let morphScale2 = 2;
    function morphMaterial(newVariant) {
        // reset shader textures for morph animation
        deviceBodyParameters.currentBaseColor.texture = variantTextures[currentVariant].baseColor;
        deviceBodyParameters.currentORM.texture = variantTextures[currentVariant].orm;
        deviceBodyParameters.currentNormal.texture = variantTextures[currentVariant].normal;
        deviceBodyParameters.currentClearcoat.texture = variantTextures[currentVariant].clearcoat;
        deviceBodyParameters.morphValue.value = 0.0;

        // set up next variant textures and set up morph texture
        deviceBodyParameters.newBaseColor.texture = variantTextures[newVariant].baseColor;
        deviceBodyParameters.newORM.texture = variantTextures[newVariant].orm;
        deviceBodyParameters.newNormal.texture = variantTextures[newVariant].normal;
        deviceBodyParameters.newClearcoat.texture = variantTextures[newVariant].clearcoat;
        deviceBodyParameters.morphX1.value = Math.random();
        deviceBodyParameters.morphY1.value = Math.random();
        deviceBodyParameters.morphX2.value = Math.random();
        deviceBodyParameters.morphY2.value = Math.random();
        deviceBodyParameters.morphScale1.value = morphScale1;
        deviceBodyParameters.morphScale2.value = morphScale2;

        // start morph animation
        playAnimation(deviceBodyParameters.morphValue, morphAnimation);
        currentVariant = newVariant;
    }

    let isMorphing = false;
    // let active = false;
    function animateMorph() {
        setTimeout(function(){
            if (isMorphing) {
                morphMaterial(nextVariant(currentVariant));
            }
            animateMorph();
        }, 2000);
    }

    // set up glow layer for emissive textures in node material
    var glowLayer = new BABYLON.GlowLayer("glowLayer", scene);
    function initGlowLayer() {
        glowLayer.intensity = 0.8;
        glowLayer.referenceMeshToUseItsOwnMaterial(device.body);
        glowLayer.onBeforeRenderMeshToEffect.add(() => {
            deviceBodyParameters.glowMask.value = 1.0;
        });
        glowLayer.onAfterRenderMeshToEffect.add(() => {
            deviceBodyParameters.glowMask.value = 0.0;
        });
    }

    // load meshes and dispose of embedded materials then assign node materials
    const device = {};
    const devicePivot = new BABYLON.AbstractMesh("devicePivot", scene);
    async function loadMeshes() {
        device.file = await BABYLON.SceneLoader.AppendAsync("assets/meshes/port_low.glb");
        device.body = scene.getMeshByName("portBody_low");
        device.lensGlass = scene.getMeshByName("portLensGlass_low");
        device.screen = scene.getMeshByName("touchGlass_low");
        device.root = device.body.parent;
        for(const key in device) {
            if (device[key].material != undefined) {
                device[key].material.dispose();
            }
        }
    
        // assign node materials to assets
        device.body.material = deviceMaterials.body;
        device.lensGlass.material = deviceMaterials.lens;
        device.screen.material = deviceMaterials.screen;    
    }

    // populate the trackElements array and trigger event when each header element passes the trigger position
    const trackElements = [];
    const eventAnimations = [];
    let screenHeight = engine.getRenderHeight();
    engine.onResizeObservable.add(() => {
        screenHeight = engine.getRenderHeight();
    });
    function updateElementPositions() {
        if(trackElements.length === 0) {
            eventAnimations.push({
                name: "head_1",
                motionPosition: 0.5,
                hydrationPosition: 0.4,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation1,
                        animDuration: 45
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation1,
                        animDuration: 45
                    },
                    {
                        target: device.root,
                        clip: rootRotation1,
                        animDuration: 45
                    }
                ],
                morph: variant.black,
            });
            eventAnimations.push({
                name: "head_2",
                motionPosition: 0.6,
                hydrationPosition: 0.3,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation2,
                        animDuration: 60
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation2,
                        animDuration: 60
                    },
                    {
                        target: device.root,
                        clip: rootRotation2,
                        animDuration: 60
                    }
                ],
                morph: undefined,
            });
            eventAnimations.push({
                name: "head_3",
                motionPosition: 0.6,
                hydrationPosition: 0.2,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation3,
                        animDuration: 90
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation3,
                        animDuration: 90
                    },
                    {
                        target: device.root,
                        clip: rootRotation3,
                        animDuration: 90
                    }
                ],
                morph: variant.wood,
            });
            eventAnimations.push({
                name: "head_4",
                motionPosition: 0.9,
                hydrationPosition: 0.5,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation4,
                        animDuration: 45
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation4,
                        animDuration: 45
                    },
                    {
                        target: device.root,
                        clip: rootRotation4,
                        animDuration: 45
                    },
                    {
                        target: deviceBodyParameters.ringLightWipe,
                        clip: dehydrateRingLight,
                        animDuration: dehydrateRingLight.keys[dehydrateRingLight.keys.length - 1].frame

                    }
                ],
                morph: undefined,
            });
            eventAnimations.push({
                name: "head_5",
                motionPosition: 0.8,
                hydrationPosition: 0.5,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation5,
                        animDuration: 45
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation5,
                        animDuration: 45
                    },
                    {
                        target: device.root,
                        clip: rootRotation5,
                        animDuration: 45
                    },
                    {
                        target: deviceBodyParameters.ringLightWipe,
                        clip: hydrateRingLight,
                        animDuration: hydrateRingLight.keys[hydrateRingLight.keys.length - 1].frame
                    },
                    {
                        target: deviceBodyParameters.ringLightOffset,
                        clip: spinRingLight,
                        animDuration: spinRingLight.keys[spinRingLight.keys.length - 1].frame
                    }
                ],
                morph: undefined,
            });
            eventAnimations.push({
                name: "head_6",
                motionPosition: 0.7,
                hydrationPosition: 0.2,
                animations: [
                    {
                        target: devicePivot,
                        clip: pivotTranslation6,
                        animDuration: 45
                    },
                    {
                        target: devicePivot,
                        clip: pivotRotation6,
                        animDuration: 45
                    },
                    {
                        target: device.root,
                        clip: rootRotation6,
                        animDuration: 45
                    },
                    {
                        target: deviceBodyParameters.ringLightWipe,
                        clip: dehydrateRingLight,
                        animDuration: dehydrateRingLight.keys[dehydrateRingLight.keys.length - 1].frame
                    }
                ],
                morph: undefined,
            });
            console.log("animations.length: " + eventAnimations[0].animations.length);

            let tags = document.getElementsByClassName("track");
            let index = 0;
            setTimeout(function(){             
                for (let tag of tags) {
                    let motion, hydration;
                    for (let event of eventAnimations) {
                        if (tag.id === event.name) {
                            motion = event.motionPosition;
                            hydration = event.hydrationPosition;
                        }
                    }
                    trackElements.push({
                        id: tag.id,
                        index: index,
                        motionPosition: motion,
                        hydrationPosition: hydration,
                        position: tag.getBoundingClientRect().top,
                        activeTrack: true
                    });
                    index += 1;
                }
            }, 1);
        }

        for (let tag of trackElements) {
            tag.position = document.getElementById(tag.id).getBoundingClientRect().top;
            if (tag.position < screenHeight * tag.motionPosition && tag.activeTrack === true) {
                console.log(tag.id + " is in the middle of the screen at " + tag.position + " compared to position: " + tag.motionPosition);
                for (let hotSpot of eventAnimations) {
                    if (hotSpot.name === tag.id) {
                        startEventAnimation(hotSpot.animations);
                        if (hotSpot.morph !== undefined) {
                            morphMaterial(hotSpot.morph);
                        }    
                        isMorphing = (hotSpot.name === "head_4") ? true : false;
                        console.log("ismorphing: " + isMorphing);
                    }
                }
                tag.activeTrack = false;    
            }
            else if (tag.position > screenHeight * tag.motionPosition && tag.activeTrack === false) {
                console.log(tag.id + " is in the middle of the screen at " + tag.position + " compared to position: " + tag.motionPosition);
                for (let hotSpot of eventAnimations) {
                    if (hotSpot.name === tag.id) {
                        startEventAnimation(hotSpot.animations);    
                        if (hotSpot.morph !== undefined) {
                            morphMaterial(hotSpot.morph);
                        }    
                        isMorphing = (hotSpot.name === "head_4") ? true : false;
                        console.log("ismorphing: " + isMorphing);
                    }
                }
                tag.activeTrack = true;
            }
            if (tag.position < screenHeight * tag.hydrationPosition) {
                document.getElementById(tag.id).parentElement.classList.toggle("dehydrate", true);
                document.getElementById(tag.id).parentElement.classList.toggle("hydrate", false);
            }
            else if (tag.position > screenHeight * tag.hydrationPosition) {
                document.getElementById(tag.id).parentElement.classList.toggle("dehydrate", false);
                document.getElementById(tag.id).parentElement.classList.toggle("hydrate", true);
            }
        }
    }

    const defaultDuration = 45;
    function startEventAnimation(animations) {
        for (let anim of animations) {
            let setDuration = (anim.animDuration !== undefined) ? anim.animDuration : defaultDuration; 
            if (anim.clip.name === "pivotTranslation") {
                anim.clip.keys[0].value = devicePivot.position;
            }
            if (anim.clip.name === "pivotRotation") {
                anim.clip.keys[0].value = devicePivot.rotation.x;
            }
            if (anim.clip.name === "rootRotation") {
                anim.clip.keys[0].value = device.root.rotation.y;
            }
            if (anim.clip.name === "hydrateRingLight" || anim.clip.name === "dehydrateRingLight") {
                anim.clip.keys[0].value = deviceBodyParameters.ringLightWipe.value;
            }
            anim.clip.keys[anim.clip.keys.length - 1].frame = setDuration;
            playAnimation(anim.target, anim.clip); 
        }
    }

    // initial position for device
    function initializeDevice() {
        device.root.parent = devicePivot;
        device.root.rotation = new BABYLON.Vector3(0.0, BABYLON.Tools.ToRadians(20), 0.0);
        devicePivot.position = new BABYLON.Vector3(-0.01, 0.2, -0.06);
        devicePivot.rotation.x = BABYLON.Tools.ToRadians(359);
        deviceBodyParameters.emissiveStrength.value = 1.0;
        let initAnimations = [
            {
                target: devicePivot,
                clip: pivotTranslation1,
                animDuration: 100
            },
            {
                target: devicePivot,
                clip: pivotRotation1,
                animDuration: 100
            },
            {
                target: device.root,
                clip: rootRotation1,
                animDuration: 100
            }
        ];
        document.getElementById("loader").classList.toggle("dehydrate", true);
        setTimeout(() => {
            document.getElementById("loader").classList.toggle("hide", true);
        }, 3000);

        startEventAnimation(initAnimations);
    }

    // set up animations
    let morphAnimation, pivotTranslation1, pivotRotation1, rootRotation1, pivotTranslation2, pivotRotation2, rootRotation2;
    function defineAnimations() {
        morphAnimation = {
            name: "morphAnimation",
            value: "value",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 120, value: 1}
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        hydrateRingLight = {
            name: "hydrateRingLight",
            value: "value",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: 0},
                {frame: 90, value: 1}
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEIN,
            looping: false
        };
        dehydrateRingLight = {
            name: "dehydrateRingLight",
            value: "value",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 1},
                {frame: 90, value: 0}
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEIN,
            looping: false
        };
        spinRingLight = {
            name: "spinRingLight",
            value: "value",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: 0},
                {frame: 180, value: 1},
                {frame: 420, value: -1},
                {frame: 540, value: 0}
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: true
        };
        stopRingLight = {
            name: "stopRingLight",
            value: "value",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 1},
                {frame: 60, value: 0},
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation1 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(-0.01, 0.045, -0.05)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation1 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(336)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation1 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(-30)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation2 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(-0.07, 0.03, -0.09)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation2 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(359)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation2 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(-60)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation3 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(0.07, 0.02, -0.12)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation3 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(350)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation3 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(88)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation4 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(0.0, 0.04, -0.08)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation4 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(340)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation4 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(20)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation5 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(-0.02, 0.04, -0.06)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation5 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(346)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation5 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(-45)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotTranslation6 = {
            name: "pivotTranslation",
            value: "position",
            type: BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            keys: [
                {frame: 0, value: new BABYLON.Vector3(0, 0, 0)},
                {frame: 60, value: new BABYLON.Vector3(-0.07, 0.03, -0.03)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        pivotRotation6 = {
            name: "pivotRotation",
            value: "rotation.x",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(319)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
        rootRotation6 = {
            name: "rootRotation",
            value: "rotation.y",
            type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            keys: [
                {frame: 0, value: 0},
                {frame: 60, value: BABYLON.Tools.ToRadians(-30)} 
            ],
            easingFunction: new BABYLON.SineEase(),
            easingMode: BABYLON.EasingFunction.EASINGMODE_EASEINOUT,
            looping: false
        };
    }    

    // initialize touch screen UI
    let screenUI, timeDisplay, timeDisplaySmall, dateDisplay, wifiIcon, batteryIcon, calendarBtn, contactsBtn, musicBtn, previousBtn, pauseBtn, playBtn, nextBtn;
    async function createUI() {
        deviceScreenParameters.alias.value = 0.003;
        deviceScreenParameters.bgColor.value = new BABYLON.Color3.FromHexString("#656962");
        deviceScreenParameters.vOffset.value = -1.42;

        screenUI = BABYLON.GUI.AdvancedDynamicTexture.CreateForMeshTexture(device.screen, 2048, 2048, true, false);
        screenUI.applyYInversionOnUpdate = false;
        const displayGrid = new BABYLON.GUI.Grid("displayGrid");
        displayGrid.addColumnDefinition(1);
        displayGrid.addRowDefinition(0.5);
        displayGrid.addRowDefinition(0.4);
        screenUI.addControl(displayGrid);

        const timeGrid = new BABYLON.GUI.Grid("timeGrid");
        timeGrid.addColumnDefinition(1);
        timeGrid.addRowDefinition(0.9);
        timeGrid.addRowDefinition(0.1);
        displayGrid.addControl(timeGrid, 0, 0);

        const threeIconGrid = new BABYLON.GUI.Grid("threeIconGrid");
        threeIconGrid.addColumnDefinition(1/3);
        threeIconGrid.addColumnDefinition(1/3);
        threeIconGrid.addColumnDefinition(1/3);
        threeIconGrid.addRowDefinition(1);
        displayGrid.addControl(threeIconGrid, 0, 0);        

        const twoIconGrid = new BABYLON.GUI.Grid("twoIconGrid");
        twoIconGrid.addColumnDefinition(150, true);
        twoIconGrid.addColumnDefinition(150, true);
        twoIconGrid.addRowDefinition(150, true);
        twoIconGrid.widthInPixels = 300;
        twoIconGrid.top = "160px";
        displayGrid.addControl(twoIconGrid, 0, 0);        

        wifiIcon = new BABYLON.GUI.Image("wifi", staticTextures.wifiInactive.url);
        wifiIcon.widthInPixels = 128;
        wifiIcon.heightInPixels = 128;
        twoIconGrid.addControl(wifiIcon, 0, 0);

        batteryIcon = new BABYLON.GUI.Image("battery", staticTextures.batteryInactive.url);
        batteryIcon.widthInPixels = 128;
        batteryIcon.heightInPixels = 128;
        twoIconGrid.addControl(batteryIcon, 0, 1);

        const mainMenuGrid = new BABYLON.GUI.Grid("mainMenuGrid");
        mainMenuGrid.addColumnDefinition(1/3);
        mainMenuGrid.addColumnDefinition(1/3);
        mainMenuGrid.addColumnDefinition(1/3);
        mainMenuGrid.addRowDefinition(1);
        mainMenuGrid.widthInPixels = 1200;
        displayGrid.addControl(mainMenuGrid, 1, 0);

        const calendarButton = BABYLON.GUI.Button.CreateImageOnlyButton("calendarButton", staticTextures.calendarInactive.url);
        calendarButton.widthInPixels = 256;
        calendarButton.heightInPixels = 256;
        calendarButton.thickness = 0;
        calendarButton.top = "180px";
        calendarButton.verticalAlignment = BABYLON.GUI.VERTICAL_ALIGNMENT_TOP;
        mainMenuGrid.addControl(calendarButton, 0, 0);
    
        const contactsButton = BABYLON.GUI.Button.CreateImageOnlyButton("contactsButton", staticTextures.contactsInactive.url);
        contactsButton.widthInPixels = 256;
        contactsButton.heightInPixels = 256;
        contactsButton.thickness = 0;
        contactsButton.top = "120px";
        contactsButton.verticalAlignment = BABYLON.GUI.VERTICAL_ALIGNMENT_TOP;
        mainMenuGrid.addControl(contactsButton, 0, 1);

        const musicButton = BABYLON.GUI.Button.CreateImageOnlyButton("musicButton", staticTextures.musicInactive.url);
        musicButton.widthInPixels = 256;
        musicButton.heightInPixels = 256;
        musicButton.thickness = 0;
        musicButton.top = "180px";
        musicButton.verticalAlignment = BABYLON.GUI.VERTICAL_ALIGNMENT_TOP;
        mainMenuGrid.addControl(musicButton, 0, 2);

        timeDisplay = new BABYLON.GUI.TextBlock("time", "");
        timeDisplay.color = "white";
        timeDisplay.fontSize = 600;
        timeDisplay.fontFamily = "noto-sans-condensed";
        timeDisplay.fontWeight = 200;
        timeDisplay.top = 100;
        timeDisplay.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        timeDisplay.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        timeGrid.addControl(timeDisplay, 0, 0);

        dateDisplay = new BABYLON.GUI.TextBlock("date", "");
        dateDisplay.color = "white";
        dateDisplay.fontSize = 80;
        dateDisplay.fontFamily = "noto-sans-condensed";
        dateDisplay.fontWeight = 400;
        dateDisplay.top = -20;
        timeDisplay.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        timeGrid.addControl(dateDisplay, 1, 0);
        deviceScreenParameters.dynamicTexture.texture = screenUI;   
        // deviceScreenParameters.dynamicTexture.texture = staticTextures.tempUI;   
    }

    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function updateDateTime() {
       let rawDate = new Date();
       let hour = rawDate.getHours();
       let minute = rawDate.getMinutes();
       let update = (60 - rawDate.getSeconds()) * 1000;
       let civTimeHour = (hour === 0) ? hour + 12 : hour;
       civTimeHour = (civTimeHour > 12) ? civTimeHour -12 : civTimeHour;
       let twoDigitMinutes = (minute < 10) ? "0" + minute : minute;

       timeDisplay.text = civTimeHour + ":" + twoDigitMinutes;
       dateDisplay.text = day[rawDate.getDay()] + ", " + rawDate.getDate() + " " + month[rawDate.getMonth()] + " " + rawDate.getFullYear();
       setTimeout(() => {
           updateDateTime();
       }, update);
    }

    initScene();
    defineAnimations();
    await loadTexturesAsync();
    await createMaterials();
    assignTextures();
    await loadMeshes();
    await createUI();
    updateDateTime();
    initGlowLayer();
    initializeDevice();
    animateMorph();

    // show inspector
    inspectorActive = false;
    function displayInspector() {
        if (event.keyCode === 78) { // n key to open inspector
            if (inspectorActive) {
                scene.debugLayer.hide();
                inspectorActive = false;
            } else {
                scene.debugLayer.show({embedMode: true});
                inspectorActive = true;
            }    
        }
        if (event.keyCode === 67) { // c for temp morph
            morphMaterial(nextVariant(currentVariant));
        }
    }

    const scrollTarget = document.getElementById("htmlLayer");
    function scrollReroute(deltaY) {
        scrollTarget.scrollTop += deltaY;
    }

    document.addEventListener("wheel", event => scrollReroute(event.deltaY));
    document.getElementById("htmlLayer").addEventListener("scroll", updateElementPositions);

    // add listener for key press
    document.addEventListener('keydown', displayInspector);

    // remove listeners when scene disposed
    scene.onDisposeObservable.add(function() {
        canvas.removeEventListener('keydown', displayInspector);
    });

    return scene;
};