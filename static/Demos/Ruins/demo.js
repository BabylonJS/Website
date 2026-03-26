/// <reference path="../../babylon.max.js" />

var DEMO;
(function (DEMO) {
    var DummyAnimations = function (callback) {
        this.animations = [];
        this.frame = 0;
        this.callback = callback;
        this.demoPostProcessStrength = 0;
    };

    DummyAnimations.prototype.runAnimation = function (scene) {
        var scope = this;

        // Create animation
        var animation = new BABYLON.Animation("PlayingAnimation", "frame", 12, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        animation.setKeys([{ frame: 0, value: 0 }, { frame: 5300, value: 5300 }]);

        animation.addEvent(new BABYLON.AnimationEvent(5299, function () {
            scope.callback();
        }, false));

        this.animations[0] = animation;

        // Postprocess animation
        animation = new BABYLON.Animation("PostProcessAnimation", "demoPostProcessStrength", 12, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        animation.setKeys([{ frame: 0, value: 0 }, { frame: 200, value: 1 }, { frame: 5000, value: 1 }, { frame: 5300, value: 0 }]);

        this.animations[1] = animation;

        scene.beginAnimation(this, 0, Number.MAX_VALUE, false, 2.353);
    };

    var RuinsDemo = function () {
        var divFps = document.getElementById("fps");
        var statusPerf = document.getElementById("statusPerf");
        var canvas = document.getElementById("renderCanvas");
        var button = document.getElementById("ruins-button");
        var lastFPS = 0;
        var numberOfFrames = 0;

        // Dummy animation
        var dummyAnimation = new DummyAnimations(function () {
            button.style.display = "";
            engine.stopRenderLoop(renderLoop);
        });

        var engine = new BABYLON.Engine(canvas, true, { limitDeviceRatio: 2 }, true);
        engine.enableOfflineSupport = false;
        var scene = null;
        var standardPipeline = null;

        var playing = false;

        var scope = this;

        // Functions
        window.onresize = function () {
            engine.resize();
        };

        var getParticleSystemByName = function (name) {
            for (var i = 0; i < scene.particleSystems.length; i++) {
                if (scene.particleSystems[i].name === name)
                    return scene.particleSystems[i];
            }

            return null;
        };

        var startMonitoringFPS = false;
        var currentHardwareLevel = 1;

        window.setTimeout(function () {
            startMonitoringFPS = true;
        }, 3000)

        var renderLoop = function () {
            engine.runRenderLoop(function () {
                if (startMonitoringFPS) {
                    numberOfFrames++;
                    lastFPS += engine.getFps();

                    if (numberOfFrames % 60 === 0) {
                        var averageOnWindow = lastFPS / 60;
                        numberOfFrames = 0;
                        lastFPS = 0;

                        if (averageOnWindow < 25) {
                            // Dispose standard rendering pipeline
                            standardPipeline.dispose();

                            switch (currentHardwareLevel) {
                                case 1:
                                    currentHardwareLevel = 1.5;
                                    engine.setHardwareScalingLevel(1.5);
                                    statusPerf.innerHTML = "Rendering 66%";
                                    statusPerf.style.color = "darkorange";
                                    startMonitoringFPS = false;
                                    window.setTimeout(function () {
                                        startMonitoringFPS = true;
                                    }, 3000)
                                    break;
                                case 1.5:
                                    currentHardwareLevel = 2;
                                    engine.setHardwareScalingLevel(2);
                                    statusPerf.innerHTML = "Rendering 50%";
                                    statusPerf.style.color = "darkred";
                                    startMonitoringFPS = false;
                                    window.setTimeout(function () {
                                        startMonitoringFPS = true;
                                    }, 3000);
                                    break;
                            }
                        }
                        if (averageOnWindow > 50) {
                            switch (currentHardwareLevel) {
                                case 1.5:
                                    currentHardwareLevel = 1;
                                    engine.setHardwareScalingLevel(1);
                                    statusPerf.innerHTML = "Full resolution";
                                    statusPerf.style.color = "darkgreen";
                                    startMonitoringFPS = false;
                                    window.setTimeout(function () {
                                        startMonitoringFPS = true;
                                    }, 3000)
                                    break;
                                case 2:
                                    currentHardwareLevel = 1.5;
                                    engine.setHardwareScalingLevel(1.5);
                                    statusPerf.innerHTML = "Rendering 66%";
                                    statusPerf.style.color = "darkorange";
                                    startMonitoringFPS = false;
                                    window.setTimeout(function () {
                                        startMonitoringFPS = true;
                                    }, 3000);
                                    break;
                            }
                        }
                    }
                }

                divFps.innerHTML = engine.getFps().toFixed() + " fps";
                scene.render();
            });
        };

        // Post-process
        BABYLON.Effect.ShadersStore["DemoPixelShader"] = [
            "precision highp float;",

            "varying vec2 vUV;",

            "uniform sampler2D textureSampler;",
            "uniform float strength;",

            "void main(void)",
            "{",
            "   gl_FragColor = texture2D(textureSampler, vUV) * strength;",
            "}"
        ].join("\n");

        // Demo run
        var run = function () {
            var remaining = scene.getWaitingItemsCount();

            if (remaining > 0) {
                requestAnimationFrame(run);
            }
            else {
                // Hide loading
                engine.hideLoadingUI();
                button.style.display = "";

                // On click button
                button.onclick = function (event) {
                    if (!playing) {
                        var clock = scene.getSoundByName("clock.mp3");
                        clock.stop();

                        var rain = scene.getSoundByName("rain.mp3");
                        var wind = scene.getSoundByName("wind.mp3");

                        rain.play();
                        wind.play();
                        clock.play();

                        scene.executeWhenReady(renderLoop);

                        playing = true;
                    }
                    else {
                        // Sounds
                        var clock = scene.getSoundByName("clock.mp3");
                        clock.stop();
                        clock.play();

                        // Animations
                        scene.beginAnimation(scene, 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("Spot001"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("PointLight"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("thunderstorm"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("Camera001"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("BabylonJSLogo"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("MadeWith"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("HDRPostProcess"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("Camera001.Target"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("bin_new"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("SpecialThanks"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("MusicBy"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(scene.getNodeByName("skyBox"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(getParticleSystemByName("SmokePS"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(getParticleSystemByName("RainPS"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(getParticleSystemByName("FirePS"), 0, Number.MAX_VALUE, false, 2.353);
                        scene.beginAnimation(getParticleSystemByName("StormPS"), 0, Number.MAX_VALUE, false, 2.353);
                    }

                    dummyAnimation.runAnimation(scene);

                    button.style.display = "none";
                }
            }
        };

        BABYLON.SceneLoader.Load("/Scenes/Ruins/", "ruins.babylon", engine, function (newscene) {
            scene = newscene;

            if (engine.getCaps().textureFloatRender) {
                // Post-processes
                standardPipeline = new BABYLON.StandardRenderingPipeline("standard", scene, 1.0 / devicePixelRatio, null, [scene.activeCamera]);
                standardPipeline.lensTexture = new BABYLON.Texture("/Scenes/Ruins/lensdirt.jpg", scene);

                var demoPostProcess = new BABYLON.PostProcess("DemoPostProcess", "Demo", ["strength"], [], 1.0 / devicePixelRatio, scene.activeCamera, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, "", BABYLON.Engine.TEXTURETYPE_FLOAT);
                demoPostProcess.onApply = function (effect) {
                    effect.setFloat("strength", dummyAnimation.demoPostProcessStrength);
                };
            }

            // Finish
            requestAnimationFrame(run);
        });
    };

    DEMO.RuinsDemo = RuinsDemo;
})(DEMO || (DEMO = {}));
