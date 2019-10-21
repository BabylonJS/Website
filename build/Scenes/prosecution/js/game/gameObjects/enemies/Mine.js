var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mine = (function (_super) {
    __extends(Mine, _super);
    function Mine(soundListener) {
        _super.call(this, soundListener);
        this.helixSpeed = 8;
        this.speed = 0.4;
        this.anim.getChildMeshes().forEach(function (mesh) {
            if (mesh.name == "Mine_clone.Mine.Helice") {
                this.helix = mesh;
            }
        }.bind(this));
    }
    Mine.prototype.playSound = function (soundListener) {
        var sound = _super.prototype.playSound.call(this, soundListener);
        sound.soundMax = 1.5;
        return sound;
    };
    Mine.prototype.getSoundName = function () {
        return "helicopter";
    };
    Mine.prototype.setRotation = function (rotation) {
        this.transform.rotation.y = rotation;
    };
    Mine.prototype.doActionNormal = function () {
        this.move();
        this.helix.rotation.z += (this.helixSpeed * Services.deltaTime);
        this.checkCollision();
    };
    Mine.prototype.doActionSpawn = function () {
        this.helix.rotation.z += (this.helixSpeed * Services.deltaTime);
    };
    Mine.prototype.setModeSpawn = function () {
        this.doAction = this.doActionSpawn;
    };
    Mine.prototype.spawn = function (lat, lon) {
        this.setModeSpawn();
        var sphereStartPosition = MathTools.sphericalToCartesian(lat, lon, 60);
        var sphereEndPosition = MathTools.sphericalToCartesian(lat, lon, 75);
        this.transform.position = BABYLON.Vector3.Zero();
        var Y = BABYLON.Axis.Y;
        var normStartPosition = BABYLON.Vector3.Normalize(sphereStartPosition);
        var tanStartPosition = BABYLON.Vector3.Cross(normStartPosition, Y).normalize();
        var tan2StartPosition = BABYLON.Vector3.Cross(normStartPosition, tanStartPosition).normalize();
        var startRotationEuler = BABYLON.Vector3.RotationFromAxis(tan2StartPosition, normStartPosition, tanStartPosition);
        var startRotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(startRotationEuler.y, startRotationEuler.x, startRotationEuler.z);
        this.transform.rotationQuaternion = startRotationQuaternion;
        var transformTranslationAnimation = new BABYLON.Animation('transformTranslation', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var scaleAnimation = new BABYLON.Animation('scale', 'scaling', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var transformTranslationKeys = [];
        var scaleKeys = [];
        var animationFrame = 200;
        transformTranslationKeys.push({
            frame: 0,
            value: sphereStartPosition
        });
        transformTranslationKeys.push({
            frame: animationFrame,
            value: sphereEndPosition
        });
        transformTranslationAnimation.setKeys(transformTranslationKeys);
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
        this.anim.animations.push(scaleAnimation);
        Services.scene.beginDirectAnimation(this.transform, [transformTranslationAnimation, scaleAnimation], 0, animationFrame, false, 1, function () {
            this.setModeNormal();
        }.bind(this));
    };
    return Mine;
}(Enemy));
//# sourceMappingURL=Mine.js.map