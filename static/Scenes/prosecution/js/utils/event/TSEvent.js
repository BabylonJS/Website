var TSEvent = (function () {
    function TSEvent(name) {
        this._name = name;
    }
    Object.defineProperty(TSEvent.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return TSEvent;
}());
//# sourceMappingURL=TSEvent.js.map