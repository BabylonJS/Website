module BABYLON {
    export class RunDescription {
        public sceneFilename: string;
        public sceneUrl: string;
        public duration: number;
        public onLoad: (scene: Scene) => void;
        public fps = new Array<number>();
        public potentialFps = new Array<number>();
    }
    export class RuntimeEngine {
        _engine: Engine;

        public get Engine(): Engine {
            return this._engine;
        }

        public constructor(canvas: HTMLCanvasElement) {
            this._engine = new Engine(canvas, true, null, false);
        }

        public start(runs: Array<RunDescription>, onEnd: () => void) {
            this._execute(0, runs, onEnd);
        }

        private _execute(index: number, runs: Array<RunDescription>, onEnd: () => void) {        
            if (index >= runs.length) {
                if (onEnd) {
                    onEnd();
                }

                return;
            }

            var run = runs[index];

            SceneLoader.Load(run.sceneUrl, run.sceneFilename, this._engine, (scene) => {
                if (run.onLoad) {
                    run.onLoad(scene);
                }

                var renderLoop = () => {
                    this._engine.runRenderLoop(() => {
                        scene.render();

                        run.fps.push(this._engine.getFps());
                        run.potentialFps.push(1000.0 / scene.getLastFrameDuration());
                    });
                }
                
                var timeoutId = setTimeout(() => {
                    clearTimeout(timeoutId);
                    this._engine.stopRenderLoop(renderLoop);

                    this._execute(++index, runs, onEnd);
                }, run.duration);        

                scene.executeWhenReady(renderLoop);
            });
        }
    }
}