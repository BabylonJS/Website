var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(name) {
        if (name === void 0) { name = null; }
        if (name == null) {
            name = "GameObject_" + (++GameObject.id);
        }
        _super.call(this, name, Services.scene);
        this.setEnabled(false);
    }
    Object.defineProperty(GameObject.prototype, "box", {
        get: function () {
            return this._box;
        },
        set: function (box) {
            this._box = box;
            this._box.isVisible = false;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.start = function () {
        this.setEnabled(true);
    };
    GameObject.prototype.destroy = function () {
        this.dispose();
    };
    GameObject.id = 0;
    return GameObject;
}(BABYLON.Mesh));
//# sourceMappingURL=GameObject.js.map