var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(followTarget) {
        _super.call(this, followTarget);
        this.rotationMargin = 0.025;
        this.speed = 0.75;
        this.rotationSpeed = 0.03;
        this.followTarget = followTarget;
        this.animationSpeed = 50;
        this.reactor = new BABYLON.Mesh('reactor', Services.scene);
        this.reactor.position.z -= 4;
        this.reactor.position.y -= 0.13;
        this.reactor.parent = this.transform;
        this.initParticleEmitter();
    }
    Missile.prototype.getSoundName = function () {
        return "orangerocket_loop";
    };
    Missile.prototype.setOrientation = function () {
        var MP = this.followTarget.getAbsolutePosition().subtract(this.transform.getAbsolutePosition());
        var dotProduct = BABYLON.Vector3.Dot(MP, this.right);
        if (dotProduct >= this.rotationMargin) {
            //this.transform.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationAxis(this.transform.calcMovePOV(0, 1, 0), this.rotationSpeed));
            this.transform.rotation.y = -this.rotationSpeed;
        }
        else if (dotProduct <= this.rotationMargin) {
            //this.transform.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationAxis(this.transform.calcMovePOV(0, -1, 0), this.rotationSpeed));
            this.transform.rotation.y = this.rotationSpeed;
        }
    };
    Missile.prototype.doActionNormal = function () {
        _super.prototype.doActionNormal.call(this);
        this.checkCollision();
    };
    Missile.prototype.spawn = function (lat, lon) {
        var sphereStartPosition = MathTools.sphericalToCartesian(lat, lon, 50);
        var sphereEndPosition = MathTools.sphericalToCartesian(lat, lon, this.transform.getAbsolutePosition().y);
        this.transform.position = BABYLON.Vector3.Zero();
        var Y = BABYLON.Axis.Y;
        var normStartPosition = BABYLON.Vector3.Normalize(sphereStartPosition);
        var tanStartPosition = BABYLON.Vector3.Cross(normStartPosition, Y).normalize();
        var tan2StartPosition = BABYLON.Vector3.Cross(normStartPosition, tanStartPosition).normalize();
        var startRotationEuler = BABYLON.Vector3.RotationFromAxis(tan2StartPosition, tanStartPosition, normStartPosition);
        var endRotationEuler = BABYLON.Vector3.RotationFromAxis(tanStartPosition, normStartPosition, tan2StartPosition);
        var startRotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(startRotationEuler.y, startRotationEuler.x, startRotationEuler.z);
        var endRotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(endRotationEuler.y, endRotationEuler.x, endRotationEuler.z);
        endRotationQuaternion = startRotationQuaternion.multiply(BABYLON.Quaternion.RotationAxis(this.transform.calcMovePOV(1, 0, 0), Math.PI / 2));
        this.transform.rotationQuaternion = startRotationQuaternion;
        var pivotStartRotation = BABYLON.Quaternion.Identity();
        var pivotEndRotation = BABYLON.Quaternion.RotationAxis(this.transform.calcMovePOV(1, 0, 0), 0.25);
        var easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        var transformTranslationAnimation = new BABYLON.Animation('transformTranslation', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        transformTranslationAnimation.setEasingFunction(easingFunction);
        var transformRotationAnimation = new BABYLON.Animation('transformRotation', 'rotationQuaternion', 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        transformRotationAnimation.setEasingFunction(easingFunction);
        var pivotRotationAnimation = new BABYLON.Animation('pivotRotation', 'rotationQuaternion', 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        pivotRotationAnimation.setEasingFunction(easingFunction);
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
            frame: animationFrame,
            value: sphereEndPosition
        });
        transformTranslationAnimation.setKeys(transformTranslationKeys);
        transformRotationKeys.push({
            frame: 0,
            value: startRotationQuaternion
        });
        transformRotationKeys.push({
            frame: animationFrame * 0.1,
            value: startRotationQuaternion
        });
        transformRotationKeys.push({
            frame: animationFrame,
            value: endRotationQuaternion
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
            value: new BABYLON.Vector3(0, 0, 0)
        });
        scaleKeys.push({
            frame: animationFrame * 0.7,
            value: new BABYLON.Vector3(1, 1, 1)
        });
        scaleKeys.push({
            frame: animationFrame,
            value: new BABYLON.Vector3(1, 1, 1)
        });
        scaleAnimation.setKeys(scaleKeys);
        this.animations.push(pivotRotationAnimation);
        this.anim.animations.push(scaleAnimation);
        Services.scene.beginAnimation(this, 0, animationFrame, false);
        var that = this;
        Services.scene.beginDirectAnimation(this.transform, [transformRotationAnimation, transformTranslationAnimation, scaleAnimation], 0, animationFrame, false, 1, function () {
            this.setModeNormal();
        }.bind(this));
    };
    Missile.prototype.initParticleEmitter = function () {
        this.fireParticleSystem = new BABYLON.ParticleSystem('particleSystem', 2000, Services.scene);
        this.fireParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        this.fireParticleSystem.emitter = this.reactor;
        this.fireParticleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5);
        this.fireParticleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5);
        this.fireParticleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        this.fireParticleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        this.fireParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        this.fireParticleSystem.minSize = 1;
        this.fireParticleSystem.maxSize = 5;
        this.fireParticleSystem.minLifeTime = 0.05;
        this.fireParticleSystem.maxLifeTime = 0.2;
        this.fireParticleSystem.emitRate = 600;
        this.fireParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.fireParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        this.fireParticleSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
        this.fireParticleSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
        this.fireParticleSystem.minAngularSpeed = 0;
        this.fireParticleSystem.maxAngularSpeed = Math.PI;
        this.fireParticleSystem.minEmitPower = 1;
        this.fireParticleSystem.maxEmitPower = 3;
        this.fireParticleSystem.updateSpeed = 0.007;
        this.smokeParticleSystem = new BABYLON.ParticleSystem("particles", 1000, Services.scene);
        this.smokeParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        this.smokeParticleSystem.emitter = this.reactor;
        this.smokeParticleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5);
        this.smokeParticleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5);
        this.smokeParticleSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        this.smokeParticleSystem.minSize = 2;
        this.smokeParticleSystem.maxSize = 5;
        this.smokeParticleSystem.minLifeTime = 0.15;
        this.smokeParticleSystem.maxLifeTime = 0.3;
        this.smokeParticleSystem.emitRate = 350;
        this.smokeParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.smokeParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        this.smokeParticleSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
        this.smokeParticleSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);
        this.smokeParticleSystem.minAngularSpeed = 0;
        this.smokeParticleSystem.maxAngularSpeed = Math.PI;
        this.smokeParticleSystem.minEmitPower = 0.5;
        this.smokeParticleSystem.maxEmitPower = 1.5;
        this.smokeParticleSystem.updateSpeed = 0.005;
        this.fireParticleSystem.start();
        this.smokeParticleSystem.start();
    };
    Missile.prototype.destroy = function () {
        this.fireParticleSystem.stop();
        this.smokeParticleSystem.stop();
        this.reactor.dispose();
        _super.prototype.destroy.call(this);
    };
    return Missile;
}(Enemy));
//# sourceMappingURL=Missile.js.map