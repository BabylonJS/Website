var ClassTools = (function () {
    function ClassTools() {
    }
    ClassTools.getClassFromName = function (className) {
        if (Object.keys(window).indexOf(className) == -1) {
            throw "Class not found for name \"" + className + "\"";
        }
        return window[className];
    };
    ClassTools.createInstanceFromName = function (className) {
        var lClass = ClassTools.getClassFromName(className);
        return new lClass();
    };
    ClassTools.getClassName = function (instance) {
        return /^function (.*)\(/.exec(instance.constructor.toString())[1];
    };
    return ClassTools;
}());
//# sourceMappingURL=ClassTools.js.map