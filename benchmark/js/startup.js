/// <reference path="../typings/chart.js.d.ts" />
document.addEventListener("DOMContentLoaded", init);
var buttonsMenu = [];
var buttonsMenuIndex = 0;
var launchAllBtn;
var viewResultBtn;
var benchmarkMenu;
var backgroundImage;
function setButtonFocus(change) {
    buttonsMenu[buttonsMenuIndex].classList.remove("focus");
    buttonsMenuIndex += change;
    buttonsMenuIndex = (buttonsMenuIndex + buttonsMenu.length) % buttonsMenu.length;
    buttonsMenu[buttonsMenuIndex].classList.add("focus");
    buttonsMenu[buttonsMenuIndex].focus();
}
function init() {
    launchAllBtn = document.getElementById("launchAllBtn");
    viewResultBtn = document.getElementById("viewBtn");
    benchmarkMenu = document.getElementById("benchmarkMenu");
    backgroundImage = document.getElementById("backgroundImage");
    buttonsMenu.push(document.getElementById("launchAllBtn"));
    buttonsMenu.push(document.getElementById("configureBtn"));
    buttonsMenu.push(document.getElementById("viewBtn"));
    buttonsMenu[0].focus();
    /// Keyboard Navigation
    document.addEventListener("keydown", function (evt) {
        switch (evt.keyCode) {
            case 38:
                setButtonFocus(-1);
                break;
            case 40:
                setButtonFocus(+1);
                break;
        }
    });
    launchAllBtn.addEventListener("click", function () {
        benchmarkMenu.classList.add("hidden");
        var canvas = document.getElementById("benchmarkCanvas");
        var runtimeEngine = new BABYLON.RuntimeEngine(canvas);
        var run0 = new BABYLON.RunDescription();
        run0.duration = 2000;
        run0.onLoad = function () {
        };
        run0.sceneFilename = "espilit.binary.babylon";
        run0.sceneUrl = "/scenes/espilit/";
        runtimeEngine.start([run0], function () {
            alert("fini");
        });
    });
    viewResultBtn.addEventListener("click", function () {
        benchmarkMenu.classList.add("hidden");
        backgroundImage.classList.add("hidden");
        displayResultChart();
    });
}
function displayResultChart() {
    var canvas = document.getElementById("resultsChart");
    canvas.style.visibility = "visible";
    var myChart = new Chart.Chart(canvas, {
        type: 'line',
        data: {
            datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                            x: -10,
                            y: 0
                        }, {
                            x: 0,
                            y: 5
                        }, {
                            x: 5,
                            y: 5
                        }]
                }]
        },
        options: {
            scales: {
                xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
            }
        }
    });
}
//# sourceMappingURL=startup.js.map