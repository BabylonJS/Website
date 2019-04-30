var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HUD = (function (_super) {
    __extends(HUD, _super);
    function HUD() {
        _super.call(this);
        var margin = 20;
        var timerImg = new HTMLUIImage();
        var scoreImg = new HTMLUIImage();
        var timerText = new HTMLUIText();
        var scoreText = new HTMLUIText();
        timerImg.imageUrl = "assets/chrono.png";
        scoreImg.imageUrl = "assets/winner.png";
        timerImg.offset.y = margin;
        timerImg.offset.x = -margin;
        timerImg.width = timerImg.height = scoreImg.width = scoreImg.height = 100;
        timerImg.assetAnchor.x = timerImg.positionAnchor.x = scoreImg.assetAnchor.x = scoreImg.positionAnchor.x = 1;
        timerImg.assetAnchor.y = timerImg.positionAnchor.y = scoreImg.assetAnchor.y = scoreImg.positionAnchor.y = 0;
        scoreImg.offset.y = timerImg.offset.y + timerImg.height + margin;
        scoreImg.offset.x = timerImg.offset.x;
        timerText.text = "00:00";
        scoreText.text = "0";
        timerText.offset.y = timerImg.offset.y + timerImg.height / 2;
        timerText.offset.x = timerImg.offset.x - timerImg.width - margin;
        scoreText.offset.y = scoreImg.offset.y + scoreImg.height / 2;
        scoreText.offset.x = scoreImg.offset.x - scoreImg.width - margin;
        timerText.fontColor = scoreText.fontColor = "#FFFFFF";
        timerText.fontAlignement = scoreText.fontAlignement = TextAlignements.RIGHT;
        timerText.fontFamily = scoreText.fontFamily = "Carter One";
        timerText.fontSize = scoreText.fontSize = 65;
        timerText.width = scoreText.width = 1000;
        timerText.assetAnchor.x = scoreText.assetAnchor.x = 1;
        timerText.positionAnchor.y = scoreText.positionAnchor.y = 0;
        timerText.positionAnchor.x = scoreText.positionAnchor.x = 1;
        scoreText.offset.y -= 15;
        timerText.offset.y -= 15;
        this.addChild(timerText);
        this.addChild(scoreText);
        this.addChild(timerImg);
        this.addChild(scoreImg);
        this.timerText = timerText;
        this.scoreText = scoreText;
    }
    HUD.prototype.setTimer = function (timerInSecond) {
        var seconds = timerInSecond % 60;
        this.timerText.text = Math.floor(timerInSecond / 60) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
    };
    HUD.prototype.setScore = function (score) {
        this.scoreText.text = score.toString();
    };
    return HUD;
}(HTMLUIScreen));
//# sourceMappingURL=HUD.js.map