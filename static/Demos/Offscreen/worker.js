importScripts("https://preview.babylonjs.com/babylon.js");
importScripts("https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js");
importScripts("index.js");

var engine;
onmessage = function(evt) {

    if (evt.data.canvas) {
        canvas = evt.data.canvas;

        engine = new BABYLON.Engine(canvas, true);
        var scene = createScene();
        
        engine.runRenderLoop(function() {
            engine.resize();
            if (scene.activeCamera) {
                scene.render();
            }
        });
    } else {
        canvas.width = evt.data.width;
        canvas.height = evt.data.height;
    }
}