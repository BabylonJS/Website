var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BackButton = (function (_super) {
    __extends(BackButton, _super);
    function BackButton() {
        _super.call(this);
        this.text = "Back";
        this.upColor = "#27ae60";
        this.overColor = "#2ecc71";
        this.downColor = "#058c40";
    }
    return BackButton;
}(ColoredTextualButton));
//# sourceMappingURL=BackButton.js.map