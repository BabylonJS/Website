var CameraManager = (function () {
    function CameraManager(pivotPosition, camera, target) {
        this.pivot = new BABYLON.Mesh("pivot", Services.scene);
        this.pivot.position = pivotPosition;
        this.camera = camera;
        this.target = target;
        camera.parent = this.pivot;
        Services.updateBroadcaster.register(this);
        this.spawn();
    }
    CameraManager.prototype.spawn = function () {
        var pivotStartRotation = CameraManager.ROTATION_OFFSET;
        var pivotEndRotation = pivotStartRotation.multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, 1.4));
        var easingFunctionIn = new BABYLON.ExponentialEase();
        easingFunctionIn.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        var animationFrame = 400;
        var pivotRotationAnimation = new BABYLON.Animation('pivotRotation', 'rotationQuaternion', 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        pivotRotationAnimation.setEasingFunction(easingFunctionIn);
        var pivotRotationKeys = [];
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
        this.pivot.animations.push(pivotRotationAnimation);
        Services.scene.beginAnimation(this.pivot, 0, animationFrame, false);
    };
    CameraManager.prototype.update = function () {
        this.pivot.rotationQuaternion = this.target.rotationQuaternion.multiply(CameraManager.ROTATION_OFFSET);
    };
    CameraManager.prototype.destroy = function () {
        this.camera.parent = null;
        this.pivot.dispose();
        this.pivot = null;
        Services.updateBroadcaster.unregister(this);
    };
    CameraManager.ROTATION_OFFSET = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, Math.PI / 2);
    return CameraManager;
}());
//# sourceMappingURL=CameraManager.js.map