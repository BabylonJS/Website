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
    var scene;
    var fpsLabel = document.getElementById("fpsLabel");
    var scripts;
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
        var script = scripts[index].trim();
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
                        a.innerHTML = index + " - " + scripts[index];
                        a.scriptLinkIndex = index;
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
        jsEditor.setValue('// You can reference the following variables: scene, canvas\r\n// You must at least define a camera\r\nvar camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);\r\ncamera.attachControl(canvas, false);');
        jsEditor.gotoLine(0);
        compileAndRun();
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
            scene = new BABYLON.Scene(engine);

            document.getElementById("statusBar").innerHTML = "Loading assets...Please wait";

            engine.runRenderLoop(function () {
                if (scene.activeCamera || scene.activeCameras.length > 0) {
                    scene.render();
                }

                fpsLabel.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";
            });

            eval("runScript = function(scene, canvas) {" + jsEditor.getValue() + "}");
            runScript(scene, canvas);

            if (scene.activeCamera == null) {
                showError("You must at least create a camera.");
            }

        } catch (e) {
            showError(e.message);
        }

        scene.executeWhenReady(function () {
            document.getElementById("statusBar").innerHTML = "";
        });
    }

    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    });

    // Load scripts list
    loadScriptsList();

    // Zip
    var addContentToZip = function (zip, name, url, buffer, then) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        if (buffer) {
            xhr.responseType = "arraybuffer";
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    zip.file(name, buffer ? xhr.response : xhr.responseText);

                    then();
                } else { // Failed
                }
            }
        };

        xhr.send(null);
    }

    var addTexturesToZip = function (index, textures, folder, then) {
        if (index == textures.length) {
            then();
            return;
        }

        if (textures[index].isRenderTarget) {
            addTexturesToZip(index + 1, textures, folder, then);
            return;
        }

        var name;
        var url;

        if (textures[index].video) {
            url = textures[index].video.currentSrc;
        } else {
            url = textures[index].name;
        }

        name = url.substr(url.lastIndexOf("/") + 1);

        addContentToZip(folder, name, url, true, function () {
            addTexturesToZip(index + 1, textures, folder, then);
        });
    }

    var addImportedFilesToZip = function (index, importedFiles, folder, then) {
        if (index == importedFiles.length) {
            then();
            return;
        }

        var name;
        var url = importedFiles[index];

        name = url.substr(url.lastIndexOf("/") + 1);

        addContentToZip(folder, name, url, true, function () {
            addImportedFilesToZip(index + 1, importedFiles, folder, then);
        });
    }

    var getZip = function () {
        var zip = new JSZip();

        var textures = scene.textures;

        var importedFiles = scene.importedMeshesFiles;

        document.getElementById("statusBar").innerHTML = "Creating archive...Please wait";

        addContentToZip(zip, "index.html", "zipContent/index.html", false, function () {
            addContentToZip(zip, "index.css", "zipContent/index.css", false, function () {
                zip.file("index.js", "runScript = function(scene, canvas) {\r\n" + jsEditor.getValue() + "\r\n}");

                var texturesFolder = zip.folder("textures");
                addTexturesToZip(0, textures, texturesFolder, function () {

                    var scenesFolder = zip.folder("scenes");
                    addImportedFilesToZip(0, importedFiles, scenesFolder, function () {

                        var blob = zip.generate({ type: "blob" });
                        saveAs(blob, "sample.zip");
                        document.getElementById("statusBar").innerHTML = "";
                    });
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

    // Snippet
    var save = function () {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 201) {
                var baseUrl = location.href.replace(location.hash, "");
                var snippet = JSON.parse(xmlHttp.responseText);
                var newUrl = baseUrl + "#" + snippet.id;
                currentSnippetToken = snippet.id;
                if (snippet.version != "0") {
                    newUrl += "#" + snippet.version;
                }
                location.href = newUrl;
                compileAndRun();
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