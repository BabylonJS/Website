var EventDispatcher = (function () {
    function EventDispatcher() {
        this.namesToHandlers = {};
    }
    EventDispatcher.prototype.addEventListener = function (eventName, handler) {
        var handlers = this.namesToHandlers[eventName];
        if (!handlers) {
            handlers = this.namesToHandlers[eventName] = [];
        }
        handlers.push(handler);
    };
    EventDispatcher.prototype.removeEventListener = function (eventName, handler) {
        var handlers = this.namesToHandlers[eventName];
        if (!handlers) {
            return false;
        }
        return ArrayTools.remove(handlers, handler);
    };
    EventDispatcher.prototype.removeAllListeners = function (eventName) {
        if (!eventName) {
            this.namesToHandlers = {};
        }
        else {
            this.namesToHandlers[eventName] = null;
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (eventName, event) {
        var handlers = this.namesToHandlers[eventName];
        if (handlers) {
            for (var i = handlers.length - 1; i > -1; i--) {
                handlers[i](event);
            }
        }
    };
    EventDispatcher.prototype.hasHandlers = function (eventName) {
        var handlers = this.namesToHandlers[eventName];
        if (handlers) {
            return handlers.length > 0;
        }
        return false;
    };
    return EventDispatcher;
}());
//# sourceMappingURL=EventDispatcher.js.map