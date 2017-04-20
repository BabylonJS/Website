var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(eventName, game) {
        _super.call(this, eventName);
        this._game = game;
    }
    Object.defineProperty(GameEvent.prototype, "game", {
        get: function () {
            return this._game;
        },
        enumerable: true,
        configurable: true
    });
    return GameEvent;
}(TSEvent));
//# sourceMappingURL=GameEvent.js.map