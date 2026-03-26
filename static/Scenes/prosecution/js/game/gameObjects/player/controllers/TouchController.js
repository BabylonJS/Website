var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TouchController = (function (_super) {
    __extends(TouchController, _super);
    function TouchController() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TouchController.prototype, "left", {
        get: function () {
            return Services.touchesInput.hasTouch && Services.touchesInput.touches[0].clientX < window.innerWidth / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TouchController.prototype, "right", {
        get: function () {
            return Services.touchesInput.hasTouch && Services.touchesInput.touches[0].clientX > window.innerWidth / 2;
        },
        enumerable: true,
        configurable: true
    });
    return TouchController;
}(Controller));
//# sourceMappingURL=TouchController.js.map