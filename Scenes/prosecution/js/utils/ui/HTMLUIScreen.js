var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTMLUIScreen = (function (_super) {
    __extends(HTMLUIScreen, _super);
    function HTMLUIScreen() {
        _super.call(this);
        this.scaleInfluenceOffset = false;
        this.assetAnchor.x = this.assetAnchor.y = this.positionAnchor.x = this.positionAnchor.y = 0;
        this.resizeMode = ResizeMode.SCREEN_SIZE;
        this.close();
    }
    HTMLUIScreen.prototype.open = function () {
        this.show();
    };
    HTMLUIScreen.prototype.close = function () {
        this.hide();
    };
    return HTMLUIScreen;
}(HTMLUIElement));
//# sourceMappingURL=HTMLUIScreen.js.map