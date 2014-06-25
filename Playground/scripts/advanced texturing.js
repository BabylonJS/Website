// Setup environment
var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, 50), scene);
var light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -20), scene);
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas);

// Spheres
var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 16.0, 10.0, scene);
var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 16.0, 10.0, scene);
var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 16.0, 10.0, scene);

sphere1.position.x = -20; 
sphere2.position.x = 0;
sphere3.position.x = 20;
   
// Video plane
var videoPlane = BABYLON.Mesh.CreatePlane("Screen", 50, scene);
videoPlane.position.y = 10;
videoPlane.position.z = 30;

// Mirror
var plane = BABYLON.Mesh.CreatePlane("plan", 70, scene);
plane.position.y = -10;
plane.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);

// MATERIALS
var bumpMaterial = new BABYLON.StandardMaterial("texture1", scene);
bumpMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);//Blue
bumpMaterial.bumpTexture = new BABYLON.Texture("textures/normalMap.jpg", scene);

var simpleMaterial = new BABYLON.StandardMaterial("texture2", scene);
simpleMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);//Red

var textMat = new BABYLON.StandardMaterial("texture3", scene);
textMat.diffuseTexture = new BABYLON.Texture("textures/normalMap.jpg", scene);

//Creation of a mirror material
var mirrorMaterial = new BABYLON.StandardMaterial("texture4", scene);
mirrorMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4) ;
mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, scene, true); //Create a mirror texture
mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -10.0);
mirrorMaterial.reflectionTexture.renderList = [sphere1, sphere2, sphere3, videoPlane];
mirrorMaterial.reflectionTexture.level = 0.6;//Select the level (0.0 > 1.0) of the reflection

// Multimaterial
var multimat = new BABYLON.MultiMaterial("multi", scene);
multimat.subMaterials.push(simpleMaterial);
multimat.subMaterials.push(bumpMaterial);
multimat.subMaterials.push(textMat);

sphere2.subMeshes = [];
var verticesCount = sphere2.getTotalVertices();

sphere2.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 900, sphere2));
sphere2.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 900, 900, sphere2));
sphere2.subMeshes.push(new BABYLON.SubMesh(2, 0, verticesCount, 1800, 2088, sphere2));

// Video material
var videoMat = new BABYLON.StandardMaterial("textVid", scene);
videoMat.diffuseTexture = new BABYLON.VideoTexture("video", ["textures/babylonjs.mp4", "textures/babylonjs.webm"], 256, scene, false);
videoMat.backFaceCulling = false;

//Applying materials
sphere1.material = bumpMaterial;
sphere2.material = multimat;
sphere3.material = simpleMaterial;
plane.material = mirrorMaterial;
videoPlane.material = videoMat;
