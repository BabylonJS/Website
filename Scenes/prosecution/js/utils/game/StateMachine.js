var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StateMachine = (function (_super) {
    __extends(StateMachine, _super);
    function StateMachine(name) {
        if (name === void 0) { name = null; }
        _super.call(this, name);
        this.setModeVoid();
        Services.updateBroadcaster.register(this);
    }
    StateMachine.prototype.update = function () {
        this.doAction();
    };
    StateMachine.prototype.setModeVoid = function () {
        this.doAction = StateMachine.doActionVoid;
    };
    StateMachine.prototype.setModeNormal = function () {
        this.doAction = this.doActionNormal;
    };
    StateMachine.prototype.doActionNormal = function () {
    };
    StateMachine.doActionVoid = function () {
    };
    StateMachine.prototype.start = function () {
        _super.prototype.start.call(this);
        this.setModeNormal();
    };
    StateMachine.prototype.destroy = function () {
        this.setModeVoid();
        Services.updateBroadcaster.unregister(this);
        _super.prototype.destroy.call(this);
    };
    return StateMachine;
}(GameObject));
//# sourceMappingURL=StateMachine.js.map