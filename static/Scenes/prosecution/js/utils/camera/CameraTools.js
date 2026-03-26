var CameraTools = (function () {
    function CameraTools() {
    }
    CameraTools.init = function (camera, canvas) {
        CameraTools._screenSize = new BABYLON.Vector2(0, 0);
        var cameraDistance = camera.position.y;
        var aspectRatio = canvas.width / canvas.height;
        CameraTools._screenSize.y = 2 * Math.tan(camera.fov / 2) * cameraDistance;
        CameraTools._screenSize.x = CameraTools._screenSize.y * aspectRatio;
    };
    Object.defineProperty(CameraTools, "screenSize", {
        get: function () {
            return CameraTools._screenSize;
        },
        enumerable: true,
        configurable: true
    });
    return CameraTools;
}());
//# sourceMappingURL=CameraTools.js.map