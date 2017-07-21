/// <reference path="babylon.js" />
var scene;

document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");

    // UI
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

    var sceneLocation = "../../../Scenes/";

    // Babylon
    var engine = new BABYLON.Engine(canvas, true, null, false);

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
            } else {
                var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
                dir.normalize();
                pickResult.pickedMesh.applyImpulse(dir.scale(10), pickResult.pickedPoint);
                status.innerHTML = "";
            }
        }
    };

    var loadScene = function (name, incremental, sceneLocation, then) {
        sceneChecked = false;

        BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true;

        engine.resize();

        var dlCount = 0;
        BABYLON.SceneLoader.Load(sceneLocation + name + "/", name + incremental + ".babylon", engine, function (newScene) {
            scene = newScene;
            scene.executeWhenReady(function () {
                scene.debugLayer.show();

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

            });

        }, function (evt) {
            if (evt.lengthComputable) {
                engine.loadingUIText = "Loading, please wait..." + (evt.loaded * 100 / evt.total).toFixed() + "%";
            } else {
                dlCount = evt.loaded / (1024 * 1024);
                engine.loadingUIText = "Loading, please wait..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
            }
        });

        canvas.style.opacity = 0;
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

                if (remaining === 0) {
                    sceneChecked = true;
                }                
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

    document.getElementById("notSupported").addEventListener("click", function () {
        document.getElementById("notSupported").className = "hidden";
    });

    var hideCameraPanel = function () {
        cameraPanelIsClosed = true;
        cameraPanel.style.webkitTransform = "translateX(17em)";
        cameraPanel.style.transform = "translateX(17em)";
    };

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

    // Check support
    if (!BABYLON.Engine.isSupported()) {
        document.getElementById("notSupported").className = "";
    } else {
        if (window.location.hostname.indexOf("localhost") === -1 && !demo.forceLocal) {
            if (demo.doNotUseCDN) {
                sceneLocation = "/Scenes/";
            }
            else {
                sceneLocation = "/Scenes/";
            }
        }

        var mode = "";

        if (demo.incremental) {
            mode = ".incremental";
        } else if (demo.binary) {
            mode = ".binary";
        }

        if (demo.offline) {
            engine.enableOfflineSupport = true;
        }
        else {
            engine.enableOfflineSupport = false;
        }

        loadScene(demo.scene, mode, sceneLocation, function () {
            BABYLON.StandardMaterial.BumpTextureEnabled = true;
            if (demo.collisions !== undefined) {
                scene.collisionsEnabled = demo.collisions;
            }

            if (demo.onload) {
                demo.onload();
            }

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

            if (demo.freeze) {
                scene.freezeMaterials();
            }
        });
    };
});