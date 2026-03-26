var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.rotationAcceleration = 0;
        this.maxRotationSpeed = 0.05;
        this.maxRotationAcceleration = 1;
        this.maxRollRotation = Math.PI / 3;
        this.friction = 0.70;
        this.anim.getChildMeshes().forEach(function (mesh) {
            if (mesh.name == "Airplane_clone.Airplane.Helice") {
                this.helix = mesh;
            }
        }.bind(this));
        this.controller = (Device.isMobile) ? new TouchController() : new KeyboardController();
        this.speed = 0.7;
        this.animationSpeed = 400;
        this.rotationSpeed = 0;
        this.update();
        this.rotationQuaternion = BABYLON.Quaternion.Identity();
        this.transform.rotationQuaternion = BABYLON.Quaternion.Identity();
    }
    Player.prototype.start = function () {
        this.assetName = "Airplane";
        _super.prototype.start.call(this);
        this.setModeSpawn();
    };
    Player.prototype.spawn = function (lat, lon) {
        this.setModeSpawn();
        var sphereStartPosition = new BABYLON.Vector3(0, 60, 0);
        var sphereEndPosition = new BABYLON.Vector3(0, 75, 0);
        this.transform.position = sphereStartPosition;
        var startScale = new BABYLON.Vector3(.3, .3, .3);
        var endScale = new BABYLON.Vector3(1, 1, 1);
        var startRotation = BABYLON.Vector3.Zero();
        var midRotation = new BABYLON.Vector3(-Math.PI / 4, 0, 0);
        var endRotation = BABYLON.Vector3.Zero();
        var pivotStartRotation = BABYLON.Quaternion.Identity();
        var pivotEndRotation = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Cross(this.transform.position.negate(), this.forward), this.speed * 2);
        var easingFunctionIn = new BABYLON.ExponentialEase();
        easingFunctionIn.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        var easingFunctionInOut = new BABYLON.SineEase();
        easingFunctionInOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        var transformTranslationAnimation = new BABYLON.Animation('transformTranslation', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        transformTranslationAnimation.setEasingFunction(easingFunctionIn);
        var transformRotationAnimation = new BABYLON.Animation('transformRotation', 'rotation', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        transformRotationAnimation.setEasingFunction(easingFunctionInOut);
        var pivotRotationAnimation = new BABYLON.Animation('pivotRotation', 'rotationQuaternion', 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        pivotRotationAnimation.setEasingFunction(easingFunctionIn);
        var scaleAnimation = new BABYLON.Animation('scale', 'scaling', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var transformTranslationKeys = [];
        var transformRotationKeys = [];
        var pivotRotationKeys = [];
        var scaleKeys = [];
        var animationFrame = this.animationSpeed;
        transformTranslationKeys.push({
            frame: 0,
            value: sphereStartPosition
        });
        transformTranslationKeys.push({
            frame: animationFrame * 0.8,
            value: sphereStartPosition
        });
        transformTranslationKeys.push({
            frame: animationFrame,
            value: sphereEndPosition
        });
        transformTranslationAnimation.setKeys(transformTranslationKeys);
        transformRotationKeys.push({
            frame: 0,
            value: startRotation
        });
        transformRotationKeys.push({
            frame: animationFrame * 0.4,
            value: startRotation
        });
        transformRotationKeys.push({
            frame: animationFrame * 0.7,
            value: midRotation
        });
        transformRotationKeys.push({
            frame: animationFrame,
            value: endRotation
        });
        transformRotationAnimation.setKeys(transformRotationKeys);
        pivotRotationKeys.push({
            frame: 0,
            value: pivotStartRotation
        });
        pivotRotationKeys.push({
            frame: animationFrame * 0.3,
            value: pivotStartRotation
        });
        pivotRotationKeys.push({
            frame: animationFrame,
            value: pivotEndRotation
        });
        pivotRotationAnimation.setKeys(pivotRotationKeys);
        scaleKeys.push({
            frame: 0,
            value: startScale
        });
        scaleKeys.push({
            frame: animationFrame * 0.6,
            value: startScale
        });
        scaleKeys.push({
            frame: animationFrame,
            value: endScale
        });
        scaleAnimation.setKeys(scaleKeys);
        this.animations.push(pivotRotationAnimation);
        this.anim.animations.push(scaleAnimation);
        Services.scene.beginAnimation(this, 0, animationFrame, false);
        Services.scene.beginDirectAnimation(this.transform, [transformRotationAnimation, transformTranslationAnimation, scaleAnimation], 0, animationFrame, false, 1, function () {
            this.setModeNormal();
        }.bind(this));
    };
    Player.prototype.doActionSpawn = function () {
        this.helix.rotation.y += (12 * Services.deltaTime);
    };
    Player.prototype.setModeSpawn = function () {
        this.doAction = this.doActionSpawn;
    };
    Player.prototype.doActionNormal = function () {
        _super.prototype.doActionNormal.call(this);
        this.helix.rotation.y += (8 * Services.deltaTime);
    };
    Player.prototype.setOrientation = function () {
        if (this.controller.right && !this.controller.left) {
            this.rotationAcceleration = this.maxRotationAcceleration;
        }
        else if (this.controller.left && !this.controller.right) {
            this.rotationAcceleration = -this.maxRotationAcceleration;
        }
        else {
            this.rotationAcceleration = 0;
        }
        this.rotationSpeed += (this.rotationAcceleration * Services.deltaTime);
        this.rotationSpeed *= this.friction;
        this.rotationSpeed = (this.rotationSpeed < 0 ? -1 : 1) * Math.min(Math.abs(this.rotationSpeed), this.maxRotationSpeed);
        this.transform.rotation.y += this.rotationSpeed;
        this.transform.rotation.z = -MathTools.floatLerp(0, this.maxRollRotation, MathTools.clamp(this.rotationSpeed / this.maxRotationSpeed, -0.7, 0.7));
    };
    Player.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return Player;
}(FlyingObject));
//# sourceMappingURL=Player.js.map