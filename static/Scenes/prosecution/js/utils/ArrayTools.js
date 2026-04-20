var ArrayTools = (function () {
    function ArrayTools() {
    }
    ArrayTools.remove = function (array, element) {
        var elementIndex = array.indexOf(element);
        if (elementIndex == -1) {
            return false;
        }
        array.splice(elementIndex, 1);
        return true;
    };
    ArrayTools.has = function (array, element) {
        return array.indexOf(element) != -1;
    };
    return ArrayTools;
}());
//# sourceMappingURL=ArrayTools.js.map