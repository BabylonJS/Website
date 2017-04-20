var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StateGraphic = (function (_super) {
    __extends(StateGraphic, _super);
    function StateGraphic(name) {
        if (name === void 0) { name = null; }
        _super.call(this, name);
    }
    Object.defineProperty(StateGraphic.prototype, "anim", {
        get: function () {
            return this._anim;
        },
        set: function (newAnim) {
            if (this._anim != null) {
                this._anim.parent = null;
                this._anim.dispose();
            }
            this._anim = newAnim;
            newAnim.parent = this;
        },
        enumerable: true,
        configurable: true
    });
    StateGraphic.prototype.setState = function (pState) {
        if (this.graphicState == pState)
            return;
        if (this.anim != null) {
            this.anim.dispose();
            this.anim = null;
        }
        if (this.assetName == null)
            this.assetName = ClassTools.getClassName(this);
        this.graphicState = pState;
        this.anim = Services.loader.getMesh(this.getGraphicID(pState));
        this.anim.setPositionWithLocalVector(BABYLON.Vector3.Zero());
    };
    StateGraphic.prototype.getGraphicID = function (pState) {
        if (pState == StateGraphic.DEFAULT_STATE)
            return this.assetName;
        return this.assetName + "_" + pState;
    };
    StateGraphic.prototype.destroy = function () {
        this.anim.dispose();
        _super.prototype.destroy.call(this);
    };
    StateGraphic.DEFAULT_STATE = "";
    return StateGraphic;
}(StateMachine));
//# sourceMappingURL=StateGraphic.js.map