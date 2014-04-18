"use strict";

(function () {
    document.addEventListener("DOMContentLoaded", start, false);

    var engine;
    var mesh;
    var scene;
    var shaderMaterial;
    var vertexEditor;
    var pixelEditor;

    function selectTemplate() {
        var select = document.getElementById("templates");
        var meshesSelect = document.getElementById("meshes");
        var vertexId;
        var pixelId;

        switch (select.selectedIndex) {
            case 0:
                vertexId = "basicVertex";
                pixelId = "basicPixel";
                break;
            case 1:
                vertexId = "bwVertex";
                pixelId = "bwPixel";
                break;
            case 2:
                vertexId = "cellShadingVertex";
                pixelId = "cellShadingPixel";
                break;
            case 3:
                vertexId = "phongVertex";
                pixelId = "phongPixel";
                break;
            case 4:
                vertexId = "discardVertex";
                pixelId = "discardPixel";
                break;
            case 5:
                vertexId = "waveVertex";
                pixelId = "phongPixel";
                meshesSelect.selectedIndex = 0;
                selectMesh();
                break;
            case 6:
                vertexId = "semVertex";
                pixelId = "semPixel";
                meshesSelect.selectedIndex = 2;
                selectMesh();
                break;
            case 7:
                vertexId = "cellShadingVertex";
                pixelId = "fresnelPixel";
                meshesSelect.selectedIndex = 2;
                selectMesh();
                break;
        }

        vertexEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(vertexId)));
        vertexEditor.gotoLine(0);
        pixelEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(pixelId)));
        pixelEditor.gotoLine(0);

        compile();
    };

    function selectMesh() {
        var select = document.getElementById("meshes");

        if (mesh) {
            mesh.dispose();
        }

        switch (select.selectedIndex) {
            case 0:
                // Creating sphere
                mesh = BABYLON.Mesh.CreateSphere("mesh", 16, 5, scene);
                break;
            case 1:
                // Creating Torus
                mesh = BABYLON.Mesh.CreateTorus("mesh", 5, 1, 32, scene);
                break;
            case 2:
                // Creating Torus knot
                mesh = BABYLON.Mesh.CreateTorusKnot("mesh", 2, 0.5, 128, 64, 2, 3, scene);
                break;
            case 3:
                mesh = BABYLON.Mesh.CreateGroundFromHeightMap("mesh", "heightMap.png", 8, 8, 100, 0, 3, scene, false);
                break;
        }

        mesh.material = shaderMaterial;
    };

    function start() {
        // Editors
        vertexEditor = ace.edit("vertexShaderEditor");
        vertexEditor.setTheme("ace/theme/chrome");
        vertexEditor.getSession().setMode("ace/mode/glsl");
        vertexEditor.setShowPrintMargin(false);

        pixelEditor = ace.edit("fragmentShaderEditor");
        pixelEditor.setTheme("ace/theme/chrome");
        pixelEditor.getSession().setMode("ace/mode/glsl");
        pixelEditor.setShowPrintMargin(false);

        // UI
        document.getElementById("templates").addEventListener("change", selectTemplate, false);
        document.getElementById("meshes").addEventListener("change", selectMesh, false);
        document.getElementById("compileButton").addEventListener("click", compile, false);

        // Babylon.js

        if (BABYLON.Engine.isSupported()) {
            var canvas = document.getElementById("renderCanvas");
            engine = new BABYLON.Engine(canvas, false);
            scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

            camera.attachControl(canvas, false);
            camera.lowerRadiusLimit = camera.upperRadiusLimit = 12;

            selectMesh();
            selectTemplate();

            var time = 0;
            engine.runRenderLoop(function () {
                mesh.rotation.y += 0.001;

                if (shaderMaterial) {
                    shaderMaterial.setFloat("time", time);
                    time += 0.02;

                    shaderMaterial.setVector3("cameraPosition", camera.position);
                }

                scene.render();
            });

            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
    };

    function compile() {
        // Exceptionally we do not want cache
        if (shaderMaterial) {
            shaderMaterial.dispose(true);
        }

        // Getting data from editors
        document.getElementById("vertexShaderCode").innerHTML = vertexEditor.getValue();
        document.getElementById("fragmentShaderCode").innerHTML = pixelEditor.getValue();

        // Compile
        shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode",
        },
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });

        var refTexture = new BABYLON.Texture("ref.jpg", scene);
        refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        var amigaTexture = new BABYLON.Texture("amiga.jpg", scene);

        shaderMaterial.setTexture("textureSampler", amigaTexture);
        shaderMaterial.setTexture("refSampler", refTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false;

        mesh.material = shaderMaterial;

        shaderMaterial.onCompiled = function () {
            document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Shaders compiled successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
            document.getElementById("shadersContainer").style.backgroundColor = "green";
        }
        shaderMaterial.onError = function (sender, errors) {
            document.getElementById("errorLog").innerHTML = "<span class=error>" + new Date().toLocaleTimeString() + ": " + errors + "</span><BR>" + document.getElementById("errorLog").innerHTML;
            document.getElementById("shadersContainer").style.backgroundColor = "red";
        };
    };
})();