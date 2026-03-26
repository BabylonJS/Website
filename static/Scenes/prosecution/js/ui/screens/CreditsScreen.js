var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CreditsScreen = (function (_super) {
    __extends(CreditsScreen, _super);
    function CreditsScreen() {
        _super.call(this);
        var titleText = new HTMLUIText();
        var author1 = new HTMLUIText();
        var author2 = new HTMLUIText();
        var author3 = new HTMLUIText();
        author3.fontAlignement = author2.fontAlignement = author1.fontAlignement = titleText.fontAlignement = TextAlignements.CENTER;
        titleText.fontColor = "#FFFFFF";
        titleText.text = "Credits";
        titleText.fontFamily = "Sigmar One";
        titleText.fontSize = 100;
        titleText.positionAnchor.y = 0.58;
        titleText.width = 1000;
        author3.fontColor = author2.fontColor = author1.fontColor = "#BBBBBB";
        author3.fontFamily = author2.fontFamily = author1.fontFamily = "Carter One";
        author3.fontSize = author2.fontSize = author1.fontSize = 50;
        author3.width = author2.width = author1.width = 1000;
        author1.text = "Chadi HUSSER";
        author2.text = "Théo SABATTIÉ";
        author3.text = "Aristide HERSANT-PRÉVERT";
        author1.positionAnchor.y = 0.68;
        author2.positionAnchor.y = 0.73;
        author3.positionAnchor.y = 0.78;
        var backButton = new BackButton();
        backButton.positionAnchor.y = 0.9;
        backButton.addEventListener(MouseEventType.CLICK, this.onBackButtonClicked.bind(this));
        this.addChild(titleText);
        this.addChild(backButton);
        this.addChild(author1);
        this.addChild(author2);
        this.addChild(author3);
    }
    CreditsScreen.prototype.onBackButtonClicked = function (event) {
        SoundManager.playSound("click", false, null, true);
        Services.screensManager.openOnlyScreen(new TitleScreen());
        this.destroy();
    };
    return CreditsScreen;
}(HTMLUIScreen));
//# sourceMappingURL=CreditsScreen.js.map