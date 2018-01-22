/// <reference path="babylon.js" />

var canvas = document.getElementById("renderCanvas");

var sceneChecked;

var sceneLocation = "../../Scenes/";

// Babylon
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
engine.enableOfflineSupport = false;
var scene;

var loadCustomScene = function (demoConstructor, then) {
    BABYLON.SceneLoader.ShowLoadingScreen = false;
    engine.displayLoadingUI();

    setTimeout(function () {
        scene = demoConstructor(engine);

        if (scene.activeCamera) {
            scene.activeCamera.attachControl(canvas, false);
        }

        scene.executeWhenReady(function () {
            canvas.style.opacity = 1;
            engine.hideLoadingUI();
            BABYLON.SceneLoader.ShowLoadingScreen = true;
            if (then) {
                then(scene);
            }
        });
    }, 15);

    return;
};

// Render loop
var renderFunction = function () {
    // Render scene
    if (scene) {
        if (!sceneChecked) {
            var remaining = scene.getWaitingItemsCount();
            engine.loadingUIText = "Streaming items..." + (remaining ? (remaining + " remaining") : "");

            if (remaining === 0) {
                sceneChecked = true;
            }            
        }

        if (scene.activeCamera) {
            scene.render();
        }

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

// Check support
if (!BABYLON.Engine.isSupported()) {
    document.getElementById("notSupported").className = "";
} else {
    loadCustomScene(demo.constructor, demo.onload);
};