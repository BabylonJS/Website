var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var KeyboardController = (function (_super) {
    __extends(KeyboardController, _super);
    function KeyboardController() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(KeyboardController.prototype, "left", {
        get: function () {
            return Services.keyboardInput.isDown(Keyboard.Q) || Services.keyboardInput.isDown(Keyboard.LEFT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyboardController.prototype, "right", {
        get: function () {
            return Services.keyboardInput.isDown(Keyboard.D) || Services.keyboardInput.isDown(Keyboard.RIGHT);
        },
        enumerable: true,
        configurable: true
    });
    return KeyboardController;
}(Controller));
//# sourceMappingURL=KeyboardController.js.map