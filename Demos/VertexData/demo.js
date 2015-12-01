var demo = {
    constructor: CreateVertexDataTestScene,
    onload: function (scene) {
        scene.activeCamera.detachControl(scene.getEngine().getRenderingCanvas());
    }
};