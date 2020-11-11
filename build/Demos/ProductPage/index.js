/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\babylon.d.ts" />
/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\gui\\babylon.gui.d.ts" />
/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\uiControls\\babylon.uiControls.module.d.ts" />
/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\serializers\\babylonjs.serializers.d.ts" />
/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\postProcessesLibrary\\babylonjs.postProcess.module.d.ts" />
/// <reference path="..\\..\\..\\Documents\\SourceControl\\GitHub\\Babylon.js\\dist\\preview release\\loaders\\babylonjs.loaders.d.ts" />
    
var deviceCanvas = async function() {
        var scene = await createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () { 
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () { 
                engine.resize();
        });    
};

var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

deviceCanvas();