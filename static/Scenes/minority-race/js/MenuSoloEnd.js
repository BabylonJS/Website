var MenuSoloEnd = (function () {
    function MenuSoloEnd(scene, canvas) {
        var _this = this;
        this.retryButton = new BABYLON.Rectangle2D({
            id: "retryButton", x: 50, y: -100, width: 100, height: 50,
            fill: "#00008BFF", roundRadius: 15,
            children: [
                new BABYLON.Text2D("Rejouer", { marginAlignment: "h: center, v:center" })
            ]
        });
        this.retryButton.pointerEventObservable.add(function (d, s) {
            _this.onRetryButtonClicked();
        }, BABYLON.PrimitivePointerInfo.PointerUp);
        this.timeList = new BABYLON.Rectangle2D({
            parent: canvas, id: "timeList", x: 0, y: 0, width: 200, height: 125,
            fill: "#000000FF", roundRadius: 10,
            marginAlignment: "h: center, v: center",
            children: [
                this.firstTime = new BABYLON.Text2D("Premier tour: 00:00:00", { marginAlignment: "h: left, v:top", y: 0 }),
                this.secondTime = new BABYLON.Text2D("Deuxieme tour: 00:00:00", { marginAlignment: "h: left, v:top", y: -50 }),
                this.thirdTime = new BABYLON.Text2D("Troisieme tour: 00:00:00", { marginAlignment: "h: left, v:top", y: -100 }),
                this.retryButton,
            ]
        });
    }
    MenuSoloEnd.prototype.dispose = function () {
        this.timeList.dispose();
        this.retryButton.dispose();
    };
    MenuSoloEnd.prototype.hide = function () {
        this.timeList.levelVisible = false;
        this.retryButton.levelVisible = false;
    };
    MenuSoloEnd.prototype.show = function () {
        this.timeList.levelVisible = true;
        this.retryButton.levelVisible = true;
    };
    return MenuSoloEnd;
})();
//# sourceMappingURL=MenuSoloEnd.js.map