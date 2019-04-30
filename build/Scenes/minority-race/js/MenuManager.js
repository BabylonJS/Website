/// <reference path=".\typings\babylon.d.ts" />
/// <reference path=".\Socket.ts" />
/// <reference path=".\MainMenu.ts" />
/// <reference path=".\MenuMultiStart.ts" />
/// <reference path=".\MenuSoloEnd.ts" />
/// <reference path=".\MenuMultiEnd.ts" />
var MenuManager = (function () {
    function MenuManager() {
    }
    MenuManager.prototype.initMenu = function (scene) {
        this.canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: "MenuCanvas",
            size: new BABYLON.Size(window.innerWidth, window.innerHeight)
        });
        var TitleRect = new BABYLON.Rectangle2D({
            parent: this.canvas, id: "background", x: 0, y: 0, width: window.innerWidth, height: window.innerHeight,
            fill: "#FFFFFFFF",
            children: [
                new BABYLON.Text2D("MINORITY RACE", { marginAlignment: "h: center, v:center", fontName: "60pt Arial Black", defaultFontColor: new BABYLON.Color4(0, 0, 0, 1), y: 200 }),
            ]
        });
        this.initMainMenu(scene, this.canvas);
        this.initMenuMultiStart(scene, this.canvas);
        this.initMenuMultiEnd(scene, this.canvas);
        this.initMenuSoloEnd(scene, this.canvas);
        this.mainMenu.show();
        this.menuMultiStart.hide();
        this.menuMultiEnd.hide();
        this.menuSoloEnd.hide();
    };
    MenuManager.prototype.initMainMenu = function (scene, canvas) {
        var _this = this;
        this.mainMenu = new MainMenu(scene, canvas);
        this.mainMenu.onSingleplayerClicked = function () {
            _this.mainMenu.hide();
            _this.canvas.levelVisible = false;
            _this.onLaunchSingleplayerRace();
        };
        this.mainMenu.onMultiplayerClicked = function () {
            _this.mainMenu.hide();
            Socket.connect();
            Socket.on("ok", function () {
                _this.menuMultiStart.show();
            });
            Socket.on("playerlist", function (list) {
                _this.menuMultiStart.setPlayerList(list);
            });
            Socket.on("launchrace", function (date) {
                _this.menuMultiStart.hide();
                _this.canvas.levelVisible = false;
                _this.onLaunchMultiplayerRace(date);
            });
        };
    };
    MenuManager.prototype.initMenuMultiStart = function (scene, canvas) {
        this.menuMultiStart = new MenuMultiStart(scene, canvas);
        this.menuMultiStart.onReadyButtonClicked = this.onReadyButtonClicked;
    };
    MenuManager.prototype.onReadyButtonClicked = function () {
        Socket.emit("ready", null);
    };
    MenuManager.prototype.initMenuSoloEnd = function (scene, canvas) {
        this.menuSoloEnd = new MenuSoloEnd(scene, canvas);
    };
    MenuManager.prototype.initMenuMultiEnd = function (scene, canvas) {
        this.menuMultiEnd = new MenuMultiEnd(scene, canvas);
    };
    MenuManager.prototype.onEndCountdownFinished = function () {
        var _this = this;
        this.canvas.levelVisible = true;
        this.menuMultiEnd.show();
        Socket.emit("getendlist", null);
        Socket.on("endlist", function (list) {
            _this.menuMultiEnd.setRank(list);
        });
        this.menuMultiEnd.onRetryButtonClicked = function () {
            _this.menuMultiEnd.hide();
            _this.menuMultiStart.show();
        };
    };
    MenuManager.prototype.onSoloRaceFinished = function (times) {
        var _this = this;
        this.canvas.levelVisible = true;
        this.menuSoloEnd.show();
        this.menuSoloEnd.firstTime.text = times[0];
        this.menuSoloEnd.secondTime.text = times[1];
        this.menuSoloEnd.thirdTime.text = times[2];
        this.menuSoloEnd.onRetryButtonClicked = function () {
            _this.menuSoloEnd.hide();
            _this.canvas.levelVisible = false;
            _this.onLaunchSingleplayerRace();
        };
    };
    return MenuManager;
})();
//# sourceMappingURL=MenuManager.js.map