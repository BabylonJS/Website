var UpdateBroadcaster = (function () {
    function UpdateBroadcaster() {
        this.updatables = [];
    }
    UpdateBroadcaster.prototype.update = function () {
        for (var i = this.updatables.length - 1; i > -1; i--) {
            if (this.updatables[i]) {
                this.updatables[i].update();
            }
        }
    };
    UpdateBroadcaster.prototype.register = function (updatable) {
        this.updatables.push(updatable);
    };
    UpdateBroadcaster.prototype.unregister = function (updatable) {
        var index = this.updatables.indexOf(updatable);
        if (index > -1) {
            this.updatables.splice(index, 1);
            return true;
        }
        return false;
    };
    return UpdateBroadcaster;
}());
//# sourceMappingURL=UpdateBroadcaster.js.map