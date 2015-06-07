"use strict";

document.addEventListener("DOMContentLoaded", startValidation, false);

var engine;
var renderCanvas;
var currentScene;
var config;

function compare(renderData, referenceCanvas) {
    var width = referenceCanvas.width;
    var height = referenceCanvas.height;
    var size = width * height * 4;

    var referenceContext = referenceCanvas.getContext("2d");

    var referenceData = referenceContext.getImageData(0, 0, width, height);

    var differencesCount = 0;
    for (var index = 0; index < size; index += 4) {
        if (renderData[index] === referenceData.data[index] &&
            renderData[index + 1] === referenceData.data[index + 1] &&
            renderData[index + 2] === referenceData.data[index + 2]) {
            continue;
        }

        referenceData.data[index] = 255;
        referenceData.data[index + 1] *= 0.5;
        referenceData.data[index + 2] *= 0.5;
        differencesCount++;
    }

    referenceContext.putImageData(referenceData, 0, 0);

    return differencesCount;
}

function getRenderData(canvas, engine) {
    var width = canvas.width;
    var height = canvas.height;

    var renderData = engine.readPixels(0, 0, width, height);
    var numberOfChannelsByLine = width * 4;
    var halfHeight = height / 2;

    for (var i = 0; i < halfHeight; i++) {
        for (var j = 0; j < numberOfChannelsByLine; j++) {
            var currentCell = j + i * numberOfChannelsByLine;
            var targetLine = height - i - 1;
            var targetCell = j + targetLine * numberOfChannelsByLine;

            var temp = renderData[currentCell];
            renderData[currentCell] = renderData[targetCell];
            renderData[targetCell] = temp;
        }
    }

    return renderData;
}

function saveRenderImage(data, canvas) {
    var width = canvas.width;
    var height = canvas.height;
    var screenshotCanvas = document.createElement('canvas');
    screenshotCanvas.width = width;
    screenshotCanvas.height = height;
    var context = screenshotCanvas.getContext('2d');

    var imageData = context.createImageData(width, height);
    var castData = imageData.data;
    castData.set(data);
    context.putImageData(imageData, 0, 0);

    return screenshotCanvas.toDataURL();
}

function evaluate(resultCanvas, result, renderImage, index) {
    var renderData = getRenderData(renderCanvas, engine);

    if (compare(renderData, resultCanvas) !== 0) {
        result.classList.add("failed");
        result.innerHTML = "×";
    } else {
        result.innerHTML = "✔";
    }

    renderImage.src = saveRenderImage(renderData, renderCanvas);

    currentScene.dispose();

    runTest(index + 1);
}

function processCurrentScene(test, resultCanvas, result, renderImage, index) {
    currentScene.executeWhenReady(function () {
        var renderCount = test.renderCount || 1;

        for (var renderIndex = 0; renderIndex < renderCount; renderIndex++) {
            currentScene.render();
        }

        evaluate(resultCanvas, result, renderImage, index);
    });
}

function runTest(index) {
    if (index >= config.tests.length) {
        return;
    }

    var test = config.tests[index];
    var container = document.createElement("div");
    container.id = "container#" + index;
    container.className = "container";
    document.body.appendChild(container);

    var title = document.createElement("div");
    title.className = "title";
    container.appendChild(title);

    var resultCanvas = document.createElement("canvas");
    resultCanvas.className = "resultImage";
    container.appendChild(resultCanvas);

    var result = document.createElement("div");
    result.className = "result";
    container.appendChild(result);

    title.innerHTML = test.title;

    console.log("Running " + test.title);

    var resultContext = resultCanvas.getContext("2d");
    var img = new Image();
    img.onload = function () {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        resultContext.drawImage(img, 0, 0);
    }

    var browser = "IE";

    if (navigator.userAgent.indexOf("Trident") !== -1) {
        browser = "IE";
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        browser = "Firefox";
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        browser = "Chrome";
    }

    img.src = "ReferenceImages/" + browser + "/" + test.referenceImage;

    var renderImage = new Image();
    renderImage.className = "renderImage";
    container.appendChild(renderImage);

    location.href = "#" + container.id;

    if (test.sceneFolder) {
        BABYLON.SceneLoader.Load(config.root + test.sceneFolder, test.sceneFilename, engine, function (newScene) {
            currentScene = newScene;
            processCurrentScene(test, resultCanvas, result, renderImage, index);
        });
    } else {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript")

        var runScript = function () {
            currentScene = eval(test.functionToCall + "(engine)");
            processCurrentScene(test, resultCanvas, result, renderImage, index);
        }

        script.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                runScript();
            }
        }

        script.onload = runScript;
        script.setAttribute("src", config.root + test.scriptToRun);

        document.getElementsByTagName("head")[0].appendChild(script);
    }
}

function startValidation() {
    BABYLON.SceneLoader.ShowLoadingScreen = false;
    BABYLON.Database.IDBStorageEnabled = false;
    BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true;

    renderCanvas = document.createElement("canvas");
    renderCanvas.className = "renderCanvas";
    document.body.appendChild(renderCanvas);
    engine = new BABYLON.Engine(renderCanvas, false);

    // Loading tests
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "config.json", true);

    xhr.addEventListener("load",function() {
        if (xhr.status === 200) {

            config = JSON.parse(xhr.responseText);

            // Run tests
            runTest(0, engine);

        }
    }, false);

    xhr.send();
};