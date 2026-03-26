var MenuMultiEnd = (function () {
    function MenuMultiEnd(scene, canvas) {
        var _this = this;
        this.roomButton = new BABYLON.Rectangle2D({
            id: "roomButton", x: 50, y: -100, width: 100, height: 50,
            fill: "#00008BFF", roundRadius: 15,
            children: [
                new BABYLON.Text2D("Rejouer", { marginAlignment: "h: center, v:center" })
            ]
        });
        this.roomButton.pointerEventObservable.add(function (d, s) {
            _this.onRetryButtonClicked();
        }, BABYLON.PrimitivePointerInfo.PointerUp);
        this.rankList = new BABYLON.Rectangle2D({
            parent: canvas, id: "timeList", x: 0, y: 0, width: 240, height: 175,
            fill: "#000000FF", roundRadius: 10,
            marginAlignment: "h: center, v: center",
            children: [
                this.first = new BABYLON.Text2D("1er: ", { marginAlignment: "h: left, v:top", y: 0 }),
                this.second = new BABYLON.Text2D("2eme: ", { marginAlignment: "h: left, v:top", y: -50 }),
                this.third = new BABYLON.Text2D("3eme: ", { marginAlignment: "h: left, v:top", y: -100 }),
                this.fourth = new BABYLON.Text2D("4eme: ", { marginAlignment: "h:left, v:top", y: -150 }),
                this.roomButton,
            ]
        });
    }
    MenuMultiEnd.prototype.dispose = function () {
        this.rankList.dispose();
        this.roomButton.dispose();
    };
    MenuMultiEnd.prototype.hide = function () {
        this.rankList.levelVisible = false;
        this.roomButton.levelVisible = false;
    };
    MenuMultiEnd.prototype.show = function () {
        this.rankList.levelVisible = true;
        this.roomButton.levelVisible = true;
    };
    MenuMultiEnd.prototype.setRank = function (list) {
        this.first.text = "1er - " + list[0];
        if (list.length > 1)
            this.second.text = "2eme - " + list[1];
        else
            this.second.text = "";
        if (list.length > 2)
            this.third.text = "3eme - " + list[2];
        else
            this.third.text = "";
        if (list.length > 3)
            this.fourth.text = "4eme - " + list[3];
        else
            this.fourth.text = "";
    };
    return MenuMultiEnd;
})();
//# sourceMappingURL=MenuMultiEnd.js.map