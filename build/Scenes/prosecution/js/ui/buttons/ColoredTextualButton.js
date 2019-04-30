var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColoredTextualButton = (function (_super) {
    __extends(ColoredTextualButton, _super);
    function ColoredTextualButton() {
        _super.call(this);
        this._upColor = "#d35400";
        this._overColor = "#e67e22";
        this._downColor = "#B13200";
        this.width = 400;
        this.height = 100;
        var text = new HTMLUIText();
        text.fontColor = "#FFFFFF";
        text.text = "TempoText";
        text.fontFamily = "Carter One";
        text.fontAlignement = TextAlignements.CENTER;
        text.fontSize = 50;
        text.width = this.width;
        text.offset.y -= 10;
        this._uiText = text;
        this.addChild(text);
        this.start();
    }
    ColoredTextualButton.prototype.setModeUp = function () {
        _super.prototype.setModeUp.call(this);
        this.color = this._upColor;
    };
    ColoredTextualButton.prototype.setModeOver = function () {
        _super.prototype.setModeOver.call(this);
        this.color = this._overColor;
    };
    ColoredTextualButton.prototype.setModeDown = function () {
        _super.prototype.setModeDown.call(this);
        this.color = this._downColor;
    };
    Object.defineProperty(ColoredTextualButton.prototype, "uiText", {
        get: function () {
            return this._uiText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColoredTextualButton.prototype, "text", {
        get: function () {
            return this.uiText.text;
        },
        set: function (text) {
            this.uiText.text = text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColoredTextualButton.prototype, "upColor", {
        get: function () {
            return this._upColor;
        },
        set: function (color) {
            HTMLUIElement.throwIfNotColor(color);
            this._upColor = color;
            if (this._state == ButtonState.UP) {
                this.color = this._upColor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColoredTextualButton.prototype, "overColor", {
        get: function () {
            return this._overColor;
        },
        set: function (color) {
            HTMLUIElement.throwIfNotColor(color);
            this._overColor = color;
            if (this._state == ButtonState.OVER) {
                this.color = this._overColor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColoredTextualButton.prototype, "downColor", {
        get: function () {
            return this._downColor;
        },
        set: function (color) {
            HTMLUIElement.throwIfNotColor(color);
            this._downColor = color;
            if (this._state == ButtonState.DOWN) {
                this.color = this._downColor;
            }
        },
        enumerable: true,
        configurable: true
    });
    return ColoredTextualButton;
}(HTMLButton));
//# sourceMappingURL=ColoredTextualButton.js.map