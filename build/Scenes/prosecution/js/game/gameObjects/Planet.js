var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planet = (function (_super) {
    __extends(Planet, _super);
    function Planet() {
        _super.call(this, "Planet");
        this.sound = SoundManager.playSound("menu_music", true);
        this.sound.setVolume(3);
        this.sound.stop();
        this.start();
        var cloud1 = new Cloud("Cloud1");
        cloud1.spawn(0, 0);
        cloud1.parent = this;
        var cloud2 = new Cloud("Cloud2");
        cloud2.spawn(0, 70);
        cloud2.parent = this;
        var cloud3 = new Cloud("Cloud3");
        cloud3.spawn(15, 90);
        cloud3.parent = this;
        this.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
        this.position = new BABYLON.Vector3(0, 35, 0);
    }
    Object.defineProperty(Planet, "instance", {
        get: function () {
            if (Planet._instance == null) {
                Planet._instance = new Planet();
            }
            return Planet._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Planet, "radius", {
        get: function () {
            return Planet.radius;
        },
        enumerable: true,
        configurable: true
    });
    Planet.prototype.start = function () {
        var index = 0;
        this.setState(StateGraphic.DEFAULT_STATE);
        this.anim.getChildMeshes().forEach(function (mesh) {
            if (mesh.name == "Planet_clone.Planet.chimney0Spot") {
                this.particleSystem0 = this.initParticleEmitter(mesh);
            }
            else if (mesh.name == "Planet_clone.Planet.chimney1Spot") {
                this.particleSystem1 = this.initParticleEmitter(mesh);
            }
        }.bind(this));
        _super.prototype.start.call(this);
    };
    Planet.prototype.initParticleEmitter = function (mesh) {
        var smokeParticleSystem = new BABYLON.ParticleSystem("particles", 1000, Services.scene);
        smokeParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        smokeParticleSystem.emitter = mesh;
        smokeParticleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5);
        smokeParticleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5);
        smokeParticleSystem.color1 = new BABYLON.Color4(0.3, 0.3, 0.3, 1.0);
        smokeParticleSystem.color2 = new BABYLON.Color4(0, 1, 1, 1.0);
        smokeParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        smokeParticleSystem.minSize = 1;
        smokeParticleSystem.maxSize = 3;
        smokeParticleSystem.minLifeTime = 0.2;
        smokeParticleSystem.maxLifeTime = 0.75;
        smokeParticleSystem.emitRate = 350;
        smokeParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        smokeParticleSystem.gravity = mesh.getAbsolutePosition();
        smokeParticleSystem.minAngularSpeed = 0;
        smokeParticleSystem.maxAngularSpeed = Math.PI;
        smokeParticleSystem.minEmitPower = 0.3;
        smokeParticleSystem.maxEmitPower = 0.8;
        smokeParticleSystem.updateSpeed = 0.005;
        smokeParticleSystem.start();
        return smokeParticleSystem;
    };
    Planet.prototype.setModeNormal = function () {
        this.particleSystem0.stop();
        this.particleSystem1.stop();
        this.sound.play();
        _super.prototype.setModeNormal.call(this);
    };
    Planet.prototype.setModeWait = function () {
        this.setModeNormal();
    };
    Planet.prototype.setModeGame = function () {
        this.sound.stop();
        this.rotationQuaternion = BABYLON.Quaternion.Identity();
        this.doAction = this.doActionGrowToGameMode;
    };
    Planet.prototype.doActionGrowToGameMode = function () {
        this.scaling = BABYLON.Vector3.Lerp(this.scaling, Planet.SCALE_FOR_GAME, 0.1);
        this.position = BABYLON.Vector3.Lerp(this.position, Planet.POSITION_FOR_GAME, 0.1);
        if (this.scaling.subtract(Planet.SCALE_FOR_GAME).length() < 0.01 && this.position.subtract(Planet.POSITION_FOR_GAME).length() < 0.01) {
            this.scaling = Planet.SCALE_FOR_GAME;
            this.position = Planet.POSITION_FOR_GAME;
            this.particleSystem0.start();
            this.particleSystem1.start();
            this.setModeVoid();
        }
    };
    Planet.prototype.doActionNormal = function () {
        this.rotate(BABYLON.Axis.Y, 0.5 * Services.deltaTime);
    };
    Planet.prototype.destroy = function () {
        this.particleSystem0.dispose();
        this.particleSystem1.dispose();
        Planet._instance = null;
        _super.prototype.destroy.call(this);
    };
    Planet.SCALE_FOR_GAME = new BABYLON.Vector3(1, 1, 1);
    Planet.POSITION_FOR_GAME = BABYLON.Vector3.Zero();
    Planet._radius = 60;
    return Planet;
}(StateGraphic));
//# sourceMappingURL=Planet.js.map