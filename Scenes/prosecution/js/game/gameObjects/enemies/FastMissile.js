var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FastMissile = (function (_super) {
    __extends(FastMissile, _super);
    function FastMissile(soundListener) {
        _super.call(this, soundListener);
        this.animationSpeed = 45;
        this.speed = 0.9;
        this.rotationSpeed = 0.02;
    }
    FastMissile.prototype.getSoundName = function () {
        return "redrocket_loop";
    };
    return FastMissile;
}(Missile));
//# sourceMappingURL=FastMissile.js.map