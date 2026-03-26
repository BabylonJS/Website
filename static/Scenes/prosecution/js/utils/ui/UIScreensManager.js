var UIScreensManager = (function () {
    function UIScreensManager() {
        this.openedScreens = [];
    }
    UIScreensManager.prototype.openScreen = function (screen) {
        screen.open();
        this.openedScreens.push(screen);
    };
    UIScreensManager.prototype.closeTopScreen = function () {
        var screen = this.openedScreens.pop();
        if (screen != null) {
            screen.close();
        }
        return screen;
    };
    UIScreensManager.prototype.closeAllScreens = function () {
        while (this.openedScreens.length > 0) {
            this.openedScreens.pop().close();
        }
    };
    UIScreensManager.prototype.openOnlyScreen = function (screen) {
        this.closeAllScreens();
        this.openScreen(screen);
    };
    return UIScreensManager;
}());
//# sourceMappingURL=UIScreensManager.js.map