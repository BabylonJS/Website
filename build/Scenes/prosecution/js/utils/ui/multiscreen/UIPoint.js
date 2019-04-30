var UIPoint = (function () {
    function UIPoint(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.eventDispatcher = new EventDispatcher();
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(UIPoint.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            this._x = x;
            this.eventDispatcher.dispatchEvent(UIPoint.POSITION_UPDATE_EVENT, new TSEvent(UIPoint.POSITION_UPDATE_EVENT));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIPoint.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            this._y = y;
            this.eventDispatcher.dispatchEvent(UIPoint.POSITION_UPDATE_EVENT, new TSEvent(UIPoint.POSITION_UPDATE_EVENT));
        },
        enumerable: true,
        configurable: true
    });
    UIPoint.prototype.addPointUpdateListener = function (handler) {
        this.eventDispatcher.addEventListener(UIPoint.POSITION_UPDATE_EVENT, handler);
    };
    UIPoint.prototype.removePointUpdateListener = function (handler) {
        this.eventDispatcher.removeEventListener(UIPoint.POSITION_UPDATE_EVENT, handler);
    };
    UIPoint.prototype.removeAllListeners = function () {
        this.eventDispatcher.removeAllListeners();
    };
    UIPoint.POSITION_UPDATE_EVENT = "positionUpdate";
    return UIPoint;
}());
//# sourceMappingURL=UIPoint.js.map