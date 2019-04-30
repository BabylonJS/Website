var TouchesInput = (function () {
    function TouchesInput() {
        this.eventDispatcher = new EventDispatcher();
        this.addTouchEvent(TouchEventType.TOUCH_START);
        this.addTouchEvent(TouchEventType.TOUCH_MOVE);
        this.addTouchEvent(TouchEventType.TOUCH_END_OUTSIDE);
        this.addTouchEvent(TouchEventType.TOUCH_END);
    }
    Object.defineProperty(TouchesInput.prototype, "hasTouch", {
        get: function () {
            return this._touches.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TouchesInput.prototype, "touches", {
        get: function () {
            return this._touches;
        },
        enumerable: true,
        configurable: true
    });
    TouchesInput.prototype.addTouchEvent = function (eventName) {
        window.addEventListener(eventName.toString(), function (event) {
            this._touches = event.touches;
            this.dispatchEvent(eventName, event);
        }.bind(this));
    };
    TouchesInput.prototype.dispatchEvent = function (eventName, event) {
        this.eventDispatcher.dispatchEvent(eventName.toString(), event);
    };
    TouchesInput.prototype.addEventListener = function (eventName, handler) {
        this.eventDispatcher.addEventListener(event.toString(), handler);
    };
    TouchesInput.prototype.removeEventListener = function (eventName, handler) {
        this.eventDispatcher.removeEventListener(event.toString(), handler);
    };
    return TouchesInput;
}());
//# sourceMappingURL=TouchesInput.js.map