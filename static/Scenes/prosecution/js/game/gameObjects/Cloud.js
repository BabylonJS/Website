var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Cloud = (function (_super) {
    __extends(Cloud, _super);
    function Cloud(name) {
        if (name === void 0) { name = null; }
        _super.call(this, name);
    }
    Cloud.prototype.start = function () {
        this.assetName = this.name;
        _super.prototype.start.call(this);
    };
    Cloud.prototype.spawn = function (lat, lon) {
        var sphereStartPosition = MathTools.sphericalToCartesian(lat, lon, 75);
        this.transform.position = sphereStartPosition;
        this.speed = MathTools.randomRange(0.1, 0.25);
        var Y = BABYLON.Axis.Y;
        var normStartPosition = BABYLON.Vector3.Normalize(sphereStartPosition);
        var tanStartPosition = BABYLON.Vector3.Cross(normStartPosition, Y).normalize();
        var tan2StartPosition = BABYLON.Vector3.Cross(normStartPosition, tanStartPosition).normalize();
        var endRotationEuler = BABYLON.Vector3.RotationFromAxis(tanStartPosition, normStartPosition, tan2StartPosition);
        var endRotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(endRotationEuler.y, endRotationEuler.x, endRotationEuler.z);
        this.transform.rotationQuaternion = endRotationQuaternion;
        this.setModeNormal();
    };
    return Cloud;
}(FlyingObject));
//# sourceMappingURL=Cloud.js.map