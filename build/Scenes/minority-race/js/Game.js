/// <reference path=".\typings\babylon.d.ts" />
/// <reference path=".\typings\babylon.skyMaterial.d.ts" />
/// <reference path=".\Socket.ts" />
/// <reference path=".\Car.ts" />
/// <reference path=".\Hud.ts" />
/// <reference path=".\CheckpointManager.ts" />
/// <reference path=".\GamepadController.ts" />
/// <reference path=".\KeyboardController.ts" />
/// <reference path=".\MenuManager.ts" />
var Game = (function () {
    function Game(canvasId) {
        var _this = this;
        this.MAX_PLAYERS = 4;
        this.version = 5;
        this.myID = 0;
        this.frame = 0;
        this.frametimes = [];
        this.cars = [];
        this.positions = [
            new BABYLON.Vector3(-65.3, 5.1, 96.5),
            new BABYLON.Vector3(-56.5, 5.1, 91.6),
            new BABYLON.Vector3(-57.5, 5.1, 82.5),
            new BABYLON.Vector3(-49.2, 5.1, 80.0)
        ];
        this.timer = 0;
        this.isTimerLoop = true;
        this.timeToSecond = 0;
        this.bestTime = 0;
        this.nbPlayer = 1;
        this.checkpoints = [];
        this.controllable = false;
        this.launchTime = 0;
        this.endTime = 0;
        this.laps = 0;
        this.maxLaps = 3;
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        BABYLON.Engine.ShadersRepository = "shaders/";
        for (var i = 0; i < this.MAX_PLAYERS; i++) {
            this.cars.push(null);
        }
        this.scene = null;
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this._run();
    }
    Game.prototype.lerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        return a + (b - a) * clampedT;
    };
    Game.prototype.logLerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        var PI = 3.14159265359;
        var expT = Math.sin(clampedT * PI * 0.5);
        return a + (b - a) * expT;
    };
    Game.prototype.expLerp = function (a, b, t) {
        var clampedT = Math.min(Math.max(t, 0), 1);
        var PI = 3.14159265359;
        var expT = 1 - Math.cos(clampedT * PI * 0.5);
        return a + (b - a) * expT;
    };
    Game.prototype.stopTimer = function () {
        this.isTimerLoop = false;
    };
    Game.prototype.startTimer = function () {
        this.isTimerLoop = true;
    };
    Game.prototype.resetTimer = function () {
        this.timer = 0;
        this.timeToSecond = 0;
    };
    Game.prototype._run = function () {
        var _this = this;
        this._initScene();
        this.gamepad = new GamepadController();
        this.keyboard = new KeyboardController();
        this.hud = new Hud();
        this.hud.initHud(this.scene);
        this.hud.setBestTime(this.hud.numberToTimer(this.bestTime));
        var loader = new BABYLON.AssetsManager(this.scene);
        // LOAD TRACK
        var meshTask = loader.addMeshTask('magione', '', 'assets/magione/', 'magione.babylon');
        meshTask.onSuccess = function (task) {
            var taskMesh = task;
            _this.trackMesh = taskMesh.loadedMeshes[0];
            for (var i = 0; i < taskMesh.loadedMeshes.length; i++) {
                taskMesh.loadedMeshes[i].freezeWorldMatrix();
                if (taskMesh.loadedMeshes[i].name.substring(0, 3) == "col") {
                    taskMesh.loadedMeshes[i].parent = null;
                    taskMesh.loadedMeshes[i].physicsImpostor = new BABYLON.PhysicsImpostor(taskMesh.loadedMeshes[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, _this.scene);
                    taskMesh.loadedMeshes[i].visibility = 0;
                }
                if (taskMesh.loadedMeshes[i].name.substring(0, 10) == "checkpoint") {
                    _this.checkpoints.push(taskMesh.loadedMeshes[i]);
                }
            }
        };
        // LOAD CAR
        meshTask = loader.addMeshTask('mondeo', '', 'assets/mondeo/', 'car.babylon');
        meshTask.onSuccess = function (task) {
            var taskMesh = task;
            _this.carMesh = taskMesh.loadedMeshes[0];
            _this.carMesh.visibility = 0;
            _this.carMesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
            _this.carMesh.position = new BABYLON.Vector3(1000, -1000, 1000);
        };
        loader.onFinish = function (tasks) {
            _this.raceSound = new BABYLON.Sound("RaceSound", "assets/sounds/music_race.wav", _this.scene, null, { loop: true, autoplay: false, volume: 1 });
            _this.menuSound = new BABYLON.Sound("MenuSound", "assets/sounds/music_menu.wav", _this.scene, null, { loop: true, autoplay: true, volume: 1 });
            _this._initGame();
            _this.engine.runRenderLoop(function () { _this._updateGame(); _this.scene.render(); });
        };
        this.scene.executeWhenReady(function () {
            _this.scene.meshes[0].receiveShadows = false;
            for (var i = 1; i < _this.scene.meshes.length; i++) {
                var mesh = _this.scene.meshes[i];
                if (mesh.parent == _this.car.mesh) {
                    _this.shadowCar.getShadowMap().renderList.push(mesh);
                    mesh.receiveShadows = false;
                }
                else if (mesh != _this.car.mesh && mesh != _this.trackMesh) {
                    mesh.receiveShadows = true;
                }
            }
            _this.checkpointManager = new CheckpointManager();
            _this.checkpointManager.initCheckpoints(_this.scene, _this.checkpoints, _this.car);
            // Remove loader
            var loaderDiv = document.querySelector("#loader");
            loaderDiv.style.display = "none";
        });
        loader.onTaskError = function (task) {
            console.error("[ERROR] Error while downloading assets!");
        };
        // Démarre le chargement
        loader.load();
    };
    Game.prototype._initScene = function () {
        this.scene = new BABYLON.Scene(this.engine);
        var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        this.physicsPlugin = new BABYLON.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, this.physicsPlugin);
        this.lightDirection = new BABYLON.Vector3(0.1, -1, 0.8);
        this.lightDirection = this.lightDirection.normalize();
        this.scene.fogEnabled = true;
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.005;
        this.scene.fogColor = new BABYLON.Color3(0.74, 0.78, 0.8);
        this.camera = new BABYLON.FollowCamera("FollowCamera", new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this.engine.getRenderingCanvas());
        this.camera.maxZ = 600;
        var sun = new BABYLON.DirectionalLight("Dir0", this.lightDirection, this.scene);
        sun.intensity = 1;
        sun.diffuse = new BABYLON.Color3(1, 1, 0.9);
        sun.specular = new BABYLON.Color3(1, 1, 1);
        var skyLight = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), this.scene);
        skyLight.diffuse = new BABYLON.Color3(0.3, 0.3, 0.8);
        skyLight.specular = new BABYLON.Color3(1, 1, 1);
        skyLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        skyLight.intensity = 0.5;
        this.shadowCar = new BABYLON.ShadowGenerator(256, sun);
        this.shadowCar.useBlurVarianceShadowMap = true;
        var lightPos = this.lightDirection.scale(-100);
        var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", this.scene);
        skyMaterial.backFaceCulling = false;
        skyMaterial.fogEnabled = false;
        skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
        skyMaterial.sunPosition = lightPos;
        this.skybox = BABYLON.Mesh.CreateBox("skyBox", 599.0, this.scene);
        this.skybox.material = skyMaterial;
        this.skybox.parent = this.camera;
        var groundCollision = BABYLON.MeshBuilder.CreateBox('cube0', { width: 1000, height: 10, depth: 1000 }, this.scene);
        groundCollision.visibility = 0;
        groundCollision.position = new BABYLON.Vector3(0, 0, 10);
        groundCollision.physicsImpostor = new BABYLON.PhysicsImpostor(groundCollision, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
    };
    Game.prototype._initGame = function () {
        //this.scene.debugLayer.show();
        var _this = this;
        this.car = new Car(this.carMesh);
        this.oldCarForward = new BABYLON.Vector3(0, 0, 1);
        this.car.mesh.position = this.positions[this.myID % 4].clone();
        this.car.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2.6, 0, 0);
        this.menu = new MenuManager();
        this.menu.initMenu(this.scene);
        this.menuSound.play();
        this.menu.onLaunchMultiplayerRace = function (date) {
            _this.myID = Socket.id;
            _this.launchTime = date;
            _this.stopTimer();
            _this.resetTimer();
            _this.laps = 0;
            _this.car.boostQuantity = 1;
            _this.hud.setLap(_this.laps, _this.maxLaps);
            _this.car.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            _this.car.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
            _this.car.mesh.position = _this.positions[_this.myID % 4].clone();
            _this.car.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2.6, 0, 0);
            Socket.on('update', function (infos) {
                var id = infos.id;
                if (id != _this.myID && infos.version == _this.version) {
                    if (_this.cars[id] == null && _this.carMesh != null) {
                        _this.cars[id] = new Car(_this.carMesh);
                    }
                    if (_this.cars[id] != null) {
                        /*
                        version: this.version,
                        position: this.car.mesh.position,
                        rotation: this.car.mesh.rotationQuaternion,
                        velocity: this.car.velocity,
                        currentGear: this.car.currentGear,
                        now: Date.now(),
                        throttle: throttleValue,
                        brake: [0 - 1],
                        steer: [-1 - 1],
                        boost: [true - false];
                        */
                        var car = _this.cars[id];
                        var newPos = new BABYLON.Vector3(infos.position.x, 5.0, infos.position.z);
                        if (BABYLON.Vector3.Distance(car.mesh.position, newPos) > 0.3)
                            car.mesh.setAbsolutePosition(newPos);
                        car.mesh.rotationQuaternion = new BABYLON.Quaternion(infos.rotation.x, infos.rotation.y, infos.rotation.z, infos.rotation.w);
                        car.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(infos.velocity.x, 0.0, infos.velocity.z));
                        car.currentGear = infos.currentGear;
                        car.setSteer(infos.steer);
                        car.setThrottle(infos.throttle);
                        car.setBrake(infos.brake);
                        car.setBoost(infos.boost);
                    }
                }
            });
            Socket.on('playerconnected', function (playerID) {
                console.log("[INFO] Un joueur s'est connecte (ID: " + playerID + ")");
            });
            Socket.on('playerdisconnected', function (playerID) {
                if (playerID != _this.myID && _this.cars[playerID] != null) {
                    console.log("[INFO] Un joueur s'est deconnecte (ID: " + playerID + ")");
                    _this.cars[playerID].dispose();
                    _this.cars[playerID] = null;
                }
            });
            Socket.on('endcountdown', function (countdown) {
                _this.endTime = countdown;
            });
            if (_this.raceSound.isPlaying)
                _this.raceSound.stop();
            if (_this.menuSound.isPlaying)
                _this.menuSound.stop();
            _this.raceSound.play();
            _this.car.enableEngineSound();
        };
        this.menu.onLaunchSingleplayerRace = function () {
            _this.resetTimer();
            _this.stopTimer();
            _this.launchTime = (Date.now() / 1000) + 5;
            _this.controllable = false;
            _this.laps = 0;
            _this.hud.setLap(_this.laps, _this.maxLaps);
            _this.car.boostQuantity = 1;
            _this.car.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            _this.car.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
            _this.car.mesh.position = _this.positions[_this.myID % 4].clone();
            _this.car.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2.6, 0, 0);
            if (_this.raceSound.isPlaying)
                _this.raceSound.stop();
            if (_this.menuSound.isPlaying)
                _this.menuSound.stop();
            _this.raceSound.play();
            _this.car.enableEngineSound();
        };
    };
    Game.prototype.finish = function () {
        if (this.hud.timerToNumber(this.hud.timer.text) < this.bestTime || this.bestTime == 0) {
            this.bestTime = this.hud.timerToNumber(this.hud.timer.text);
            this.hud.setBestTime(this.hud.timer.text);
        }
        this.resetTimer();
        this.car.resetProgression();
    };
    Game.prototype._updateGame = function () {
        if (this.launchTime > 0) {
            var now = Date.now() / 1000;
            var delta = this.launchTime - now;
            this.hud.setCountDown(delta);
            if (delta <= 0) {
                this.launchTime = 0;
                this.startTimer();
                this.controllable = true;
            }
        }
        else if (this.endTime > 0) {
            var now = Date.now() / 1000;
            var delta = this.endTime - now;
            this.hud.setCountDown(delta);
            if (delta <= 0) {
                this.endTime = 0;
                this.stopTimer();
                this.controllable = false;
                this.car.disableEngineSound();
                if (this.raceSound.isPlaying)
                    this.raceSound.stop();
                if (this.menuSound.isPlaying)
                    this.menuSound.stop();
                this.menuSound.play();
                this.menu.onEndCountdownFinished();
            }
        }
        if (this.checkpointManager != null) {
            if (this.checkpointManager.verifyCheckpoints(this.car)) {
                this.finish();
                this.laps++;
                this.hud.setLap(this.laps, this.maxLaps);
                if (Socket.isConnected) {
                    Socket.emit("lap", this.laps);
                }
                else {
                    switch (this.laps) {
                        case 1:
                            this.firstLapTime = this.hud.timer.text;
                            break;
                        case 2:
                            this.secondLapTime = this.hud.timer.text;
                            break;
                        case 3:
                            this.thirdLapTime = this.hud.timer.text;
                            break;
                    }
                    if (this.laps == this.maxLaps) {
                        this.controllable = false;
                        this.launchTime = 0;
                        this.endTime = 0;
                        this.stopTimer();
                        this.menu.onSoloRaceFinished(["Premier tour: " + this.firstLapTime, "Deuxieme tour: " + this.secondLapTime, "Troisieme tour: " + this.thirdLapTime]);
                        if (this.raceSound.isPlaying)
                            this.raceSound.stop();
                        if (this.menuSound.isPlaying)
                            this.menuSound.stop();
                        this.menuSound.play();
                        this.car.disableEngineSound();
                    }
                }
            }
            ;
        }
        // FRAMETIME SMOOTHER
        var deltaTime = Math.min(Math.max(this.engine.getDeltaTime() / 1000, 1 / 200), 1);
        var smoothDeltaTime = 0;
        this.frametimes.push(deltaTime);
        if (this.frametimes.length > 10)
            this.frametimes.shift();
        var weight = 1 / this.frametimes.length;
        for (var i = 0; i < this.frametimes.length; i++) {
            smoothDeltaTime += this.frametimes[i] * weight;
        }
        deltaTime = smoothDeltaTime;
        this.physicsPlugin.setTimeStep(deltaTime);
        this.gamepad.update();
        var throttleValue = this.gamepad.isGamepadConnected ? this.gamepad.rightTrigger : (this.keyboard.isThrottlePressed ? 1 : 0);
        var brakeValue = this.gamepad.isGamepadConnected ? this.gamepad.leftTrigger : (this.keyboard.isBrakePressed ? 1 : 0);
        var steerValue = this.gamepad.isGamepadConnected ? this.gamepad.directionX : (this.keyboard.isSteerLeftPressed ? -1 : (this.keyboard.isSteerRightPressed ? 1 : 0));
        var boostValue = this.gamepad.isGamepadConnected ? this.gamepad.boost : this.keyboard.isBoostPressed;
        if (!this.controllable) {
            throttleValue = 0;
            brakeValue = 0;
            steerValue = 0;
            boostValue = false;
        }
        this.car.setSteer(steerValue);
        this.car.setThrottle(throttleValue);
        this.car.setBrake(brakeValue);
        this.car.setBoost(boostValue);
        this.car.update(deltaTime);
        this.hud.setGear(this.car.currentGear);
        this.hud.setRPM(this.car.lerpedRPM, this.car.maxRPM);
        this.hud.setKPH(this.car.speedKPH, this.car.maxSpeedKPH);
        this.hud.setBOOST(this.car.boostQuantity);
        if (this.isTimerLoop) {
            this.timer += this.engine.getDeltaTime() / 1000;
            this.hud.setTimer(this.timer);
        }
        else {
            this.hud.setTimer(0);
        }
        this.shadowCar.getLight().position = this.car.mesh.position.add(this.lightDirection.scale(5));
        this.oldCarForward = BABYLON.Vector3.Lerp(this.oldCarForward, this.car.forward, 1 - Math.pow(0.1, deltaTime));
        this.camera.setTarget(this.car.mesh.position.add(this.car.forward.scale(-1).add(new BABYLON.Vector3(0, 2, 0))));
        var newPos = this.car.mesh.position.add(this.oldCarForward.scale(8).add(new BABYLON.Vector3(0, 2.5, 0)));
        this.camera.position = newPos;
        this.camera.fov = this.expLerp(0.873, 1.55473, this.car.speedKPH / this.car.maxSpeedKPH);
        if (this.keyboard.isResetPressed) {
            this.resetCar();
        }
        for (var i = 0; i < this.MAX_PLAYERS; i++) {
            if (this.cars[i] != null) {
                var distance = BABYLON.Vector3.Distance(this.camera.position, this.cars[i].mesh.absolutePosition);
                if (this.camera.isInFrustum(this.cars[i].mesh) || distance < 25) {
                    this.cars[i].update(deltaTime);
                }
                if (this.camera.isInFrustum(this.cars[i].mesh) && distance < 40) {
                    this.cars[i].enableParticles();
                }
                else {
                    this.cars[i].disableParticles();
                }
            }
        }
        if (Socket.isConnected) {
            this.frame += deltaTime;
            if (this.frame > (1 / 4)) {
                this.frame = 0;
                Socket.emit("update", {
                    version: this.version,
                    position: this.car.mesh.getAbsolutePosition(),
                    rotation: this.car.mesh.rotationQuaternion,
                    velocity: this.car.mesh.physicsImpostor.getLinearVelocity(),
                    currentGear: this.car.currentGear,
                    now: Date.now(),
                    throttle: throttleValue,
                    brake: brakeValue,
                    steer: steerValue,
                    boost: boostValue
                });
            }
        }
    };
    Game.prototype.resetCar = function () {
        this.car.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        this.car.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
        this.car.mesh.position = this.positions[this.myID % 4].clone();
        this.car.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2.6, 0, 0);
    };
    return Game;
})();
//# sourceMappingURL=Game.js.map