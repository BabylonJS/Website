var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UIAnchor = (function (_super) {
    __extends(UIAnchor, _super);
    function UIAnchor(x, y) {
        if (x === void 0) { x = 0.5; }
        if (y === void 0) { y = 0.5; }
        _super.call(this, x, y);
    }
    Object.defineProperty(UIAnchor.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            UIAnchor.throwIfNumberIsNotRatio(x);
            this._x = x;
            this.eventDispatcher.dispatchEvent(UIPoint.POSITION_UPDATE_EVENT, new TSEvent(UIPoint.POSITION_UPDATE_EVENT));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIAnchor.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            UIAnchor.throwIfNumberIsNotRatio(y);
            this._y = y;
            this.eventDispatcher.dispatchEvent(UIPoint.POSITION_UPDATE_EVENT, new TSEvent(UIPoint.POSITION_UPDATE_EVENT));
        },
        enumerable: true,
        configurable: true
    });
    UIAnchor.throwIfNumberIsNotRatio = function (number) {
        if (number > 1 || number < 0) {
            throw number + " is not a ratio";
        }
    };
    return UIAnchor;
}(UIPoint));
//# sourceMappingURL=UIAnchor.js.map