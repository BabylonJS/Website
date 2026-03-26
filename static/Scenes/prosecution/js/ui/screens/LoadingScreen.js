var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LoadingScreen = (function (_super) {
    __extends(LoadingScreen, _super);
    function LoadingScreen() {
        _super.call(this);
        // hack to be in front of babylon div loader
        this.divContainer.style.zIndex = "1";
        var progressText = new HTMLUIText();
        progressText.fontColor = "#BBBBBB";
        progressText.fontAlignement = TextAlignements.CENTER;
        progressText.fontFamily = "Carter One";
        progressText.fontSize = 50;
        progressText.positionAnchor.y = 0.75;
        progressText.width = 50;
        this.addChild(progressText);
        this.progressText = progressText;
        this.setRatioProgress(0);
    }
    LoadingScreen.prototype.setRatioProgress = function (progressRatio) {
        this.progressText.text = Math.round(progressRatio * 100) + "%";
    };
    return LoadingScreen;
}(HTMLUIScreen));
//# sourceMappingURL=LoadingScreen.js.map