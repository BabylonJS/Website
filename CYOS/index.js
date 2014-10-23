"use strict";

(function () {
    document.addEventListener("DOMContentLoaded", start, false);

    var snippetUrl = "http://babylonjs-api.azurewebsites.net/api/snippet";
    var engine;
    var meshes = [];
    var scene;
    var shaderMaterial;
    var vertexEditor;
    var pixelEditor;

    function selectTemplate() {
        var select = document.getElementById("templates");
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
                break;
            case 6:
                vertexId = "semVertex";
                pixelId = "semPixel";
                break;
            case 7:
                vertexId = "fresnelVertex";
                pixelId = "fresnelPixel";
                break;
            default:
                return;
        }

        //location.hash = undefined;

        vertexEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(vertexId)));
        vertexEditor.gotoLine(0);
        pixelEditor.setValue(BABYLON.Tools.GetDOMTextContent(document.getElementById(pixelId)));
        pixelEditor.gotoLine(0);

        compile();
    };

    function selectMesh() {
        var select = document.getElementById("meshes");

        for (var index = 0; index < meshes.length; index++) {
            var mesh = meshes[index];
            mesh.dispose();
        }
        meshes = [];

        switch (select.selectedIndex) {
            case 0:
                // Creating sphere
                meshes.push(BABYLON.Mesh.CreateSphere("mesh", 16, 5, scene));
                break;
            case 1:
                // Creating Torus
                meshes.push(BABYLON.Mesh.CreateTorus("mesh", 5, 1, 32, scene));
                break;
            case 2:
                // Creating Torus knot
                meshes.push(BABYLON.Mesh.CreateTorusKnot("mesh", 2, 0.5, 128, 64, 2, 3, scene));
                break;
            case 3:
                meshes.push(BABYLON.Mesh.CreateGroundFromHeightMap("mesh", "heightMap.png", 8, 8, 100, 0, 3, scene, false));
                break;
            case 4:
                document.getElementById("loading").className = "";
                BABYLON.SceneLoader.ImportMesh("", "", "schooner.babylon", scene, function (newMeshes) {
                    for (index = 0; index < newMeshes.length; index++) {
                        mesh = newMeshes[index];
                        mesh.material = shaderMaterial;
                        meshes.push(mesh);
                    }

                    document.getElementById("loading").className = "hidden";
                });
                return;
        }


        for (index = 0; index < meshes.length; index++) {
            mesh = meshes[index];
            mesh.material = shaderMaterial;
        }
    };

    var currentSnippetToken;
    var previousHash = "";

    var checkHash = function () {
        if (location.hash) {
            if (previousHash != location.hash) {
                cleanHash();

                previousHash = location.hash;

                try {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4) {
                            if (xmlHttp.status == 200) {
                                document.getElementById("templates").value = "";

                                var snippet = JSON.parse(xmlHttp.responseText);

                                vertexEditor.setValue(snippet.vertexShader);
                                vertexEditor.gotoLine(0);

                                pixelEditor.setValue(snippet.pixelShader);
                                pixelEditor.gotoLine(0);

                                if (snippet.meshId) {
                                    document.getElementById("meshes").selectedIndex = snippet.meshId;
                                    selectMesh();
                                }

                                compile();
                            }
                        }
                    }

                    var hash = location.hash.substr(1);
                    currentSnippetToken = hash.split("#")[0];
                    xmlHttp.open("GET", snippetUrl + "/" + hash.replace("#", "/"));
                    xmlHttp.send();
                } catch (e) {

                }
            }
        }

        setTimeout(checkHash, 200);
    }

    var cleanHash = function () {
        var splits = decodeURIComponent(location.hash.substr(1)).split("#");

        if (splits.length > 2) {
            splits.splice(2, splits.length - 2);
        }

        location.hash = splits.join("#");
    }

    function start() {
        effectiveStart();
        checkHash();
    }

    function effectiveStart() {
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

        var saveFunction = function () {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 201) {
                    var baseUrl = location.href.replace(location.hash, "").replace(location.search, "");
                    var snippet = JSON.parse(xmlHttp.responseText);
                    var newUrl = baseUrl + "#" + snippet.id;
                    currentSnippetToken = snippet.id;
                    if (snippet.version != "0") {
                        newUrl += "#" + snippet.version;
                    }
                    location.href = newUrl;
                    compile();
                }
            }

            xmlHttp.open("POST", snippetUrl + (currentSnippetToken ? "/" + currentSnippetToken : ""), true);
            xmlHttp.setRequestHeader("Content-Type", "application/json");

            var payload = {
                vertexShader: vertexEditor.getValue(),
                pixelShader: pixelEditor.getValue(),
                meshId: document.getElementById("meshes").selectedIndex
            };

            xmlHttp.send(JSON.stringify(payload));
        }

        // Save button
        document.getElementById("saveButton").addEventListener("click", function () {
            saveFunction();
        });

        // Get zip
        var addContentToZip = function (zip, name, url, replace, buffer, then) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);

            if (buffer) {
                xhr.responseType = "arraybuffer";
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var text;
                        if (!buffer) {
                            if (replace) {
                                text = xhr.responseText.replace("####INJECT####", replace);
                            } else {
                                text = xhr.responseText;
                            }
                        }

                        zip.file(name, buffer ? xhr.response : text);

                        then();
                    } else { // Failed
                    }
                }
            };

            xhr.send(null);
        }

        var stringifyShader = function (name, data) {
            var text = "                BABYLON.Effect.ShadersStore[\"" + name + "\"]=";

            var splits = data.split("\n");
            for (var index = 0; index < splits.length; index++) {

                if (splits[index] !== "") {
                    text += "                \"" + splits[index] + "\\r\\n\"";

                    if (index != splits.length - 1) {
                        text += "+\r\n";
                    } else {
                        text += ";\r\n";
                    }
                } else {
                    text += "\r\n";
                }
            }

            return text;
        }

        var getZip = function () {
            if (engine.scenes.length == 0) {
                return;
            }

            var zip = new JSZip();

            var scene = engine.scenes[0];

            var textures = scene.textures;

            document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Creating archive...Please wait</span><BR>" + document.getElementById("errorLog").innerHTML;

            var zipCode = stringifyShader("customVertexShader", vertexEditor.getValue());

            zipCode += "\r\n" + stringifyShader("customFragmentShader", pixelEditor.getValue()) + "\r\n";
            zipCode += "                selectMesh(" + document.getElementById("meshes").selectedIndex + ");\r\n"

            addContentToZip(zip, "index.html", "zipContent/index.html", zipCode, false, function () {
                addContentToZip(zip, "ref.jpg", "ref.jpg", null, true, function () {
                    addContentToZip(zip, "heightMap.png", "heightMap.png", null, true, function () {
                        addContentToZip(zip, "amiga.jpg", "amiga.jpg", null, true, function () {
                            var blob = zip.generate({ type: "blob" });
                            saveAs(blob, "sample.zip");
                            document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Archive created successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
                        });
                    });
                });
            });
        }

        // Get button
        document.getElementById("getButton").addEventListener("click", function () {
            getZip();
        });

        // Babylon.js
        if (BABYLON.Engine.isSupported()) {
            var canvas = document.getElementById("renderCanvas");
            engine = new BABYLON.Engine(canvas, true);
            scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

            camera.attachControl(canvas, false);
            camera.lowerRadiusLimit = 1;
            camera.minZ = 1.0;

            selectMesh();

            if (!location.hash) {
                selectTemplate(true);
            }

            var time = 0;
            engine.runRenderLoop(function () {
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
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });

        var refTexture = new BABYLON.Texture("ref.jpg", scene);
        refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        var mainTexture = new BABYLON.Texture("amiga.jpg", scene);

        shaderMaterial.setTexture("textureSampler", mainTexture);
        shaderMaterial.setTexture("refSampler", refTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false;

        for (var index = 0; index < meshes.length; index++) {
            var mesh = meshes[index];
            mesh.material = shaderMaterial;
        }

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