var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ButtonEvent = (function (_super) {
    __extends(ButtonEvent, _super);
    function ButtonEvent(mouseEventType, button) {
        _super.call(this, mouseEventType.toString());
        this._mouseEventType = mouseEventType;
        this._targetedButton = button;
    }
    Object.defineProperty(ButtonEvent.prototype, "targetedButton", {
        get: function () {
            return this._targetedButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonEvent.prototype, "mouseEventType", {
        get: function () {
            return this._mouseEventType;
        },
        enumerable: true,
        configurable: true
    });
    return ButtonEvent;
}(TSEvent));
//# sourceMappingURL=ButtonEvent.js.map