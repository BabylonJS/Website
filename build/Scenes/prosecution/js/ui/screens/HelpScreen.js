var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HelpScreen = (function (_super) {
    __extends(HelpScreen, _super);
    function HelpScreen() {
        _super.call(this);
        var helpText = new HTMLUIText();
        helpText.fontColor = "#FFFFFF";
        helpText.text = "Survive as long as you can!\n";
        helpText.text += "Dodge mines and missiles\n";
        if (Device.isMobile) {
            this.addMobileControlHelpText(helpText);
        }
        else {
            this.addDesktopControlHelpText(helpText);
        }
        helpText.text += "Missile explodes on collision with a mine and gives you a higher score!";
        helpText.fontAlignement = TextAlignements.CENTER;
        helpText.fontFamily = "Carter One";
        helpText.fontSize = 46;
        helpText.positionAnchor.y = 0.7;
        helpText.width = 1000;
        helpText.height = 450;
        var playButton = new PlayButton();
        playButton.positionAnchor.y = 0.9;
        playButton.addEventListener(MouseEventType.CLICK, this.onPlayButtonClicked.bind(this));
        this.addChild(helpText);
        this.addChild(playButton);
    }
    HelpScreen.prototype.addMobileControlHelpText = function (helpText) {
        helpText.text += "Touch the right side of your screen\n";
        helpText.text += "to turn right and the left side to turn left\n";
    };
    HelpScreen.prototype.addDesktopControlHelpText = function (helpText) {
        helpText.text += "Turn left with \"Q\" or \"Left Arrow \"\n";
        helpText.text += "Turn righ with \"D\" or \"Right Arrow\"\n";
    };
    HelpScreen.prototype.onPlayButtonClicked = function (event) {
        SoundManager.playSound("click", false, null, true);
        Services.screensManager.closeAllScreens();
        new Game();
        this.destroy();
    };
    return HelpScreen;
}(HTMLUIScreen));
//# sourceMappingURL=HelpScreen.js.map