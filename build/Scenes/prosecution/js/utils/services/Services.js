var Services = (function () {
    function Services() {
    }
    Object.defineProperty(Services, "deltaTime", {
        get: function () {
            return Services._deltaTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "canvas", {
        get: function () {
            return Services._canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "scene", {
        get: function () {
            return Services._scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "engine", {
        get: function () {
            return Services._engine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "updateBroadcaster", {
        get: function () {
            return Services._updateBroadcaster;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "screensManager", {
        get: function () {
            return Services._screensManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "camera", {
        get: function () {
            return Services._camera;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "mousePosition", {
        get: function () {
            return Services._mousePosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "keyboardInput", {
        get: function () {
            return Services._keyboardInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "touchesInput", {
        get: function () {
            return Services._touchesInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Services, "loader", {
        get: function () {
            return Services._loader;
        },
        enumerable: true,
        configurable: true
    });
    Services.initialize = function (canvasId) {
        Services._canvas = document.getElementById(canvasId);
        Services._engine = new BABYLON.Engine(Services.canvas, true);
        Services._scene = new BABYLON.Scene(Services.engine);
        Services._screensManager = new UIScreensManager();
        Services._updateBroadcaster = new UpdateBroadcaster();
        Services._loader = new Loader(Services._scene);
        Services._actionManager = Services._scene.actionManager = new BABYLON.ActionManager(Services._scene);
        Services._keyboardInput = new KeyboardInput();
        Services._touchesInput = new TouchesInput();
        Services.addResizeListener();
        Services.addMouseMoveListener();
        Services.initializeSceneGameLoop();
    };
    Services.addResizeListener = function () {
        window.addEventListener("resize", function () {
            Services.engine.resize();
        });
    };
    Services.addMouseMoveListener = function () {
        window.addEventListener("mousemove", function () {
            var pickResult = Services.scene.pick(Services.scene.pointerX, Services.scene.pointerY);
            if (pickResult.hit) {
                Services.mousePosition.x = pickResult.pickedPoint.x;
                Services.mousePosition.y = pickResult.pickedPoint.z;
            }
        });
    };
    Services.setActiveCamera = function (camera) {
        if (Services.camera != null) {
            Services.camera.detachControl(Services.engine.getRenderingCanvas());
        }
        Services._camera = camera;
        Services.scene.activeCamera = camera;
        if (Services.camera != null) {
            Services.camera.attachControl(Services.engine.getRenderingCanvas());
            Services.scene.activeCamera = Services.camera;
        }
    };
    Services.initializeSceneGameLoop = function () {
        Services.scene.executeWhenReady(function () {
            var newTime;
            var previousTime = Date.now();
            Services.engine.runRenderLoop(function () {
                newTime = Date.now();
                Services._deltaTime = (newTime - previousTime) / 1000;
                previousTime = newTime;
                Services.updateBroadcaster.update();
                Services.scene.render();
            });
        });
    };
    Services._mousePosition = new BABYLON.Vector2(0, 0);
    Services._deltaTime = 0;
    return Services;
}());
//# sourceMappingURL=Services.js.map