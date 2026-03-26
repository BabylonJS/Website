var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TitleScreen = (function (_super) {
    __extends(TitleScreen, _super);
    function TitleScreen() {
        _super.call(this);
        var titleText = new HTMLUIText();
        titleText.fontColor = "#FFFFFF";
        titleText.text = "Prosecution";
        titleText.fontAlignement = TextAlignements.CENTER;
        titleText.fontFamily = "Sigmar One";
        titleText.fontSize = 100;
        titleText.positionAnchor.y = 0.58;
        titleText.width = 1000;
        var bestScore = Game.getBestScore();
        if (bestScore > 0) {
            var scoreText = new HTMLUIText();
            scoreText.fontColor = "#BBBBBB";
            scoreText.text = "Best score : " + Game.getBestScore();
            scoreText.fontAlignement = TextAlignements.CENTER;
            scoreText.fontFamily = "Carter One";
            scoreText.fontSize = 50;
            scoreText.positionAnchor.y = 0.735;
            scoreText.width = 500;
            this.addChild(scoreText);
        }
        else {
            titleText.positionAnchor.y = 0.65;
        }
        var playButton = new PlayButton();
        playButton.positionAnchor.y = 0.9;
        playButton.offset.x -= 220;
        playButton.addEventListener(MouseEventType.CLICK, this.onPlayButtonClicked.bind(this));
        var creditsButton = new CreditsButton();
        creditsButton.positionAnchor.y = 0.9;
        creditsButton.offset.x += 220;
        creditsButton.addEventListener(MouseEventType.CLICK, this.onCreditsButtonClicked.bind(this));
        this.addChild(titleText);
        this.addChild(playButton);
        this.addChild(creditsButton);
        this.titleText = titleText;
        this.playButton = playButton;
    }
    TitleScreen.prototype.onCreditsButtonClicked = function (event) {
        SoundManager.playSound("click", false, null, true);
        Services.screensManager.openOnlyScreen(new CreditsScreen());
        this.destroy();
    };
    TitleScreen.prototype.onPlayButtonClicked = function (event) {
        SoundManager.playSound("click", false, null, true);
        if (Game.getBestScore() < 7) {
            Services.screensManager.openOnlyScreen(new HelpScreen());
        }
        else {
            Services.screensManager.closeAllScreens();
            new Game();
        }
        this.destroy();
    };
    return TitleScreen;
}(HTMLUIScreen));
//# sourceMappingURL=TitleScreen.js.map