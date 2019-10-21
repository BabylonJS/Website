var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(soundListener) {
        _super.call(this);
        this.eventDispatcher = new EventDispatcher();
        this.targets = [];
        this.soundListener = soundListener;
        this.sound = this.playSound(this.soundListener);
    }
    Enemy.prototype.playSound = function (soundListener) {
        var sound = Services.loader.getSound(this.getSoundName());
        sound.loop = true;
        sound.setVolume(0);
        sound.play();
        return new DistantSound(sound, this.box, soundListener, 75, 0, 0, 1);
    };
    Enemy.prototype.addTargets = function (targets) {
        for (var i = targets.length - 1; i > -1; i--) {
            this.addTarget(targets[i]);
        }
    };
    Enemy.prototype.removeTargets = function (targets) {
        for (var i = targets.length - 1; i > -1; i--) {
            this.removeTarget(targets[i]);
        }
    };
    Enemy.prototype.addTarget = function (target) {
        if (!ArrayTools.has(this.targets, target)) {
            this.targets.push(target);
            return true;
        }
        return false;
    };
    Enemy.prototype.removeTarget = function (target) {
        return ArrayTools.remove(this.targets, target);
    };
    Enemy.prototype.addEnemyCollideListener = function (handler) {
        this.eventDispatcher.addEventListener(Enemy.ENEMY_COLLIDE_TARGET, handler);
    };
    Enemy.prototype.removeEnemyCollideListener = function (handler) {
        this.eventDispatcher.removeEventListener(Enemy.ENEMY_COLLIDE_TARGET, handler);
    };
    Enemy.prototype.removeAllListeners = function () {
        this.eventDispatcher.removeAllListeners();
    };
    Enemy.prototype.checkCollision = function () {
        var target;
        for (var i = this.targets.length - 1; i > -1; i--) {
            target = this.targets[i];
            if (this.box.intersectsMesh(target.box, false)) {
                this.eventDispatcher.dispatchEvent(Enemy.ENEMY_COLLIDE_TARGET, new EnemyCollideEvent(Enemy.ENEMY_COLLIDE_TARGET, this, target));
            }
        }
    };
    Enemy.prototype.destroy = function () {
        this.removeAllListeners();
        this.sound.destroy();
        _super.prototype.destroy.call(this);
    };
    Enemy.ENEMY_COLLIDE_TARGET = "enemyCollideTarget";
    return Enemy;
}(FlyingObject));
//# sourceMappingURL=Enemy.js.map