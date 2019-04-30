var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameAddMissileEvent = (function (_super) {
    __extends(GameAddMissileEvent, _super);
    function GameAddMissileEvent(game, missile) {
        _super.call(this, GameAddMissileEvent.EVENT_NAME, game);
        this._missile = missile;
    }
    Object.defineProperty(GameAddMissileEvent.prototype, "missile", {
        get: function () {
            return this._missile;
        },
        enumerable: true,
        configurable: true
    });
    GameAddMissileEvent.EVENT_NAME = "GameAddMissile";
    return GameAddMissileEvent;
}(GameEvent));
//# sourceMappingURL=GameAddMissileEvent.js.map