var demo = {
    constructor: CreatePhysicsScene,
    onload: function (scene) {
        scene.onPointerDown = function (evt, pickResult) {
            if (pickResult.hit) {
                var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
                dir.normalize();
                pickResult.pickedMesh.applyImpulse(dir.scale(10), pickResult.pickedPoint);
            }
        };
    }
};