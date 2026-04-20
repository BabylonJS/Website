var MultiScreen = (function () {
    function MultiScreen() {
    }
    MultiScreen.getScaleRatio = function () {
        var heightScaleRatio = window.innerHeight / MultiScreen.HEIGHT_REF;
        var widthScaleRatio = window.innerWidth / MultiScreen.WIDTH_REF;
        return Math.min(heightScaleRatio, widthScaleRatio);
    };
    MultiScreen.WIDTH_REF = 2048;
    MultiScreen.HEIGHT_REF = 1366;
    return MultiScreen;
}());
//# sourceMappingURL=MultiScreen.js.map