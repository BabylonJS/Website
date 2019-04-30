var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EnemyCollideEvent = (function (_super) {
    __extends(EnemyCollideEvent, _super);
    function EnemyCollideEvent(name, enemy, targetCollided) {
        _super.call(this, name);
        this._enemy = enemy;
        this._targetCollided = targetCollided;
    }
    Object.defineProperty(EnemyCollideEvent.prototype, "enemy", {
        get: function () {
            return this._enemy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnemyCollideEvent.prototype, "targetCollided", {
        get: function () {
            return this._targetCollided;
        },
        enumerable: true,
        configurable: true
    });
    return EnemyCollideEvent;
}(TSEvent));
//# sourceMappingURL=EnemyCollideEvent.js.map