var Game = (function () {
    function Game() {
        this.enemies = [];
        this._score = 0;
        this._timer = 0;
        this.spawnFrequence = Game.INITIAL_SPAWN_FREQUENCE;
        this.player = new Player();
        this.cameraManager = new CameraManager(BABYLON.Vector3.Zero(), Services.camera, this.player);
        this.startTime = Date.now();
        this.lastTime = this.startTime + Game.INITIAL_SPAWN_FREQUENCE;
        this.hud = new HUD();
        // patch to update player after camera (cause wriggling if inverse)
        Services.updateBroadcaster.unregister(this.player);
        Services.updateBroadcaster.register(this.player);
        Services.screensManager.openOnlyScreen(this.hud);
        Services.updateBroadcaster.register(this);
        Planet.instance.setModeGame();
        this.player.spawn(90, 0);
        this.music = SoundManager.playSound("prosecution_music02", true);
    }
    Game.prototype.update = function () {
        var newTime = Date.now();
        this.timer = Math.round((newTime - this.startTime) / 1000);
        if (newTime > this.lastTime + this.spawnFrequence) {
            this.spawnEnemies();
            this.lastTime = newTime;
        }
    };
    Game.prototype.spawnEnemies = function () {
        this.addEnemy(this.spawnRandomMissile());
        this.addEnemy(this.spawnMine());
    };
    Game.prototype.spawnRandomMissile = function () {
        var mines = this.mines;
        var missile = Math.random() > 0.5 ? new Missile(this.player.transform) : new FastMissile(this.player.transform);
        missile.spawn(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
        for (var i = mines.length - 1; i > -1; i--) {
            mines[i].addTarget(missile);
        }
        return missile;
    };
    Game.prototype.spawnMine = function () {
        var mine = new Mine(this.player.transform);
        mine.spawn(MathTools.randomRange(0, 2 * Math.PI), MathTools.randomRange(0, 2 * Math.PI));
        mine.addTargets(this.missiles);
        mine.addEnemyCollideListener(function (event) {
            if (event.targetCollided instanceof Missile) {
                ArrayTools.remove(this.enemies, mine);
                ArrayTools.remove(this.enemies, event.targetCollided);
                this.explodeGameObjectsCollided(mine, event.targetCollided);
                this.score += Game.MISSILE_EXPLODE_MINE_SCORE;
                var mines = this.mines;
                for (var i = mines.length - 1; i > -1; i--) {
                    mines[i].removeTarget(event.targetCollided);
                }
            }
        }.bind(this));
        return mine;
    };
    Game.prototype.explodeGameObjectsCollided = function (gameObject1, gameObject2) {
        var explosion = new Explosion(gameObject1.box.getAbsolutePosition().add(gameObject2.box.getAbsolutePosition().subtract(gameObject1.box.getAbsolutePosition()).multiplyByFloats(0.5, 0.5, 0.5)), this.player.box);
        gameObject1.destroy();
        gameObject2.destroy();
    };
    Game.prototype.addEnemy = function (enemy) {
        enemy.addTarget(this.player);
        enemy.addEnemyCollideListener(function (event) {
            if (event.targetCollided == this.player) {
                this.explodeGameObjectsCollided(this.player, event.enemy);
                ArrayTools.remove(this.enemies, enemy);
                this.lose();
            }
        }.bind(this));
        this.enemies.push(enemy);
    };
    Game.prototype.lose = function () {
        this.enemies.forEach(function (enemy) {
            enemy.removeAllListeners();
        });
        setTimeout(function () {
            this.enemies.forEach(function (enemy) {
                enemy.explode(this.player.box);
            }.bind(this));
            Planet.instance.setModeWait();
            Services.screensManager.openOnlyScreen(new GameOverScreen(this.score, this.timer, Game.getBestScore()));
            this.music.dispose();
            this.destroy();
        }.bind(this), 1000);
        //var gameOverScreen:GameOverScreen = new GameOverScreen();
        //Services.screensManager.openOnlyScreen();
    };
    Game.prototype.destroy = function () {
        this.cameraManager.destroy();
        this.hud.destroy();
        this.cameraManager =
            this.enemies =
                this.hud =
                    this.player = null;
        Services.updateBroadcaster.unregister(this);
    };
    Object.defineProperty(Game.prototype, "mines", {
        get: function () {
            return this.enemies.filter(function (enemy) {
                return enemy instanceof Mine;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "missiles", {
        get: function () {
            return this.enemies.filter(function (enemy) {
                return enemy instanceof Missile;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (score) {
            var scoreReached = score - this._score;
            this._score = score;
            this.spawnFrequence = Math.max(Game.MIN_SPAWN_FREQUENCE, this.spawnFrequence - scoreReached * Game.SPAWN_FREQUENCE_DECREMENT_ON_SCORING);
            this.hud.setScore(score);
            if (score > Game.getBestScore()) {
                localStorage.setItem(Game.BEST_SCORE_KEY, score.toString());
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        set: function (timer) {
            if (timer != this._timer) {
                this._timer = timer;
                this.hud.setTimer(timer);
                if (this._timer != 0 && this._timer % Game.DELAY_BETWEEN_SCORE_INCREMENT == 0) {
                    this.score++;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Game.getBestScore = function () {
        var scoreItem = localStorage.getItem(Game.BEST_SCORE_KEY);
        if (/^[0-9]+$/.exec(scoreItem)) {
            return parseInt(scoreItem);
        }
        return 0;
    };
    Game.INITIAL_SPAWN_FREQUENCE = 5000;
    Game.MIN_SPAWN_FREQUENCE = 1000;
    Game.DELAY_BETWEEN_SCORE_INCREMENT = 7;
    Game.MISSILE_EXPLODE_MINE_SCORE = 5;
    Game.SPAWN_FREQUENCE_DECREMENT_ON_SCORING = 10;
    Game.BEST_SCORE_KEY = "BestScore";
    return Game;
}());
//# sourceMappingURL=Game.js.map