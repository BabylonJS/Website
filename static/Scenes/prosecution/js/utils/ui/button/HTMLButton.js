var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTMLButton = (function (_super) {
    __extends(HTMLButton, _super);
    function HTMLButton() {
        _super.call(this);
        this.dispatcher = new EventDispatcher();
        this.divContainer.classList.add("button");
    }
    Object.defineProperty(HTMLButton.prototype, "htmlAsset", {
        get: function () {
            return this._htmlAsset;
        },
        set: function (asset) {
            if (this._htmlAsset) {
                this._htmlAsset.removeEventListener(MouseEventType.DOWN.toString(), this.onMouseDown.bind(this));
                this._htmlAsset.removeEventListener(MouseEventType.CLICK.toString(), this.onMouseClick.bind(this));
                this._htmlAsset.removeEventListener(MouseEventType.OVER.toString(), this.onMouseOver.bind(this));
                this._htmlAsset.removeEventListener(MouseEventType.OUT.toString(), this.onMouseOut.bind(this));
                this._htmlAsset.remove();
            }
            this._htmlAsset = asset;
            this.divContainer.appendChild(this.htmlAsset);
            this._htmlAsset.style.position = "absolute";
            this._htmlAsset.addEventListener(MouseEventType.DOWN.toString(), this.onMouseDown.bind(this));
            this._htmlAsset.addEventListener(MouseEventType.CLICK.toString(), this.onMouseClick.bind(this));
            this._htmlAsset.addEventListener(MouseEventType.OVER.toString(), this.onMouseOver.bind(this));
            this._htmlAsset.addEventListener(MouseEventType.OUT.toString(), this.onMouseOut.bind(this));
            this.updateAnchor();
            this.updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    HTMLButton.prototype.getState = function () {
        return this._state;
    };
    HTMLButton.prototype.start = function () {
        this.setModeUp();
    };
    HTMLButton.prototype.hasHandlers = function (eventName) {
        return this.dispatcher.hasHandlers(eventName);
    };
    HTMLButton.prototype.addEventListener = function (mouseEventType, handler) {
        this.dispatcher.addEventListener(mouseEventType.toString(), handler);
    };
    HTMLButton.prototype.removeEventListener = function (mouseEventType, handler) {
        return this.dispatcher.removeEventListener(mouseEventType.toString(), handler);
    };
    HTMLButton.prototype.removeAllEventListeners = function (mouseEventType) {
        this.dispatcher.removeAllListeners(mouseEventType.toString());
    };
    HTMLButton.prototype.dispatchEvent = function (mouseEventType) {
        this.dispatcher.dispatchEvent(mouseEventType.toString(), new ButtonEvent(mouseEventType, this));
    };
    HTMLButton.prototype.setModeOver = function () {
        this._state = ButtonState.OVER;
    };
    HTMLButton.prototype.setModeDown = function () {
        this._state = ButtonState.DOWN;
    };
    HTMLButton.prototype.setModeUp = function () {
        this._state = ButtonState.UP;
    };
    HTMLButton.prototype.onMouseClick = function (event) {
        this.dispatchEvent(MouseEventType.CLICK);
        this.setModeOver();
    };
    HTMLButton.prototype.onMouseDown = function (event) {
        this.dispatchEvent(MouseEventType.DOWN);
        this.setModeDown();
    };
    HTMLButton.prototype.onMouseOver = function (event) {
        this.dispatchEvent(MouseEventType.OVER);
        this.setModeOver();
    };
    HTMLButton.prototype.onMouseOut = function (event) {
        this.dispatchEvent(MouseEventType.OUT);
        this.setModeUp();
    };
    HTMLButton.prototype.destroy = function () {
        this.dispatcher.removeAllListeners();
        _super.prototype.destroy.call(this);
    };
    return HTMLButton;
}(HTMLUIElement));
//# sourceMappingURL=HTMLButton.js.map