var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.playSound = function (name, isLooping, meshAttached, disposeOnEnded) {
        if (isLooping === void 0) { isLooping = false; }
        if (meshAttached === void 0) { meshAttached = null; }
        if (disposeOnEnded === void 0) { disposeOnEnded = false; }
        var sound = Services.loader.getSound(name);
        sound.loop = isLooping;
        if (disposeOnEnded) {
            sound.onended = function () {
                sound.dispose();
            };
        }
        if (meshAttached) {
            sound.maxDistance = 400;
            sound.refDistance = 200;
            sound.distanceModel = "exponential";
            sound.rolloffFactor = 2;
            sound.attachToMesh(meshAttached);
            sound.autoplay = true;
        }
        sound.play();
        return sound;
    };
    return SoundManager;
}());
//# sourceMappingURL=SoundManager.js.map