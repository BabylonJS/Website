var MainMenu = (function () {
    function MainMenu(scene, canvas) {
        var _this = this;
        this.isSoloButtonClicked = false;
        this.isMultiButtonClicked = false;
        this.buttonRect = new BABYLON.Rectangle2D({
            parent: canvas, id: "button", x: 0, y: 50, width: 300, height: 40,
            fill: "#000000FF", roundRadius: 10,
            marginAlignment: "h: center, v: center",
            children: [
                new BABYLON.Text2D("Solo", { marginAlignment: "h: center, v: center" }),
            ]
        });
        this.buttonRect.pointerEventObservable.add(function (d, s) {
            _this.isSoloButtonClicked = true;
            _this.onSingleplayerClicked();
        }, BABYLON.PrimitivePointerInfo.PointerUp);
        this.button2Rect = new BABYLON.Rectangle2D({
            parent: canvas, id: "button2", x: 0, y: -25, width: 300, height: 40,
            fill: "#000000FF", roundRadius: 10,
            marginAlignment: "h: center, v: center",
            children: [
                new BABYLON.Text2D("Multijoueur", { marginAlignment: "h: center, v: center" })
            ]
        });
        this.button2Rect.pointerEventObservable.add(function (d, s) {
            _this.isMultiButtonClicked = true;
            _this.onMultiplayerClicked();
        }, BABYLON.PrimitivePointerInfo.PointerUp);
    }
    ;
    MainMenu.prototype.dispose = function () {
        this.buttonRect.dispose();
        this.button2Rect.dispose();
    };
    MainMenu.prototype.hide = function () {
        this.button2Rect.levelVisible = false;
        this.buttonRect.levelVisible = false;
    };
    MainMenu.prototype.show = function () {
        this.button2Rect.levelVisible = true;
        this.buttonRect.levelVisible = true;
    };
    return MainMenu;
})();
//# sourceMappingURL=MainMenu.js.map