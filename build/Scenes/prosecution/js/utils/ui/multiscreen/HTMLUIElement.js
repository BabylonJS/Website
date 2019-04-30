var HTMLUIElement = (function () {
    function HTMLUIElement() {
        this._offset = new UIPoint();
        this._scale = new UIPoint();
        this._assetAnchor = new UIAnchor();
        this._positionAnchor = new UIAnchor();
        this._width = 0;
        this._height = 0;
        this._children = [];
        this._scaleInfluenceOffset = true;
        this._resizeMode = ResizeMode.RESIZE;
        this.divContainer = document.createElement("div");
        this.htmlAsset = document.createElement("div");
        document.body.appendChild(this.divContainer);
        this.offset = new UIPoint();
        this.scale = new UIPoint(1, 1);
        this.assetAnchor = new UIAnchor();
        this.positionAnchor = new UIAnchor();
        this.divContainer.style.position = "absolute";
        this.setupWindowResizeListener();
    }
    Object.defineProperty(HTMLUIElement.prototype, "resizeMode", {
        get: function () {
            return this._resizeMode;
        },
        set: function (resizeMode) {
            this._resizeMode = resizeMode;
            this.updateScale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "scaleInfluenceOffset", {
        get: function () {
            return this._scaleInfluenceOffset;
        },
        set: function (scaleInfluenceOffset) {
            this._scaleInfluenceOffset = scaleInfluenceOffset;
            this.updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (scale) {
            if (this._scale) {
                this._scale.removeAllListeners();
            }
            this._scale = scale;
            this._scale.addPointUpdateListener(this.updateScale.bind(this));
            this.updateScale();
        },
        enumerable: true,
        configurable: true
    });
    HTMLUIElement.prototype.getAbsoluteScale = function (scale) {
        if (!parent) {
            return scale;
        }
        return this.parent.getAbsoluteScale(new UIPoint(this.scale.x + scale.x, this.scale.y + scale.y));
    };
    Object.defineProperty(HTMLUIElement.prototype, "scaledWidth", {
        get: function () {
            var scaledWidth = this.width * this.scale.x;
            if (this.resizeMode == ResizeMode.RESIZE) {
                scaledWidth = scaledWidth * MultiScreen.getScaleRatio();
            }
            else if (this.resizeMode == ResizeMode.SCREEN_SIZE || this.resizeMode == ResizeMode.SCREEN_WIDTH) {
                scaledWidth = window.innerWidth * this.scale.x;
            }
            else if (this.resizeMode == ResizeMode.FROM_PARENTS) {
                scaledWidth = scaledWidth * this.getAbsoluteScale(new UIPoint(1, 1)).x;
            }
            return scaledWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "scaledHeight", {
        get: function () {
            var scaledHeight = this.height * this.scale.y;
            if (this.resizeMode == ResizeMode.RESIZE) {
                scaledHeight = scaledHeight * MultiScreen.getScaleRatio();
            }
            else if (this.resizeMode == ResizeMode.SCREEN_SIZE || this.resizeMode == ResizeMode.SCREEN_HEIGHT) {
                scaledHeight = window.innerHeight * this.scale.y;
            }
            else if (this.resizeMode == ResizeMode.FROM_PARENTS) {
                scaledHeight = scaledHeight * this.getAbsoluteScale(new UIPoint(1, 1)).y;
            }
            return scaledHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "children", {
        get: function () {
            return this._children.slice(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "htmlAsset", {
        get: function () {
            return this._htmlAsset;
        },
        set: function (asset) {
            if (this._htmlAsset) {
                this._htmlAsset.remove();
            }
            this._htmlAsset = asset;
            this.divContainer.appendChild(this.htmlAsset);
            this.htmlAsset.style.position = "absolute";
            this.updateAnchor();
            this.updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "color", {
        get: function () {
            return this.htmlAsset.style.backgroundColor;
        },
        set: function (color) {
            HTMLUIElement.throwIfNotColor(color);
            this.htmlAsset.style.backgroundColor = color;
        },
        enumerable: true,
        configurable: true
    });
    HTMLUIElement.stringIsHexColor = function (color) {
        if (/^#[0-9A-Fa-f]{1,6}$/g.exec(color)) {
            return true;
        }
        return false;
    };
    HTMLUIElement.stringIsRGBAColor = function (color) {
        if (/^rgba\([0-9]{1,3}, ?[0-9]{1,3}, ?[0-9]{1,3}, ?[0-1]{1}\.[0-9]+\)$/g.exec(color)) {
            return true;
        }
        return false;
    };
    HTMLUIElement.stringIsHtmlColor = function (color) {
        if (HTMLUIElement.stringIsHexColor(color) || HTMLUIElement.stringIsRGBAColor(color)) {
            return true;
        }
        return false;
    };
    HTMLUIElement.throwIfNotColor = function (color) {
        if (!HTMLUIElement.stringIsHtmlColor(color)) {
            throw "\"" + color + "\" is an invalid color ! Color format : \"rgba(255, 255, 255, 1)\" OR \"#FFFFFF\"";
        }
    };
    Object.defineProperty(HTMLUIElement.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (offset) {
            if (this._offset) {
                this._offset.removeAllListeners();
            }
            this._offset = offset;
            this._offset.addPointUpdateListener(this.updatePosition.bind(this));
            this.updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "assetAnchor", {
        get: function () {
            return this._assetAnchor;
        },
        set: function (assetAnchor) {
            if (this._assetAnchor) {
                this._assetAnchor.removeAllListeners();
            }
            this._assetAnchor = assetAnchor;
            this._assetAnchor.addPointUpdateListener(this.updateAnchor.bind(this));
            this.updateAnchor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "positionAnchor", {
        get: function () {
            return this._positionAnchor;
        },
        set: function (positionAnchor) {
            if (this._positionAnchor) {
                this._positionAnchor.removeAllListeners();
            }
            this._positionAnchor = positionAnchor;
            this._positionAnchor.addPointUpdateListener(this.updatePosition.bind(this));
            this.updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (width) {
            this._width = width;
            this.onParentResize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLUIElement.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (height) {
            this._height = height;
            this.onParentResize();
        },
        enumerable: true,
        configurable: true
    });
    HTMLUIElement.prototype.updateAnchor = function () {
        this.htmlAsset.style.left = ((1 - this.assetAnchor.x) * this.scaledWidth - this.scaledWidth) + "px";
        this.htmlAsset.style.top = ((1 - this.assetAnchor.y) * this.scaledHeight - this.scaledHeight) + "px";
    };
    HTMLUIElement.prototype.getScaledOffset = function () {
        if (!this._scaleInfluenceOffset) {
            return this._offset;
        }
        var xScaleFactor = (this.width == 0) ? 1 : this.scaledWidth / this.width;
        var yScaleFactor = (this.height == 0) ? 1 : this.scaledHeight / this.height;
        return new UIPoint(xScaleFactor * this._offset.x, yScaleFactor * this._offset.y);
    };
    HTMLUIElement.prototype.updatePosition = function () {
        var parentWidth;
        var parentHeight;
        if (this._parent == null) {
            parentWidth = window.innerWidth;
            parentHeight = window.innerHeight;
        }
        else {
            parentWidth = this._parent.scaledWidth;
            parentHeight = this._parent.scaledHeight;
        }
        var scaledOffset = this.getScaledOffset();
        this.divContainer.style.left = (parentWidth * this.positionAnchor.x + scaledOffset.x) + "px";
        this.divContainer.style.top = (parentHeight * this.positionAnchor.y + scaledOffset.y) + "px";
    };
    HTMLUIElement.prototype.hasChild = function (uiElement) {
        return ArrayTools.has(this._children, uiElement);
    };
    HTMLUIElement.prototype.onParentResize = function () {
        this.updatePosition();
        this.updateScale();
        this.updateChildrenResize();
    };
    HTMLUIElement.prototype.updateChildrenResize = function () {
        for (var i = this._children.length - 1; i > -1; i--) {
            this._children[i].onParentResize();
        }
    };
    HTMLUIElement.prototype.show = function () {
        this.divContainer.style.display = "block";
    };
    HTMLUIElement.prototype.hide = function () {
        this.divContainer.style.display = "none";
    };
    HTMLUIElement.prototype.addChild = function (uiElement) {
        if (!this.hasChild(uiElement)) {
            this._children.push(uiElement);
            uiElement._parent = this;
            this.htmlAsset.appendChild(uiElement.divContainer);
            uiElement.updatePosition();
            uiElement.removeWindowResizeListener();
            uiElement.updatePosition();
        }
    };
    HTMLUIElement.prototype.removeChild = function (uiElement) {
        if (ArrayTools.remove(this._children, uiElement)) {
            uiElement._parent = null;
            this.htmlAsset.removeChild(uiElement.divContainer);
            document.body.appendChild(uiElement.divContainer);
            uiElement.setupWindowResizeListener();
            uiElement.updatePosition();
        }
    };
    HTMLUIElement.prototype.updateScale = function () {
        this.htmlAsset.style.width = this.scaledWidth + "px";
        this.htmlAsset.style.height = this.scaledHeight + "px";
        this.updateAnchor();
    };
    HTMLUIElement.prototype.setupWindowResizeListener = function () {
        window.addEventListener("resize", this.onParentResize.bind(this));
    };
    HTMLUIElement.prototype.removeWindowResizeListener = function () {
        window.removeEventListener("resize", this.onParentResize.bind(this));
    };
    HTMLUIElement.prototype.destroy = function () {
        for (var i = this._children.length - 1; i > -1; i--) {
            this._children[i].destroy();
        }
        this.removeWindowResizeListener();
        if (this._parent) {
            this._parent.removeChild(this);
        }
        this.assetAnchor.removeAllListeners();
        this.positionAnchor.removeAllListeners();
        this.offset.removeAllListeners();
        this.divContainer.remove();
    };
    return HTMLUIElement;
}());
//# sourceMappingURL=HTMLUIElement.js.map