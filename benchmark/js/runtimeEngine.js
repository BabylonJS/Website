var BABYLON;
(function (BABYLON) {
    var RunDescription = (function () {
        function RunDescription() {
            this.fps = new Array();
            this.potentialFps = new Array();
        }
        return RunDescription;
    }());
    BABYLON.RunDescription = RunDescription;
    var RuntimeEngine = (function () {
        function RuntimeEngine(canvas) {
            this._engine = new BABYLON.Engine(canvas, true, null, false);
        }
        Object.defineProperty(RuntimeEngine.prototype, "Engine", {
            get: function () {
                return this._engine;
            },
            enumerable: true,
            configurable: true
        });
        RuntimeEngine.prototype.start = function (runs, onEnd) {
            this._execute(0, runs, onEnd);
        };
        RuntimeEngine.prototype._execute = function (index, runs, onEnd) {
            var _this = this;
            if (index >= runs.length) {
                if (onEnd) {
                    onEnd();
                }
                return;
            }
            var run = runs[index];
            BABYLON.SceneLoader.Load(run.sceneUrl, run.sceneFilename, this._engine, function (scene) {
                if (run.onLoad) {
                    run.onLoad(scene);
                }
                var renderLoop = function () {
                    _this._engine.runRenderLoop(function () {
                        scene.render();
                        run.fps.push(_this._engine.getFps());
                        run.potentialFps.push(1000.0 / scene.getLastFrameDuration());
                    });
                };
                var timeoutId = setTimeout(function () {
                    clearTimeout(timeoutId);
                    _this._engine.stopRenderLoop(renderLoop);
                    _this._execute(++index, runs, onEnd);
                }, run.duration);
                scene.executeWhenReady(renderLoop);
            });
        };
        return RuntimeEngine;
    }());
    BABYLON.RuntimeEngine = RuntimeEngine;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=runtimeEngine.js.map