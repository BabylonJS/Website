var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTMLUIImage = (function (_super) {
    __extends(HTMLUIImage, _super);
    function HTMLUIImage() {
        _super.call(this);
        this.htmlAsset = document.createElement("img");
        this.onParentResize();
    }
    Object.defineProperty(HTMLUIImage.prototype, "imageUrl", {
        get: function () {
            return this._imageUrl;
        },
        set: function (url) {
            this._imageUrl = url;
            this.htmlImage.src = url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIImage.prototype, "htmlImage", {
        get: function () {
            return this.htmlAsset;
        },
        enumerable: true,
        configurable: true
    });
    return HTMLUIImage;
}(HTMLUIElement));
//# sourceMappingURL=HTMLUIImage.js.map