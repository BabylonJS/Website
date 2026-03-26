var DistantSound = (function () {
    function DistantSound(sound, soundEmitter, soundListener, radiusSoundMin, radiusSoundMax, soundMin, soundMax) {
        if (soundMin === void 0) { soundMin = 0; }
        if (soundMax === void 0) { soundMax = 1; }
        this.sound = sound;
        this.soundListener = soundListener;
        this.soundEmitter = soundEmitter;
        this.radiusSoundMax = radiusSoundMax;
        this.radiusSoundMin = radiusSoundMin;
        this.soundMax = soundMax;
        this.soundMin = soundMin;
        Services.updateBroadcaster.register(this);
    }
    DistantSound.getVolume = function (soundEmitter, soundListener, radiusSoundMin, radiusSoundMax, soundMin, soundMax) {
        if (soundMin === void 0) { soundMin = 0; }
        if (soundMax === void 0) { soundMax = 1; }
        var radius = soundEmitter.getAbsolutePosition().subtract(soundListener.getAbsolutePosition()).length();
        var radiusPos = radius - radiusSoundMin;
        var minVolumeToMax = radiusSoundMax - radiusSoundMin;
        var volumeRatio = radiusPos / minVolumeToMax;
        return MathTools.clamp(soundMax * volumeRatio, soundMin, soundMax);
    };
    DistantSound.prototype.update = function () {
        var volume = DistantSound.getVolume(this.soundEmitter, this.soundListener, this.radiusSoundMin, this.radiusSoundMax, this.soundMin, this.soundMax);
        this.sound.setVolume(volume);
    };
    DistantSound.prototype.destroy = function () {
        this.sound.dispose();
        Services.updateBroadcaster.unregister(this);
    };
    return DistantSound;
}());
//# sourceMappingURL=DistantSound.js.map