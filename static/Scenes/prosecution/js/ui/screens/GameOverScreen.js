var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameOverScreen = (function (_super) {
    __extends(GameOverScreen, _super);
    function GameOverScreen(gameScore, timer, bestScore) {
        _super.call(this);
        var margin = 20;
        var titleText = new HTMLUIText();
        var timerText = new HTMLUIText();
        var scoreText = new HTMLUIText();
        var bestScoreText = new HTMLUIText();
        var replayButton = new PlayButton();
        var background = new HTMLUIElement();
        var timerImg = new HTMLUIImage();
        var scoreImg = new HTMLUIImage();
        timerImg.imageUrl = "assets/chrono.png";
        scoreImg.imageUrl = "assets/winner.png";
        timerImg.width = timerImg.height = scoreImg.width = scoreImg.height = 100;
        timerImg.assetAnchor.x = scoreImg.assetAnchor.x = 0;
        timerImg.offset.x = scoreImg.offset.x = margin;
        bestScoreText.fontAlignement = titleText.fontAlignement = TextAlignements.CENTER;
        titleText.fontColor = "#FFFFFF";
        background.color = "rgba(0, 0, 0, 0.75)";
        background.width = 1024;
        background.height = 683;
        titleText.text = "Game Over";
        titleText.fontFamily = "Sigmar One";
        titleText.fontSize = 100;
        titleText.positionAnchor.y = 0.1;
        titleText.width = 1000;
        bestScoreText.fontColor = scoreText.fontColor = timerText.fontColor = "#BBBBBB";
        bestScoreText.fontFamily = scoreText.fontFamily = timerText.fontFamily = "Carter One";
        bestScoreText.fontSize = scoreText.fontSize = timerText.fontSize = 50;
        bestScoreText.width = scoreText.width = timerText.width = 500;
        scoreText.offset.x = timerText.offset.x = -margin / 2;
        scoreText.positionAnchor.y = timerText.positionAnchor.y = 0.5;
        scoreText.fontAlignement = timerText.fontAlignement = TextAlignements.RIGHT;
        scoreText.assetAnchor.x = timerText.assetAnchor.x = 1;
        scoreText.height = timerText.height = 75;
        timerText.offset.y = timerImg.offset.y = -110;
        scoreImg.offset.y = scoreText.offset.y = timerImg.offset.y + timerImg.height * timerImg.assetAnchor.y + margin + scoreImg.height * scoreImg.assetAnchor.y;
        bestScoreText.offset.y = scoreText.offset.y + scoreImg.height * scoreImg.assetAnchor.y + 40;
        var seconds = timer % 60;
        var time = Math.floor(timer / 60) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
        scoreText.text = gameScore.toString();
        timerText.text = time;
        bestScoreText.text = "(BEST : " + bestScore + ")";
        replayButton.positionAnchor.y = 0.87;
        replayButton.addEventListener(MouseEventType.CLICK, this.onReplayButtonClicked.bind(this));
        replayButton.text = "Play again";
        this.addChild(background);
        background.addChild(replayButton);
        background.addChild(scoreText);
        background.addChild(timerText);
        background.addChild(bestScoreText);
        background.addChild(titleText);
        background.addChild(timerImg);
        background.addChild(scoreImg);
    }
    GameOverScreen.prototype.onReplayButtonClicked = function (event) {
        SoundManager.playSound("click", false, null, true);
        Services.screensManager.closeAllScreens();
        new Game();
        this.destroy();
    };
    return GameOverScreen;
}(HTMLUIScreen));
//# sourceMappingURL=GameOverScreen.js.map