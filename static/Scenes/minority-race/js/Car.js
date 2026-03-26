var Car = (function () {
    function Car(mesh) {
        this.isFinishLinePassed = false;
        this.isCheckpoint2Passed = false;
        this.isCheckpoint3Passed = false;
        // CAR SETTINGS
        this.gearRatios = [3.437, 0.00, 3.626, 2.2, 1.541, 1.213, 1.0, 0.767]; // SR20DETT gearbox
        this.cDrag = 0.4257; // drag coefficient
        this.cRr = 30 * this.cDrag; // rolling resistance 
        this.engineMaxTorque = 500; //274; // SR20DETT max torque
        this.engineMinTorque = 350; //220;
        this.brakeForce = 13000;
        this.maxSteeringAngle = 0.733038; // 40�
        this.engineVaccum = 3000; // engine brake 
        this.differentialRatio = 5.5; // 3.692; // Nissan S15 diffratio
        this.transmissionEfficiency = 0.7;
        this.wheelRadius = 0.34;
        this.wheelDistance = 4; // distance between front and back wheels 
        this.mass = 1250; // Nissan S15 mass
        this.maxSpeedKPH = 200.0;
        this.maxRPM = 8000; // Nissan S15 redline
        this.boostTorqueMultiplier = 2.0;
        this.wheelsPositions = [
            new BABYLON.Vector3(-0.8, 0, -2),
            new BABYLON.Vector3(-0.8, 0, 2),
            new BABYLON.Vector3(0.8, 0, -2),
            new BABYLON.Vector3(0.8, 0, 2)
        ];
        this.currentRr = this.cRr;
        this.currentGear = 1; // 0: Reverse, 1: Neutral, 2: 1st
        this.rpm = 0;
        this.oldRPM = 0;
        this.lerpedRPM = 0;
        this.boostQuantity = 1;
        this.steeringAngle = 0.0;
        this.speed = 0.0;
        this.speedKPH = 0.0;
        this.steerAmount = 0;
        this.throttleAmount = 0;
        this.brakeAmount = 0;
        this.isBoostPressed = false;
        this.clutchSlip = 0.0;
        this.wheels = [];
        this.frontWheels = [];
        this.wheelsParticles = [];
        this.exhausts = [];
        this.exhaustParticles = [];
        this.mesh = mesh.clone("mondeo", null, false, false);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1100, friction: 0 }, this.mesh.getScene());
        var childrens = this.mesh.getChildMeshes();
        for (var i = 0; i < childrens.length; i++) {
            if (childrens[i].name.substring(7, 12) == "wheel") {
                this.wheels.push(childrens[i]);
                if (childrens[i].name.substring(13, 18) == "front") {
                    this.frontWheels.push(childrens[i]);
                }
            }
            else if (childrens[i].name.substring(7, 18) == "rear_lights") {
                this.rearLights = childrens[i];
                this.rearLightsMaterial = this.rearLights.material.clone("rear_lights");
                this.rearLights.material = this.rearLightsMaterial;
                this.rearLightsMaterial.linkEmissiveWithDiffuse = true;
                this.rearLightsMaterial.emissiveTexture = null; //this.rearLightsMaterial.diffuseTexture;
                this.rearLightsMaterial.useEmissiveAsIllumination = true;
            }
            else if (childrens[i].name.substring(7, 14) == "exhaust") {
                this.exhausts.push(childrens[i]);
            }
        }
        this.forward = new BABYLON.Vector3(0, 0, 0);
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        this.enginesound = new BABYLON.Sound("Engine", "assets/sounds/engine.wav", this.mesh.getScene(), null, { volume: 0.4, loop: true, autoplay: false, spatialSound: true, distanceModel: "exponential", refDistance: 20, rolloffFactor: 2 });
        this.enginesound.attachToMesh(this.mesh);
        for (var i = 0; i < this.exhausts.length; i++) {
            var particleSystem = new BABYLON.ParticleSystem("particles", 250, this.mesh.getScene());
            particleSystem.particleTexture = new BABYLON.Texture("assets/fx/smoke.png", this.mesh.getScene());
            particleSystem.emitter = this.mesh;
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1); // Starting all From
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1); // To...
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
            particleSystem.emitRate = 0;
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            particleSystem.updateSpeed = 0.005;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.gravity = new BABYLON.Vector3(0, 3, 0);
            particleSystem.direction1 = new BABYLON.Vector3(0, 0, -1);
            particleSystem.direction2 = new BABYLON.Vector3(0, 0, -1);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            particleSystem.disposeOnStop = false;
            particleSystem.start();
            this.exhaustParticles.push(particleSystem);
        }
        for (var i = 0; i < this.wheels.length; i++) {
            var particleSystem = new BABYLON.ParticleSystem("particles", 500, this.mesh.getScene());
            particleSystem.particleTexture = new BABYLON.Texture("assets/fx/smoke.png", this.mesh.getScene());
            particleSystem.emitter = new BABYLON.Vector3(0, 6, 0);
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1); // Starting all From
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1); // To...
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 0.8;
            particleSystem.minSize = 0.5;
            particleSystem.maxSize = 1.5;
            particleSystem.emitRate = 0;
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            particleSystem.updateSpeed = 0.005;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.gravity = new BABYLON.Vector3(0, 1, 0);
            particleSystem.direction1 = this.velocity.scale(-1);
            particleSystem.direction2 = this.velocity.scale(-1);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            particleSystem.disposeOnStop = false;
            particleSystem.start();
            this.wheelsParticles.push(particleSystem);
        }
    }
    Car.prototype.resetProgression = function () {
        this.isCheckpoint2Passed = false;
        this.isCheckpoint3Passed = false;
        this.isFinishLinePassed = false;
    };
    Car.prototype.dispose = function () {
        this.mesh.dispose();
        this.enginesound.dispose();
        for (var i = 0; i < this.exhaustParticles.length; i++) {
            this.exhaustParticles[i].dispose();
        }
        for (var i = 0; i < this.wheelsParticles.length; i++) {
            this.wheelsParticles[i].dispose();
        }
    };
    Car.prototype.lerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        return a + (b - a) * clampedT;
    };
    Car.prototype.lerpUnclamped = function (a, b, t) {
        return a + (b - a) * t;
    };
    Car.prototype.logLerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        var PI = 3.14159265359;
        var logT = Math.sin(clampedT * PI * 0.5);
        return a + (b - a) * logT;
    };
    Car.prototype.expLerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        var PI = 3.14159265359;
        var expT = 1 - Math.cos(clampedT * PI * 0.5);
        return a + (b - a) * expT;
    };
    Car.prototype.setThrottle = function (value) {
        this.throttleAmount = value;
    };
    Car.prototype.setBrake = function (value) {
        this.brakeAmount = value;
    };
    Car.prototype.setBoost = function (value) {
        this.isBoostPressed = value;
    };
    Car.prototype.gearUp = function () {
        this.currentGear = Math.min(this.currentGear + 1, 7);
        this.clutchSlip = 1.0;
        this.oldRPM = this.rpm;
    };
    Car.prototype.gearDown = function () {
        this.currentGear = Math.max(this.currentGear - 1, 0);
        this.clutchSlip = 1.0;
        this.oldRPM = this.rpm;
    };
    Car.prototype.setSteer = function (value) {
        var steerValue = Math.abs(value) < 0.03 ? 0 : value;
        this.steerAmount = Math.min(Math.max(steerValue, -1), 1);
    };
    /**
     * Returns a engine torque for a given RPM
     * @param rpm: The engine RPM
     */
    Car.prototype.getTorqueForRPM = function (rpm) {
        return this.logLerp(this.engineMinTorque, this.engineMaxTorque, rpm / this.maxRPM);
    };
    /**
     * Updates the car physics
     * @param deltaTime: the time delta in seconds with the previous update
     */
    Car.prototype.update = function (deltaTime) {
        this.updateGearbox();
        this.updateEngine(deltaTime);
        this.updateSteering(deltaTime);
        this.updateEngineSound();
        this.updateSurfaceRollingResistance();
        for (var i = 0; i < this.exhaustParticles.length; i++) {
            this.exhaustParticles[i].emitter = this.mesh.position.add(this.mesh.calcMovePOV(i == 0 ? 0.6 : -0.6, 0.262, -2.465));
            this.exhaustParticles[i].direction1 = this.mesh.calcMovePOV(0, 0, -1);
            this.exhaustParticles[i].direction2 = this.mesh.calcMovePOV(0, 0, -1);
            if (this.isBoostPressed && this.boostQuantity > 0) {
                this.exhaustParticles[i].color1 = new BABYLON.Color4(1, 0, 0, 1.0);
                this.exhaustParticles[i].color2 = new BABYLON.Color4(1, 1, 0, 1.0);
                this.exhaustParticles[i].colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
                this.exhaustParticles[i].emitRate = this.exhaustParticles[i].getCapacity();
                this.exhaustParticles[i].minLifeTime = 0.3;
                this.exhaustParticles[i].maxLifeTime = 0.6;
            }
            else {
                this.exhaustParticles[i].color1 = new BABYLON.Color4(1, 1, 1, 1.0);
                this.exhaustParticles[i].color2 = new BABYLON.Color4(1, 1, 1, 1.0);
                this.exhaustParticles[i].colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
                this.exhaustParticles[i].emitRate = this.expLerp(100, 0, this.speedKPH / 30);
                this.exhaustParticles[i].minLifeTime = 0.2;
                this.exhaustParticles[i].maxLifeTime = 0.4;
            }
        }
    };
    /**
     * Updates the automatic gear
     */
    Car.prototype.updateGearbox = function () {
        if (this.rpm > this.maxRPM * 0.95 && this.currentGear > 1 && this.clutchSlip < 0.05)
            this.gearUp();
        else if (this.rpm < this.maxRPM * 0.65 && this.currentGear > 2 && this.clutchSlip < 0.05)
            this.gearDown();
    };
    /**
     * Updates the engine forces and brakes
     * @param deltaTime: the time delta in seconds with the previous update
     */
    Car.prototype.updateEngine = function (deltaTime) {
        this.forward = this.mesh.calcMovePOV(0, 0, -1);
        this.speed = this.forward.scale(BABYLON.Vector3.Dot(this.mesh.physicsImpostor.getLinearVelocity(), this.forward)).length() * 2;
        this.speedKPH = this.speed * 3.6;
        var fTraction = BABYLON.Vector3.Zero();
        var fDrag = this.forward.scale(this.cDrag * (this.speed * this.speed));
        var fRr = this.forward.scale(this.currentRr * this.speed);
        this.rpm = Math.max(Math.abs((this.speed / this.wheelRadius) * this.gearRatios[this.currentGear] * this.differentialRatio * (60 / (2 * Math.PI))), 1000);
        if (this.rearLightsMaterial != null) {
            this.rearLightsMaterial.emissiveTexture = null;
        }
        if (Math.abs(this.speed) > 0.1) {
            if (this.currentGear > 0) {
                if (this.throttleAmount > 0.03) {
                    var length = (this.getTorqueForRPM(this.rpm) * (1 - this.clutchSlip) * this.gearRatios[this.currentGear] * this.differentialRatio * this.transmissionEfficiency * this.throttleAmount) / this.wheelRadius;
                    if (this.isBoostPressed && this.boostQuantity > 0)
                        length *= this.boostTorqueMultiplier;
                    fTraction = this.forward.scale(-length);
                }
                else if (this.brakeAmount > 0.03) {
                    var length = this.brakeForce * this.brakeAmount;
                    fTraction = this.forward.scale(length);
                    if (this.rearLightsMaterial != null)
                        this.rearLightsMaterial.emissiveTexture = this.rearLightsMaterial.diffuseTexture;
                }
                else {
                    var length = this.engineVaccum * (this.rpm / this.maxRPM);
                    fTraction = this.forward.scale(length);
                }
            }
            else {
                if (this.brakeAmount > 0.03) {
                    var length = (this.getTorqueForRPM(this.rpm) * (1 - this.clutchSlip) * this.gearRatios[this.currentGear] * this.differentialRatio * this.transmissionEfficiency * this.brakeAmount) / this.wheelRadius;
                    if (this.isBoostPressed && this.boostQuantity > 0)
                        length *= this.boostTorqueMultiplier;
                    fTraction = this.forward.scale(-length);
                }
                else if (this.throttleAmount > 0.03) {
                    var length = this.brakeForce * this.throttleAmount;
                    fTraction = this.forward.scale(length);
                    if (this.rearLightsMaterial != null)
                        this.rearLightsMaterial.emissiveTexture = this.rearLightsMaterial.diffuseTexture;
                }
                else {
                    var length = this.engineVaccum * (this.rpm / this.maxRPM);
                    fTraction = this.forward.scale(length);
                }
            }
        }
        else {
            if (this.throttleAmount > 0.03) {
                this.currentGear = 2;
                fTraction = this.forward.scale(-1000);
                this.speed = 1;
            }
            else if (this.brakeAmount > 0.03) {
                this.currentGear = 0;
                fTraction = this.forward.scale(1000);
                this.speed = 1;
            }
            else {
                this.currentGear = 1;
                this.speed = 0;
            }
        }
        if (this.isBoostPressed) {
            this.boostQuantity = Math.max(0, this.boostQuantity - (deltaTime * 0.25));
        }
        else {
            this.boostQuantity = Math.min(1, this.boostQuantity + (deltaTime * 0.066667));
        }
        var fLong = BABYLON.Vector3.Zero(); // Total longitudinal force (traction force + drag force + rolling resistance force)
        var maxGearSpeed = (this.maxRPM / this.gearRatios[this.currentGear] / this.differentialRatio) * this.wheelRadius * 0.10472;
        this.speed = Math.min(this.speed, maxGearSpeed);
        if (this.currentGear > 1) {
            fLong = fTraction.add(fDrag).add(fRr);
            this.velocity = this.forward.scale(-this.speed);
        }
        else if (this.currentGear == 0) {
            fLong = fTraction.add(fDrag).add(fRr).scale(-1);
            this.velocity = this.forward.scale(this.speed);
        }
        this.speedKPH = this.speed * 3.6;
        this.velocity = this.velocity.add(new BABYLON.Vector3(0, -9.81 * deltaTime, 0));
        this.velocity = this.velocity.add(fLong.scale(1 / this.mass).scale(deltaTime));
        if (this.currentGear != 1) {
            this.mesh.physicsImpostor.setLinearVelocity(this.velocity.scale(0.5));
        }
        else {
            this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        }
        this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    };
    /**
     * Updatse car steering, rotation, and wheel rotations
     * @param deltaTime: the time delta in seconds with the previous update
     */
    Car.prototype.updateSteering = function (deltaTime) {
        var rot = this.mesh.rotationQuaternion.toEulerAngles().y;
        var maxSteerPercentage = this.logLerp(this.maxSteeringAngle, this.maxSteeringAngle * 0.1, this.speedKPH / this.maxSpeedKPH);
        var aimedAngle = this.lerpUnclamped(0, this.maxSteeringAngle * maxSteerPercentage, this.steerAmount);
        this.steeringAngle = this.lerp(this.steeringAngle, aimedAngle, 1 - Math.pow(0.05, deltaTime));
        if (Math.abs(this.steeringAngle) < 0.0004)
            this.steeringAngle = 0;
        var radius = this.wheelDistance / Math.sin(this.steeringAngle);
        var angularVelocity = 0;
        if (this.currentGear > 0)
            angularVelocity = this.speed / radius;
        else
            angularVelocity = (-this.speed) / radius;
        this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(rot + angularVelocity * deltaTime, 0, 0);
        this.clutchSlip = this.lerp(this.clutchSlip, 0, 1 - Math.pow(0.01, deltaTime));
        this.lerpedRPM = this.lerp(this.oldRPM, this.rpm, (1 - this.clutchSlip));
        var wheelMeshRadius = 1.0;
        for (var i = 0; i < this.wheels.length; i++) {
            this.wheels[i].rotation.x += (this.currentGear == 0 ? 1 : -1) * this.speed / (2 * Math.PI * wheelMeshRadius);
        }
        for (var i = 0; i < this.frontWheels.length; i++) {
            this.frontWheels[i].rotation.y = this.steeringAngle;
        }
    };
    /**
     * Speeds up engine sound relative to the current engine RPM
     */
    Car.prototype.updateEngineSound = function () {
        this.enginesound.setPlaybackRate(0.5 + 0.5 * (this.lerpedRPM / this.maxRPM));
    };
    /**
     * Detects the surface the each wheel is rolling on, and modifiy the rolling resistance accordingly
     */
    Car.prototype.updateSurfaceRollingResistance = function () {
        var color = surface === 1 ? new BABYLON.Color4(0, 1, 0, 1.0) : new BABYLON.Color4(0.87, 0.87, 0.61, 1.0);
        for (var i = 0; i < this.wheels.length; i++) {
            var start = this.mesh.position.add(this.mesh.calcMovePOV(this.wheelsPositions[i].x, this.wheelsPositions[i].y + 0.5, this.wheelsPositions[i].z));
            var end = this.mesh.position.add(this.mesh.calcMovePOV(this.wheelsPositions[i].x, this.wheelsPositions[i].y - 0.5, this.wheelsPositions[i].z));
            var rayPick = BABYLON.Ray.CreateNewFromTo(start, end);
            var meshFound = this.mesh.getScene().pickWithRay(rayPick, function (mesh) {
                if (mesh.name != "cube0" && mesh.name.substring(0, 6) != "mondeo")
                    return true;
                return false;
            }, true);
            var wheelRr = this.cRr;
            var color;
            var surface = 0;
            if (meshFound.hit) {
                if (meshFound.pickedMesh.name === "grass") {
                    wheelRr = this.cRr * 50;
                    color = new BABYLON.Color4(0.30, 0.54, 0.19, 1.0);
                    surface = 1;
                }
                else if (meshFound.pickedMesh.name === "sand") {
                    wheelRr = this.cRr * 100;
                    color = new BABYLON.Color4(0.87, 0.87, 0.61, 1.0);
                    surface = 2;
                }
            }
            this.currentRr += wheelRr;
            this.wheelsParticles[i].emitter = this.mesh.position.add(this.mesh.calcMovePOV(this.wheelsPositions[i].x, this.wheelsPositions[i].y, this.wheelsPositions[i].z));
            this.wheelsParticles[i].direction1 = this.mesh.calcMovePOV(0, 1, -1).normalize();
            this.wheelsParticles[i].direction2 = this.mesh.calcMovePOV(0, 1, -1).normalize();
            this.wheelsParticles[i].color1 = color;
            this.wheelsParticles[i].color2 = color;
            this.wheelsParticles[i].colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            this.wheelsParticles[i].emitRate = surface === 0 ? 0 : (this.speedKPH / this.maxSpeedKPH) * this.wheelsParticles[i].getCapacity();
        }
        this.currentRr /= this.wheels.length;
    };
    Car.prototype.enableParticles = function () {
        for (var i = 0; i < this.wheelsParticles.length; i++) {
            if (!this.wheelsParticles[i].isStarted())
                this.wheelsParticles[i].start();
        }
        for (var i = 0; i < this.exhaustParticles.length; i++) {
            if (!this.exhaustParticles[i].isStarted()) {
                this.exhaustParticles[i].start();
            }
        }
    };
    Car.prototype.disableParticles = function () {
        for (var i = 0; i < this.wheelsParticles.length; i++) {
            if (this.wheelsParticles[i].isStarted())
                this.wheelsParticles[i].stop();
        }
        for (var i = 0; i < this.exhaustParticles.length; i++) {
            if (this.exhaustParticles[i].isStarted())
                this.exhaustParticles[i].stop();
        }
    };
    Car.prototype.enableEngineSound = function () {
        if (!this.enginesound.isPlaying)
            this.enginesound.play();
    };
    Car.prototype.disableEngineSound = function () {
        if (this.enginesound.isPlaying)
            this.enginesound.stop();
    };
    return Car;
})();
//# sourceMappingURL=Car.js.map