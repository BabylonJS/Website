// Shamefully inspired by Mr Doob's demo:http://www.mrdoob.com/lab/javascript/webgl/clouds/
"use strict";

document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    if (BABYLON.Engine.isSupported()) {
        var start_time = Date.now();

        BABYLON.Engine.ShadersRepository = "/Babylon/Shaders/";

        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, false);
        var scene = new BABYLON.Scene(engine);

        // Creating background layer using a dynamic texture with 2D canvas
        var background = new BABYLON.Layer("back0", null, scene);
        background.texture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        var textureContext = background.texture.getContext();
        var size = background.texture.getSize();

        textureContext.clearRect(0, 0, size.width, size.height);

        var gradient = textureContext.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, "#1e4877");
        gradient.addColorStop(0.5, "#4584b4");

        textureContext.fillStyle = gradient;
        textureContext.fillRect(0, 0, 512, 512);
        background.texture.update();

        var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, -128, 0), scene);
        camera.fov = 30;
        camera.minZ = 1;
        camera.maxZ = 3000;

        var cloudMaterial = new BABYLON.ShaderMaterial("cloud", scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode"
        },
        {
            needAlphaBlending: true,
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection"],
            samplers: ["textureSampler"]
        });
        cloudMaterial.setTexture("textureSampler", new BABYLON.Texture("cloud.png", scene));
        cloudMaterial.setFloat("fogNear", -100);
        cloudMaterial.setFloat("fogFar", 3000);
        cloudMaterial.setColor3("fogColor", BABYLON.Color3.FromInts(69, 132, 180));

        // Create merged planes
        size = 128;
        var count = 8000;

        var globalVertexData = new BABYLON.VertexData();

        for (var i = 0; i < count; i++) {
            var planeVertexData = BABYLON.VertexData.CreatePlane({ size: 128 });

            delete planeVertexData.normals; // We do not need normals

            // Transform
            var randomScaling = Math.random() * Math.random() * 1.5 + 0.5;
            var transformMatrix = BABYLON.Matrix.Scaling(randomScaling, randomScaling, 1.0);
            transformMatrix = transformMatrix.multiply(BABYLON.Matrix.RotationZ(Math.random() * Math.PI));
            transformMatrix = transformMatrix.multiply(BABYLON.Matrix.Translation(Math.random() * 1000 - 500, -Math.random() * Math.random() * 100, count - i));

            planeVertexData.transform(transformMatrix);

            // Merge
            globalVertexData.merge(planeVertexData);
        }

        var clouds = new BABYLON.Mesh("Clouds", scene);
        globalVertexData.applyToMesh(clouds);

        clouds.material = cloudMaterial;

        var clouds2 = clouds.clone();
        clouds2.position.z = -500;

        engine.runRenderLoop(function () {
            var cameraDepth = ((Date.now() - start_time) * 0.03) % 8000;

            camera.position.z = cameraDepth;

            scene.render();
        });
    }
};