var KeyboardInput = (function () {
    function KeyboardInput() {
        this.keysDown = {};
        this.keyDownEventHandlers = [];
        this.keyUpEventHandlers = [];
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }
    KeyboardInput.prototype.isDown = function (key) {
        return this.keysDown[key];
    };
    KeyboardInput.prototype.isUp = function (key) {
        return !this.keysDown[key];
    };
    KeyboardInput.prototype.addKeyUpListener = function (handler) {
        this.keyUpEventHandlers.push(handler);
    };
    KeyboardInput.prototype.addKeyDownListener = function (handler) {
        this.keyDownEventHandlers.push(handler);
    };
    KeyboardInput.prototype.removeKeyUpListener = function (handler) {
        return ArrayTools.remove(this.keyUpEventHandlers, handler);
    };
    KeyboardInput.prototype.removeKeyDownListener = function (handler) {
        return ArrayTools.remove(this.keyDownEventHandlers, handler);
    };
    KeyboardInput.prototype.onKeyDown = function (event) {
        this.keysDown[event.keyCode] = true;
        this.dispatchKeyboardToHandlers(event.keyCode, this.keyDownEventHandlers);
    };
    KeyboardInput.prototype.onKeyUp = function (event) {
        this.keysDown[event.keyCode] = false;
        this.dispatchKeyboardToHandlers(event.keyCode, this.keyUpEventHandlers);
    };
    KeyboardInput.prototype.dispatchKeyboardToHandlers = function (keyboard, handlers) {
        for (var i = handlers.length - 1; i > -1; i--) {
            handlers[i](keyboard);
        }
    };
    return KeyboardInput;
}());
//# sourceMappingURL=KeyboardInput.js.map