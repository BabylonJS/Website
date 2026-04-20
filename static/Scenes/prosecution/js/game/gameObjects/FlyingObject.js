var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FlyingObject = (function (_super) {
    __extends(FlyingObject, _super);
    function FlyingObject(name) {
        if (name === void 0) { name = null; }
        _super.call(this, name);
        this.animationSpeed = 50;
        this.speed = 0.01;
        this.rotationSpeed = 0.1;
        this.transform = new BABYLON.Mesh('parent', Services.scene);
        this.box = BABYLON.Mesh.CreateBox('box', 2, Services.scene);
        this.box.scaling.x = 2;
        this.box.parent = this.transform;
        this.rightPoint = new BABYLON.Mesh('rightPoint', Services.scene);
        this.rightPoint.position.x += 10;
        this.rightPoint.parent = this.transform;
        this.transform.position = new BABYLON.Vector3(0, 75, 0);
        this.transform.parent = this;
        this.start();
        this.anim.parent = this.transform;
        this.rotationQuaternion = BABYLON.Quaternion.Identity();
        this.transform.rotationQuaternion = BABYLON.Quaternion.Identity();
    }
    Object.defineProperty(FlyingObject.prototype, "forward", {
        get: function () {
            return this.transform.calcMovePOV(0, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlyingObject.prototype, "right", {
        get: function () {
            return this.rightPoint.getAbsolutePosition().subtract(this.transform.getAbsolutePosition()).negate();
        },
        enumerable: true,
        configurable: true
    });
    FlyingObject.prototype.start = function () {
        this.setState(StateGraphic.DEFAULT_STATE);
        _super.prototype.start.call(this);
    };
    FlyingObject.prototype.move = function () {
        this.rotate(BABYLON.Vector3.Cross(this.transform.position.negate(), this.forward), (this.speed * Services.deltaTime));
    };
    FlyingObject.prototype.setOrientation = function () {
    };
    FlyingObject.prototype.doActionNormal = function () {
        this.setOrientation();
        this.move();
    };
    FlyingObject.prototype.spawn = function (lat, lon) {
    };
    FlyingObject.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.transform.dispose();
        this.box.dispose();
        this.rightPoint.dispose();
    };
    FlyingObject.prototype.enable = function () {
        this.setEnabled(true);
        this.rotationQuaternion = BABYLON.Quaternion.Identity();
        this.transform.rotationQuaternion = BABYLON.Quaternion.Identity();
    };
    FlyingObject.prototype.disable = function () {
        this.setModeVoid();
        this.setEnabled(false);
    };
    FlyingObject.prototype.explode = function (soundListener) {
        var explosion = new Explosion(this.box.getAbsolutePosition(), soundListener);
        this.destroy();
    };
    return FlyingObject;
}(StateGraphic));
//# sourceMappingURL=FlyingObject.js.map