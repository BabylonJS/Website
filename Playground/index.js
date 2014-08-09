(function () {
    var jsEditor = ace.edit("jsEditor");
    jsEditor.setTheme("ace/theme/monokai");
    jsEditor.getSession().setMode("ace/mode/javascript");
    jsEditor.setShowPrintMargin(false);

    var blockEditorChange = false;
    jsEditor.getSession().on('change', function () {

        if (blockEditorChange) {
            return;
        }

        document.getElementById("currentScript").innerHTML = "Custom";
    });

    var snippetUrl = "http://babylonjs-api.azurewebsites.net/api/snippet";
    var currentSnippetToken;
    var engine;
    var fpsLabel = document.getElementById("fpsLabel");
    var scripts;
    var zipCode;
    BABYLON.Engine.ShadersRepository = "/Babylon/Shaders/";

    var loadScript = function (scriptURL, title) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', scriptURL, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    blockEditorChange = true;
                    jsEditor.setValue(xhr.responseText);
                    jsEditor.gotoLine(0);
                    blockEditorChange = false;
                    compileAndRun();

                    document.getElementById("currentScript").innerHTML = title;
                } else { // Failed
                }
            }
        };

        xhr.send(null);
    };

    var loadScriptFromIndex = function (index) {
        if (index == 0) {
            index = 1;
        }

        var script = scripts[index - 1].trim();
        loadScript("scripts/" + script + ".js", script);
    }

    var onScriptClick = function (evt) {
        loadScriptFromIndex(evt.target.scriptLinkIndex);
    }

    var loadScriptsList = function () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'scripts/scripts.txt', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    scripts = xhr.responseText.split("\n");
                    var ul = document.getElementById("scriptsList");

                    for (var index = 0; index < scripts.length; index++) {
                        var li = document.createElement("li");
                        var a = document.createElement("a");

                        a.href = "#";
                        a.innerHTML = (index + 1) + " - " + scripts[index];
                        a.scriptLinkIndex = index + 1;
                        a.onclick = onScriptClick;

                        li.appendChild(a);
                        ul.appendChild(li);
                    }

                    if (!location.hash) {
                        // Query string
                        var queryString = window.location.search;

                        if (queryString) {
                            var query = queryString.replace("?", "");
                            var index = parseInt(query);

                            if (!isNaN(index)) {
                                loadScriptFromIndex(index);
                            } else {
                                loadScript("scripts/" + query + ".js", query);
                            }
                        } else {
                            loadScript("scripts/basic scene.js", "Basic scene");
                        }
                    }
                } else { // Failed
                }
            }
        };

        xhr.send(null);
    }

    var createNewScript = function () {
        location.hash = "";
        currentSnippetToken = null;
        jsEditor.setValue('// You have to create a function called createScene. This function must return a BABYLON.Scene object\r\n// You can reference the following variables: scene, canvas\r\n// You must at least define a camera\r\n// More info here: https://github.com/BabylonJS/Babylon.js/wiki/The-Playground\r\n\r\nvar createScene = function() {\r\n\tvar scene = new BABYLON.Scene(engine);\r\n\tvar camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);\r\n\tcamera.attachControl(canvas, false);\r\n\r\n\r\n\r\n\treturn scene;\r\n};');
        jsEditor.gotoLine(11);
        jsEditor.focus();
        compileAndRun();
    }

    var clear = function () {
        location.hash = "";
        currentSnippetToken = null;
        jsEditor.setValue('');
        jsEditor.gotoLine(0);
        jsEditor.focus();
    }

    var showError = function (errorMessage) {
        var errorContent = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>Compilation error</h4>' +
                                errorMessage + '</div>';

        document.getElementById("errorZone").innerHTML = errorContent;
    }

    var compileAndRun = function () {
        try {

            if (!BABYLON.Engine.isSupported()) {
                showError("Your browser does not support WebGL");
                return;
            }

            if (engine) {
                engine.dispose();
                engine = null;
            }

            var canvas = document.getElementById("renderCanvas");
            engine = new BABYLON.Engine(canvas, true);

            document.getElementById("statusBar").innerHTML = "Loading assets...Please wait";

            engine.runRenderLoop(function () {
                if (engine.scenes.length == 0) {
                    return;
                }
                var scene = engine.scenes[0];

                if (scene.activeCamera || scene.activeCameras.length > 0) {
                    scene.render();
                }

                fpsLabel.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";
            });

            var code = jsEditor.getValue();
            
            if (code.indexOf("createScene") !== -1) { // createScene
                eval(code);
                var scene = createScene();

                if (!scene) {
                    showError("createScene function must return a scene.");
                    return;
                }

                zipCode = code + "\r\n\r\nvar scene = createScene();";
            } else if (code.indexOf("CreateScene") !== -1) { // CreateScene
                eval(code);
                var scene = CreateScene();

                if (!scene) {
                    showError("CreateScene function must return a scene.");
                    return;
                }

                zipCode = code + "\r\n\r\nvar scene = CreateScene();";
            } else if (code.indexOf("createscene") !== -1) { // createscene
                eval(code);
                var scene = createscene();

                if (!scene) {
                    showError("createscene function must return a scene.");
                    return;
                }

                zipCode = code + "\r\n\r\nvar scene = createscene();";
            } else { // Direct code
                var scene = new BABYLON.Scene(engine);
                eval("runScript = function(scene, canvas) {" + code + "}");
                runScript(scene, canvas);

                zipCode = "var scene = new BABYLON.Scene(engine);\r\n\r\n" + code;
            }

            if (engine.scenes.length == 0) {
                showError("You must at least create a scene.");
                return;
            }

            if (engine.scenes[0].activeCamera == null) {
                showError("You must at least create a camera.");
                return;
            }

            engine.scenes[0].executeWhenReady(function () {
                document.getElementById("statusBar").innerHTML = "";
            });

        } catch (e) {
            showError(e.message);
        }
    }

    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    });

    // Load scripts list
    loadScriptsList();

    // Zip
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
                            var splits = replace.split("\r\n");
                            for (var index = 0; index < splits.length; index++) {
                                splits[index] = "        " + splits[index];
                            }
                            replace = splits.join("\r\n");

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

    var addTexturesToZip = function (zip, index, textures, folder, then) {
        if (index == textures.length) {
            then();
            return;
        }

        if (textures[index].isRenderTarget || textures[index] instanceof BABYLON.DynamicTexture) {
            addTexturesToZip(zip, index + 1, textures, folder, then);
            return;
        }

        if (textures[index].isCube) {
            for (var i = 0; i < 6; i++) {
                textures.push({ name: textures[index].name + textures[index]._extensions[i] });
            }
            addTexturesToZip(zip, index + 1, textures, folder, then);
            return;
        }


        if (folder == null) {
            folder = zip.folder("textures");
        }

        var name;
        var url;

        if (textures[index].video) {
            url = textures[index].video.currentSrc;
        } else {
            url = textures[index].name;
        }

        name = url.substr(url.lastIndexOf("/") + 1);


        addContentToZip(folder, name, url, null, true, function () {
            addTexturesToZip(zip, index + 1, textures, folder, then);
        });
    }

    var addImportedFilesToZip = function (zip, index, importedFiles, folder, then) {
        if (index == importedFiles.length) {
            then();
            return;
        }

        if (!folder) {
            folder = zip.folder("scenes");
        }

        var name;
        var url = importedFiles[index];

        name = url.substr(url.lastIndexOf("/") + 1);

        addContentToZip(folder, name, url, null, true, function () {
            addImportedFilesToZip(zip, index + 1, importedFiles, folder, then);
        });
    }

    var getZip = function () {
        if (engine.scenes.length == 0) {
            return;
        }

        var zip = new JSZip();

        var scene = engine.scenes[0];

        var textures = scene.textures;

        var importedFiles = scene.importedMeshesFiles;

        document.getElementById("statusBar").innerHTML = "Creating archive...Please wait";

        if (zipCode.indexOf("textures/worldHeightMap.jpg") !== -1) {
            textures.push({ name: "textures/worldHeightMap.jpg" });
        }        

        addContentToZip(zip, "index.html", "zipContent/index.html", zipCode, false, function () {
            addTexturesToZip(zip, 0, textures, null, function () {
                addImportedFilesToZip(zip, 0, importedFiles, null, function () {
                    var blob = zip.generate({ type: "blob" });
                    saveAs(blob, "sample.zip");
                    document.getElementById("statusBar").innerHTML = "";
                });
            });
        });
    }

    // Fonts
    setFontSize = function (size) {
        jsEditor.setFontSize(size);
        document.getElementById("currentFontSize").innerHTML = "Font size: " + size;
    }

    // Fullscreen
    var goFullscreen = function () {
        if (engine) {
            engine.switchFullscreen(true);
        }
    }

    // UI
    document.getElementById("runButton").addEventListener("click", compileAndRun);
    document.getElementById("zipButton").addEventListener("click", getZip);
    document.getElementById("fullscreenButton").addEventListener("click", goFullscreen);
    document.getElementById("newButton").addEventListener("click", createNewScript);
    document.getElementById("clearButton").addEventListener("click", clear);

    // Snippet
    var save = function () {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 201) {
                    var baseUrl = location.href.replace(location.hash, "").replace(location.search, "");
                    var snippet = JSON.parse(xmlHttp.responseText);
                    var newUrl = baseUrl + "#" + snippet.id;
                    currentSnippetToken = snippet.id;
                    if (snippet.version != "0") {
                        newUrl += "#" + snippet.version;
                    }
                    location.href = newUrl;
                    compileAndRun();
                } else {
                    showError("Unable to save your code. It may be too long.");
                }
            }
        }

        xmlHttp.open("POST", snippetUrl + (currentSnippetToken ? "/" + currentSnippetToken : ""), true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");

        var payload = {
            code: jsEditor.getValue()
        };

        xmlHttp.send(JSON.stringify(payload));
    }
    document.getElementById("saveButton").addEventListener("click", save);

    var previousHash = "";

    var cleanHash = function () {
        var splits = decodeURIComponent(location.hash.substr(1)).split("#");

        if (splits.length > 2) {
            splits.splice(2, splits.length - 2);
        }

        location.hash = splits.join("#");
    }

    var checkHash = function (firstTime) {
        if (location.hash) {
            if (previousHash != location.hash) {
                cleanHash();

                previousHash = location.hash;

                try {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4) {
                            if (xmlHttp.status == 200) {
                                var snippet = JSON.parse(xmlHttp.responseText);

                                jsEditor.setValue(snippet.code.toString());
                                jsEditor.gotoLine(0);

                                compileAndRun();

                                document.getElementById("currentScript").innerHTML = "Custom";
                            } else if (firstTime) {
                                location.href = location.href.replace(location.hash, "");
                                if (scripts) {
                                    loadScriptFromIndex(0);
                                }
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

    checkHash(true);

})();