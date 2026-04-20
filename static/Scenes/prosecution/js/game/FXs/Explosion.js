var Explosion = (function () {
    function Explosion(position, soundListener) {
        this.container = new BABYLON.Mesh("container", Services.scene);
        this.container.position = position;
        this.blastParticleSystem = new BABYLON.ParticleSystem("particlesOrange", 1, Services.scene);
        this.fireParticleSystem = new BABYLON.ParticleSystem("particlesRed", 300, Services.scene);
        this.smokeParticleSystem = new BABYLON.ParticleSystem("particlesGrey", 200, Services.scene);
        this.blastParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        this.fireParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        this.smokeParticleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", Services.scene);
        this.blastParticleSystem.emitter = this.container;
        this.fireParticleSystem.emitter = this.container;
        this.smokeParticleSystem.emitter = this.container;
        this.blastParticleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
        this.blastParticleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
        this.blastParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        this.fireParticleSystem.color1 = new BABYLON.Color4(1, 0.25, 0, 1.0);
        this.fireParticleSystem.color2 = new BABYLON.Color4(1, 0.25, 0, 1.0);
        this.fireParticleSystem.colorDead = new BABYLON.Color4(1, 0.5, 0, 1.0);
        this.smokeParticleSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        this.blastParticleSystem.manualEmitCount = 1;
        this.fireParticleSystem.manualEmitCount = 300;
        this.smokeParticleSystem.manualEmitCount = 200;
        this.blastParticleSystem.minSize = 3;
        this.blastParticleSystem.maxSize = 3;
        this.fireParticleSystem.minSize = 1;
        this.fireParticleSystem.maxSize = 3;
        this.smokeParticleSystem.minSize = 3;
        this.smokeParticleSystem.maxSize = 5;
        this.blastParticleSystem.minLifeTime = 1.5;
        this.blastParticleSystem.maxLifeTime = 1.5;
        this.fireParticleSystem.minLifeTime = 4;
        this.fireParticleSystem.maxLifeTime = 6;
        this.smokeParticleSystem.minLifeTime = 5;
        this.smokeParticleSystem.maxLifeTime = 7;
        this.fireParticleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        this.fireParticleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
        this.smokeParticleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        this.smokeParticleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
        this.blastParticleSystem.updateSpeed = 0.09;
        this.fireParticleSystem.updateSpeed = 0.07;
        this.smokeParticleSystem.updateSpeed = 0.03;
        this.fireParticleSystem.minEmitPower = 2;
        this.fireParticleSystem.maxEmitPower = 7;
        this.smokeParticleSystem.minEmitPower = 2;
        this.smokeParticleSystem.maxEmitPower = 7;
        this.smokeParticleSystem.startDirectionFunction = this.startDirectionFunction.bind(this);
        this.blastParticleSystem.updateFunction = this.updateFunction.bind(this);
        this.blastParticleSystem.start();
        this.fireParticleSystem.start();
        this.smokeParticleSystem.start();
        SoundManager.playSound("enemy_death", false).setVolume(DistantSound.getVolume(this.container, soundListener, 80, 0, 0, 3));
        setTimeout(this.destroy.bind(this), 1500);
    }
    Explosion.prototype.destroy = function () {
        this.fireParticleSystem.dispose();
        this.blastParticleSystem.dispose();
        this.smokeParticleSystem.dispose();
        this.container.dispose();
    };
    Explosion.prototype.updateFunction = function (particles) {
        if (particles.length == 0)
            return;
        var particle = particles[0];
        particle.age += this.blastParticleSystem['_scaledUpdateSpeed'];
        if (particle.age >= particle.lifeTime) {
            particles.splice(0, 1);
            this.blastParticleSystem['_stockParticles'].push(particle);
        }
        else {
            particle.colorStep.scaleToRef(this.blastParticleSystem['_scaledUpdateSpeed'], this.blastParticleSystem['_scaledColorStep']);
            particle.color.addInPlace(this.blastParticleSystem["_scaledColorStep"]);
            particle.size += particle.age * 8;
            if (particle.color.a < 0)
                particle.color.a = 0;
        }
    };
    Explosion.prototype.startDirectionFunction = function (emitPower, worldMatrix, directionToUpdate) {
        var sphereCoo = MathTools.sphericalToCartesian(2 * Math.PI * Math.random(), 2 * Math.PI * Math.random(), emitPower);
        var randX = MathTools.randomRange(this.fireParticleSystem.direction1.x, this.fireParticleSystem.direction2.x);
        var randY = MathTools.randomRange(this.fireParticleSystem.direction1.y, this.fireParticleSystem.direction2.y);
        var randZ = MathTools.randomRange(this.fireParticleSystem.direction1.z, this.fireParticleSystem.direction2.z);
        //directionToUpdate = sphereCoo;
        //BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(sphereCoo.x, sphereCoo.y, sphereCoo.z, worldMatrix, directionToUpdate);
        BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX * emitPower, randY * emitPower, randZ * emitPower, worldMatrix, directionToUpdate);
        directionToUpdate = directionToUpdate.multiplyByFloats(0.75, 0.75, 0.75);
    };
    return Explosion;
}());
//# sourceMappingURL=Explosion.js.map