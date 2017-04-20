var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTMLUIText = (function (_super) {
    __extends(HTMLUIText, _super);
    function HTMLUIText() {
        _super.call(this);
        this._fontSize = 14;
        this._fontFamily = "Arial";
        this._fontIsBold = false;
        this._fontIsItalic = false;
        this._fontAlignement = TextAlignements.LEFT;
        this.htmlAsset = document.createElement("p");
        this.onParentResize();
    }
    Object.defineProperty(HTMLUIText.prototype, "htmlText", {
        get: function () {
            return this.htmlAsset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontAlignement", {
        get: function () {
            return this._fontAlignement;
        },
        set: function (alignement) {
            this._fontAlignement = alignement;
            this.htmlText.style.textAlign = alignement.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "text", {
        get: function () {
            return this.htmlText.innerText;
        },
        set: function (text) {
            this.htmlText.innerText = text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (fontSize) {
            this._fontSize = fontSize;
            this.updateStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontFamily", {
        get: function () {
            return this._fontFamily;
        },
        set: function (fontFamily) {
            this._fontFamily = fontFamily;
            this.updateStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontColor", {
        get: function () {
            return this.htmlAsset.style.color;
        },
        set: function (fontColor) {
            HTMLUIElement.throwIfNotColor(fontColor);
            this.htmlAsset.style.color = fontColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontIsBold", {
        get: function () {
            return this._fontIsBold;
        },
        set: function (fontIsBold) {
            this._fontIsBold = fontIsBold;
            this.updateStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "fontIsItalic", {
        get: function () {
            return this._fontIsItalic;
        },
        set: function (fontIsItalic) {
            this._fontIsItalic = fontIsItalic;
            this.updateStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "height", {
        get: function () {
            var fontHeight = this.fontSize + 2;
            return (this._height > fontHeight) ? this._height : fontHeight;
        },
        set: function (height) {
            this._height = height;
            this.onParentResize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIText.prototype, "scaledFontSize", {
        get: function () {
            return this._fontSize * (this.scaledHeight / this.height);
        },
        enumerable: true,
        configurable: true
    });
    HTMLUIText.prototype.onParentResize = function () {
        this.updateStyle();
        _super.prototype.onParentResize.call(this);
    };
    HTMLUIText.prototype.updateStyle = function () {
        var style = this.scaledFontSize + "px " + this._fontFamily;
        if (this._fontIsBold) {
            style = "bold " + style;
        }
        if (this._fontIsItalic) {
            style = "italic " + style;
        }
        this.htmlAsset.style.font = style;
        this.updateAnchor();
    };
    HTMLUIText.prototype.updatePosition = function () {
        var parentWidth;
        var parentHeight;
        if (this.parent == null) {
            parentWidth = window.innerWidth;
            parentHeight = window.innerHeight;
        }
        else {
            parentWidth = this.parent.scaledWidth;
            parentHeight = this.parent.scaledHeight;
        }
        var scaledOffset = this.getScaledOffset();
        this.divContainer.style.left = (parentWidth * this.positionAnchor.x + scaledOffset.x) + "px";
        this.divContainer.style.top = (parentHeight * this.positionAnchor.y + scaledOffset.y) + "px";
    };
    return HTMLUIText;
}(HTMLUIElement));
//# sourceMappingURL=HTMLUIText.js.map