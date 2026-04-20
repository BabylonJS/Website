var GamepadController = (function () {
    function GamepadController() {
        this.rightTrigger = 0;
        this.leftTrigger = 0;
        this.directionX = 0;
        this.boost = false;
        this.isGamepadConnected = false;
        this.gamepads = new BABYLON.Gamepads(this.gamepadConnected.bind(this));
    }
    GamepadController.prototype.gamepadConnected = function (gamepad) {
        var _this = this;
        console.log("[INFO] Nouvelle manette detectee.");
        if (gamepad instanceof BABYLON.Xbox360Pad) {
            this.isGamepadConnected = true;
            this.xbox360pad = gamepad;
            this.xbox360pad.onbuttondown(function (button) {
                switch (button) {
                    case 0:
                        _this.boost = true;
                        break;
                    case 2:
                        _this.boost = true;
                        break;
                }
            });
            this.xbox360pad.onbuttonup(function (button) {
                switch (button) {
                    case 0:
                        _this.boost = false;
                        break;
                    case 2:
                        _this.boost = false;
                        break;
                }
            });
            console.log("[INFO] Manette configuree avec succes.");
        }
        else {
            console.log("[INFO] Manette non utilisable, seules les manettes Xbox 360 (ou detectees comme tels) sont compatibles.");
        }
    };
    GamepadController.prototype.update = function () {
        if (this.isGamepadConnected) {
            this.directionX = this.xbox360pad.leftStick.x;
            this.rightTrigger = this.xbox360pad.rightTrigger;
            this.leftTrigger = this.xbox360pad.leftTrigger;
        }
    };
    return GamepadController;
})();
//# sourceMappingURL=GamepadController.js.map