/// <reference path="../typings/chart.js.d.ts" />

document.addEventListener("DOMContentLoaded", init);

var buttonsMenu: HTMLButtonElement[] = [];
var buttonsMenuIndex = 0;
var launchAllBtn: HTMLButtonElement;
var viewResultBtn: HTMLButtonElement;
var benchmarkMenu: HTMLElement;
var backgroundImage: HTMLImageElement;

function setButtonFocus(change: number) {
    buttonsMenu[buttonsMenuIndex].classList.remove("focus");
    buttonsMenuIndex += change;
    buttonsMenuIndex = (buttonsMenuIndex + buttonsMenu.length) % buttonsMenu.length;
    buttonsMenu[buttonsMenuIndex].classList.add("focus");
    buttonsMenu[buttonsMenuIndex].focus();
}

function init() {
    launchAllBtn = <HTMLButtonElement>document.getElementById("launchAllBtn");
    viewResultBtn = <HTMLButtonElement>document.getElementById("viewBtn");
    benchmarkMenu = <HTMLElement>document.getElementById("benchmarkMenu");
    backgroundImage = <HTMLImageElement>document.getElementById("backgroundImage");

    buttonsMenu.push(<HTMLButtonElement>document.getElementById("launchAllBtn"));
    buttonsMenu.push(<HTMLButtonElement>document.getElementById("configureBtn"));
    buttonsMenu.push(<HTMLButtonElement>document.getElementById("viewBtn"));

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

    launchAllBtn.addEventListener("click", () => {
        benchmarkMenu.classList.add("hidden");

        var canvas = <HTMLCanvasElement>document.getElementById("benchmarkCanvas");

        var runtimeEngine = new BABYLON.RuntimeEngine(canvas);

        var run0 = new BABYLON.RunDescription();
        run0.duration = 2000;
        run0.onLoad = () => {
        }

        run0.sceneFilename = "espilit.binary.babylon";
        run0.sceneUrl = "/scenes/espilit/";

        runtimeEngine.start([run0], () => {
            alert("fini");
        });
    });

    viewResultBtn.addEventListener("click", () => {
        benchmarkMenu.classList.add("hidden");
        backgroundImage.classList.add("hidden");
        displayResultChart();
    });
}

function displayResultChart() {
    var canvas = document.getElementById("resultsChart");
    canvas.style.visibility = "visible";
    var myChart = new Chart.Chart(<any>canvas, {
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

