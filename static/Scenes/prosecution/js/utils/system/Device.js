var Device = (function () {
    function Device() {
    }
    Object.defineProperty(Device, "system", {
        get: function () {
            var userAgent = navigator.userAgent;
            if (/IEMobile/i.exec(userAgent))
                return System.WINDOWS_MOBILE;
            else if (/iPhone|iPad|iPod/i.exec(userAgent))
                return System.IOS;
            else if (/BlackBerry/i.exec(userAgent))
                return System.BLACKBERRY;
            else if (/PlayBook/i.exec(userAgent))
                return System.BB_PLAYBOOK;
            else if (/Android/i.exec(userAgent))
                return System.ANDROID;
            else
                return System.DESKTOP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device, "isMobile", {
        get: function () {
            return Device.system != System.DESKTOP;
        },
        enumerable: true,
        configurable: true
    });
    return Device;
}());
//# sourceMappingURL=Device.js.map