/**
 * Creates a Babylon scene which loads glTF models and displays them as a grid.  The parameters are picked up from the url and models can be selected with a dropdown menu
 * @param {BABYLON.Engine} engine 
 */
function createScene(engine) {
    var glTFParameters = getURLParameters();

    var scene = loadScene(engine, glTFParameters);

    return scene;
}

/**
 * Loads the scene based on the test parameters.  If glTF parameters is null, display empty scene.
 * @param {BABYLON.Engine} engine 
 * @param {*} glTFParameters 
 */
function loadScene(engine, glTFParameters) {
    var scene = new BABYLON.Scene(engine);
    var showMenu = true;
    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/Assets/environment.dds", scene);
    hdrTexture.gammaSpace = false;
    scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);

    if (glTFParameters != null) {
        showMenu = glTFParameters["showMenu"];
        var radius = glTFParameters["radius"];
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, radius);
        initScene(scene, camera, glTFParameters);
    }
    else {
        // No glTf parameters, so initialize camera with default radius of 6.
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 6);
    }
    if (showMenu === true) {
        initDropdownMenu("/Demos/GLTFTests/generatedAssets.json");
    }
    camera.wheelPrecision = 100;
    camera.attachControl(scene.getEngine().getRenderingCanvas());

    return scene;
}

function createBufferInterleavedScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Buffer_Interleaved";
    glTFParameters["count"] = 5;
    glTFParameters["width"] = 3;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material";
    glTFParameters["count"] = 8;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialAlphaBlendScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_AlphaBlend";
    glTFParameters["count"] = 7;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialAlphaMaskScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_AlphaMask";
    glTFParameters["count"] = 6;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialDoubleSidedScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_DoubleSided";
    glTFParameters["count"] = 4;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialDoubleSidedBackScene(engine) {
    var glTFParameters = {};
    glTFParameters["title"] = "Material Double Sided (Back)";
    glTFParameters["test"] = "Material_DoubleSided";
    glTFParameters["count"] = 4;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = true;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialMetallicRoughnessScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_MetallicRoughness";
    glTFParameters["count"] = 12;
    glTFParameters["width"] = 5;
    glTFParameters["position"] = [-2.5, 1.3, 0.0];
    glTFParameters["radius"] = 5.6;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialMixedScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_Mixed";
    glTFParameters["count"] = 3;
    glTFParameters["width"] = 3;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMaterialSpecularGlossinessScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Material_SpecularGlossiness";
    glTFParameters["count"] = 14;
    glTFParameters["width"] = 5;
    glTFParameters["position"] = [-2.5, 1.3, 0.0];
    glTFParameters["radius"] = 5.6;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMeshPrimitiveModeScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Mesh_PrimitiveMode";
    glTFParameters["count"] = 16;
    glTFParameters["width"] = 6;
    glTFParameters["position"] = [-2.8, 1.3, 0.0];
    glTFParameters["radius"] = 6;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMeshPrimitivesScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Mesh_Primitives";
    glTFParameters["count"] = 3;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createMeshPrimitivesUVScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Mesh_PrimitivesUV";
    glTFParameters["count"] = 9;
    glTFParameters["width"] = 5;
    glTFParameters["position"] = [-2.5, 1.3, 0.0];
    glTFParameters["radius"] = 5.6;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createPrimitiveAttributeScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Mesh_PrimitiveAttribute";
    glTFParameters["count"] = 7;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createPrimitiveVertexColorScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Mesh_PrimitiveVertexColor";
    glTFParameters["count"] = 6;
    glTFParameters["width"] = 4;
    glTFParameters["position"] = [-1.8, 0.7, 0.0];
    glTFParameters["radius"] = 4.0;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function createTextureSamplerScene(engine) {
    var glTFParameters = {};
    glTFParameters["test"] = "Texture_Sampler";
    glTFParameters["count"] = 14;
    glTFParameters["width"] = 6;
    glTFParameters["position"] = [-3.0, 1.3, 0.0];
    glTFParameters["radius"] = 5.6;
    glTFParameters["flip"] = false;
    glTFParameters["showMenu"] = false;

    return loadScene(engine, glTFParameters);
}

function initScene(scene, camera, glTFParameters) {
    var assetRootDirectory = "/Assets/glTFTests/";
    if (glTFParameters != null) {
        var assetName = glTFParameters["test"];
        var total = glTFParameters["count"];
        var width = glTFParameters["width"];
        var position = glTFParameters["position"];
        var title;
        if (glTFParameters.title !== undefined) {
            title = glTFParameters['title'].replace("_", "").replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1');
        }
        else {
            var title = glTFParameters["test"].replace("_", "").replace(/([A-Z])/g, ' $1');
        }
        
        var flip = glTFParameters["flip"];
        var showMenu = glTFParameters["showMenu"];

        function glTFGrid(widthDistance, heightDistance, topLeft, rootDirectory, fileNamePrefix, flip) {
            function pad(num, width) {
                var z = '0';
                num = num + "";

                return num.length >= width ? num : new Array(width - num.length + 1).join(z) + num;
            }

            var height = total / width;
            var heightRemainder = (total / width) % width;
            if (heightRemainder > 0) {
                height += heightRemainder / heightRemainder;
            }

            var titleLabel = createLabel(scene, title);
            titleLabel.position.x = topLeft.x + ((width - 1) * widthDistance) / 2;
            titleLabel.position.y = topLeft.y + 0.8;

            for (var h = 0; h < height; ++h) {
                for (var w = 0; w < width; ++w) {
                    var id = w + (h * width);
                    if (id < total) {
                        var paddedID = pad(id, 2);
                        loadGLTF(scene, rootDirectory, fileNamePrefix + paddedID + ".gltf", "root" + paddedID, new BABYLON.Vector3(topLeft.x + w * widthDistance, topLeft.y - h * heightDistance, 0), paddedID, flip, fileNamePrefix + "00" + ".gltf");
                    }
                }
            }
        }

        glTFGrid(+1.2, +1.4, new BABYLON.Vector3(position[0], position[1], position[2]), assetRootDirectory + assetName + "/", assetName + "_", flip);

    }
    else {
        throw new Error("failed to load..");
    }
}

/**
 * Parse the url for parameters.
 */
function getURLParameters() {
    var parameters = {};
    var queryString = window.location.href;
    var urlSplit = queryString.split('?');
    if (urlSplit.length !== 2) {
        return null;
    }

    var params = urlSplit[1].split('&');

    var length = params.length;
    for (var i = 0; i < length; ++i) {
        var keyValue = params[i].split('=');
        var value = keyValue[1];

        switch (keyValue[0]) {
            case 'title':
                parameters['title'] = value;
                break;
            case 'test':
                parameters['test'] = value;
                break;
            case 'count':
                parameters['count'] = value;
                break;
            case 'width':
                parameters['width'] = value;
                break;
            case 'position':
                const positionStrings = value.match(/-?[0-9]+(\.[0-9]+)?/g);
                parameters['position'] = [];
                for (let i = 0; i < positionStrings.length; ++i) {
                    parameters.position.push(Number(positionStrings[i]));
                }
                break;
            case 'radius':
                parameters['radius'] = value;
                break;
            case 'flip':
                parameters['flip'] = value === "true";
                break;
            case 'showMenu':
                parameters['showMenu'] = value === "true";
                break;
            default:
                break;
        }
    }

    return parameters;
}

/**
 * Converts the data into json and initializes the test selector dropdown menu
 * @param {*} jsonFile
 */
function initDropdownMenu(jsonFile) {
    function readJSONFile(file, onSuccess) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                onSuccess(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    function generateTestSelectorHTML(data) {
        function setURLFromDropdown() {
            var selectTestDropdown = document.getElementById("testSelector");
            selectTestDropdown.addEventListener("change", function () {
                window.location.href = this.options[this.selectedIndex].value;
            });
        }
        var dropdownHTML = '<select id="testSelector" name="testSelector">Things' +
            '<option value="">Choose a Test</option>';

        var keys = Object.keys(data["tests"]).sort();

        var length = keys.length;
        for (var i = 0; i < length; ++i) {
            dropdownHTML += '<option value=' + data["tests"][keys[i]]["url"] + '>' + keys[i] + '</option>';
        }

        dropdownHTML += '</select>';
        var testSelector = document.getElementById("testSelectorDiv").innerHTML = dropdownHTML;

        setURLFromDropdown();
    }

    readJSONFile(jsonFile, function (data) {
        var results = JSON.parse(data);

        generateTestSelectorHTML(results);
    });
}

/**
 * Load and render the glTF model with caption.  
 * We flip the glTF models by 180 degrees before rendering to conform to the glTF +z-forward convention.
 * @param {BABYLON.Scene} scene 
 * @param {string} rootUrl 
 * @param {string} sceneFileName 
 * @param {string} name 
 * @param {BABYLON.Vector3} position 
 * @param {string} caption 
 * @param {boolean} flip 
 */
function loadGLTF(scene, rootUrl, sceneFileName, name, position, caption, flip) {
    var rotation = new BABYLON.Vector3(0, Math.PI, 0);
    if (flip === true) {
        rotation = new BABYLON.Vector3(0, 0, 0);
    }

    BABYLON.SceneLoader.ImportMesh("", rootUrl, sceneFileName, scene, function (meshes) {
        var root = new BABYLON.Mesh(name, scene);

        var textLabel0 = createLabel(scene, caption);
        textLabel0.position = position.clone();
        textLabel0.position.y -= 0.7;

        var length = meshes.length;

        for (var i = 0; i < length; ++i) {
            if (!meshes[i].parent) {
                meshes[i].parent = root;
            }
        }
        root.position = position;
        root.rotation = rotation;
    }, null, null);
}

/**
 * Creates a text label.
 * @param {*} scene - BabylonJS scene object.
 * @param {string} text - Text to display for label.
 */
function createLabel(scene, text) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, null, null, "36px Arial", "white", "transparent");

    var plane = BABYLON.Mesh.CreatePlane("TextPlane", 2, scene);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = BABYLON.Color3.White();
    plane.material.diffuseTexture = dynamicTexture;
    plane.material.useAlphaFromDiffuseTexture = true;

    return plane;
}