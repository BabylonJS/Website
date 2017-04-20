var MenuMultiStart = (function () {
    function MenuMultiStart(scene, canvas) {
        var _this = this;
        this.isReady = false;
        this.readyButton = new BABYLON.Rectangle2D({
            id: "readyButton", x: 0, y: -180, width: 300, height: 50,
            fill: "#00008BFF", roundRadius: 15,
            children: [
                new BABYLON.Text2D("PRET", { marginAlignment: "h: center, v:center" })
            ]
        });
        this.readyButton.pointerEventObservable.add(function (d, s) {
            _this.onReadyButtonClicked();
        }, BABYLON.PrimitivePointerInfo.PointerUp);
        this.playerList = new BABYLON.Text2D("Joueurs:\n\nLe Noir de Somalie\n\nLe Rebeu du Maroc", { marginAlignment: "h: left, v:top" });
        this.multiList = new BABYLON.Rectangle2D({
            parent: canvas, id: "mulitList", x: 0, y: 0, width: 300, height: 250,
            fill: "#000000FF", roundRadius: 10,
            marginAlignment: "h: center, v: center",
            children: [
                this.playerList,
                this.readyButton,
            ]
        });
    }
    MenuMultiStart.prototype.setPlayerList = function (list) {
        var str = "Joueurs:\n\n";
        for (var i = 0; i < list.length; i++) {
            str += (list[i].ready ? "- [READY] " : "- ") + list[i].name + "\n\n";
        }
        this.playerList.text = str;
    };
    MenuMultiStart.prototype.dispose = function () {
        this.multiList.dispose();
        this.readyButton.dispose();
    };
    MenuMultiStart.prototype.hide = function () {
        this.multiList.levelVisible = false;
        this.readyButton.levelVisible = false;
    };
    MenuMultiStart.prototype.show = function () {
        this.multiList.levelVisible = true;
        this.readyButton.levelVisible = true;
    };
    return MenuMultiStart;
})();
//# sourceMappingURL=MenuMultiStart.js.map