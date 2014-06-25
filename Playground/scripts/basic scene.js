// Create a rotating camera
var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

// Attach it to handle user inputs (keyboard, mouse, touch)
camera.attachControl(canvas, false);

// Add a light
var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

// Create a builtin shape
var knot = BABYLON.Mesh.CreateTorusKnot("mesh", 2, 0.5, 128, 64, 2, 3, scene);

// Define a simple material
var material = new BABYLON.StandardMaterial("std", scene);
material.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);

knot.material = material;