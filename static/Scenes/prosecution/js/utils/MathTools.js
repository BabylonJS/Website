var MathTools = (function () {
    function MathTools() {
    }
    MathTools.sphericalToCartesian = function (phi, theta, radius) {
        var x = -radius * Math.cos(phi) * Math.cos(theta);
        var y = radius * Math.sin(phi);
        var z = radius * Math.cos(phi) * Math.sin(theta);
        return new BABYLON.Vector3(x, y, z);
    };
    MathTools.randomRange = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    MathTools.floatLerp = function (val1, val2, coeff) {
        return val1 + (val2 - val1) * coeff;
    };
    MathTools.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    return MathTools;
}());
//# sourceMappingURL=MathTools.js.map