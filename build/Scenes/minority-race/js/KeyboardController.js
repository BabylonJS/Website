var KeyboardController = (function () {
    function KeyboardController() {
        var _this = this;
        this.isThrottlePressed = false;
        this.isBrakePressed = false;
        this.isSteerLeftPressed = false;
        this.isSteerRightPressed = false;
        this.isResetPressed = false;
        this.isBoostPressed = false;
        window.addEventListener("keydown", function (event) {
            _this.onKeyDown(event);
        });
        window.addEventListener("keyup", function (event) {
            _this.onKeyUp(event);
        });
    }
    KeyboardController.prototype.onKeyDown = function (evt) {
        switch (evt.keyCode) {
            case 90:
                this.isThrottlePressed = true;
                break;
            case 83:
                this.isBrakePressed = true;
                break;
            case 81:
                this.isSteerLeftPressed = true;
                break;
            case 68:
                this.isSteerRightPressed = true;
                break;
            case 46:
                this.isResetPressed = true;
                break;
            case 32:
                this.isBoostPressed = true;
                break;
        }
    };
    KeyboardController.prototype.onKeyUp = function (evt) {
        switch (evt.keyCode) {
            case 90:
                this.isThrottlePressed = false;
                break;
            case 83:
                this.isBrakePressed = false;
                break;
            case 81:
                this.isSteerLeftPressed = false;
                break;
            case 68:
                this.isSteerRightPressed = false;
                break;
            case 46:
                this.isResetPressed = false;
                break;
            case 32:
                this.isBoostPressed = false;
                break;
        }
    };
    return KeyboardController;
})();
//# sourceMappingURL=KeyboardController.js.map