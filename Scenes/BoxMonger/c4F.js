var BOXMONGER;
(function (BOXMONGER) {
    var EqData = (function () {
        function EqData(edgeSize) {
            this._worldData = new Array(edgeSize * edgeSize * edgeSize);
            this._edgeSize = edgeSize;
        }
        EqData.prototype.getData = function (x, y) {
            return this._worldData[x * this._edgeSize + y];
        };
        EqData.prototype.setData = function (x, y, value, blocType) {
            this._worldData[x * this._edgeSize + y] = { 'blockType': blocType, 'value': value, 'pitch': 0 };
        };
        EqData.prototype.setPitch = function (x, y, pitch) {
            this._worldData[x * this._edgeSize + y].pitch = pitch;
        };
        EqData.prototype.setBoxData = function (point, dimensions, value, blockType) {
            for (var x = point.x; x < point.x + dimensions.x && x < this._edgeSize; x++) {
                for (var y = point.y; y < point.y + dimensions.y && y < this._edgeSize; y++) {
                    this.setData(x, y, value, blockType);
                }
            }
        };
        Object.defineProperty(EqData.prototype, "edgeSize", {
            get: function () {
                return this._edgeSize;
            },
            enumerable: true,
            configurable: true
        });
        EqData.STONE = 1;
        EqData.GRASS = 2;
        EqData.SNOW = 3;
        return EqData;
    }());
    BOXMONGER.EqData = EqData;
    var C4fWorldManager = (function () {
        function C4fWorldManager(edgeSize, unitBoxSize, scene) {
            this._soundVolume = 0.8;
            this._step = 1;
            this._pitchMultiplier = 10;
            this._updateEveryTweets = 50;
            this._freqStart = 0;
            this._freqStartUp = true;
            this.tweetCount = 0;
            this._worldData = new EqData(edgeSize);
            this._edgeSize = edgeSize;
            var grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
            grassMaterial.diffuseTexture = new BABYLON.Texture("./Assets/Textures/grass.png", scene);
            this._grassBox = new BOXMONGER.BoxMesh("grassBox", unitBoxSize, edgeSize * edgeSize, scene, grassMaterial);
            var snowMaterial = new BABYLON.StandardMaterial("snowMaterial", scene);
            snowMaterial.diffuseTexture = new BABYLON.Texture("./Assets/Textures/snow.png", scene);
            this._snowBox = new BOXMONGER.BoxMesh("snowBox", unitBoxSize, edgeSize * edgeSize, scene, snowMaterial);
            var stoneMaterial = new BABYLON.StandardMaterial("stoneMaterial", scene);
            stoneMaterial.diffuseTexture = new BABYLON.Texture("./Assets/Textures/stone.png", scene);
            this._stoneBox = new BOXMONGER.BoxMesh("stoneBox", unitBoxSize, edgeSize * edgeSize, scene, stoneMaterial);
            this._scene = scene;
            this.loadLogoCoordinates();
            //init global sounds
            this._swoochSound = new BABYLON.Sound("Swouch", "./Assets/Sounds/swouch.wav", this._scene, null, { loop: false, autoplay: false });
            this._shootSound = new BABYLON.Sound("Shooton", "./Assets/Sounds/shooton.wav", this._scene, null, { loop: false, autoplay: false });
            this._scratchSound = new BABYLON.Sound("Scratch", "./Assets/Sounds/scratch.wav", this._scene, null, { loop: false, autoplay: false });
            this._geekCouncilSound = new BABYLON.Sound("GeekCouncil", "./Assets/Sounds/TheGeekCouncil.wav", this._scene, null, { loop: false, autoplay: false });
            this._shootSound.setVolume(0.3);
        }
        C4fWorldManager.prototype.startSounds = function () {
            var _this = this;
            this._sounds = new Array(7);
            var loadedCount = 0;
            var sounds = this._sounds;
            var soundVolume = this._soundVolume;
            var soundLoaded = function () {
                loadedCount++;
                if (loadedCount != sounds.length) {
                    return;
                }
                for (var i = 0; i < sounds.length; i++) {
                    sounds[i].setVolume(0);
                    sounds[i].play();
                }
                _this._initialAudioStartTime = BABYLON.Engine.audioEngine.audioContext.currentTime;
                sounds[0].setVolume(soundVolume);
            };
            this._sounds[1] = new BABYLON.Sound("Violons11", "./Assets/Sounds/coding4fun2015violons11.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[0] = new BABYLON.Sound("Violons18", "./Assets/Sounds/coding4fun2015violons18.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[4] = new BABYLON.Sound("CelloLong", "./Assets/Sounds/coding4fun2015cellolong.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[5] = new BABYLON.Sound("CelloLong2", "./Assets/Sounds/coding4fun2015cellolong2.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[2] = new BABYLON.Sound("RapidoViolons", "./Assets/Sounds/coding4fun2015rapidviolons.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[3] = new BABYLON.Sound("Trombones", "./Assets/Sounds/coding4fun2015trombones.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._sounds[6] = new BABYLON.Sound("Voices", "./Assets/Sounds/coding4fun2015voices.wav", this._scene, soundLoaded, { loop: true, autoplay: false });
            this._analyzer = new BABYLON.Analyser(this._scene);
            BABYLON.Engine.audioEngine.connectToAnalyser(this._analyzer);
        };
        C4fWorldManager.prototype.nextStep = function () {
            if (this._step + 1 <= this._sounds.length) {
                this._step = this._step + 1 <= this._sounds.length ? this._step + 1 : this._step;
                var timeElapsed = BABYLON.Engine.audioEngine.audioContext.currentTime - this._initialAudioStartTime;
                console.log("Time elapsed: " + timeElapsed);
                var moduloTime = timeElapsed % 11.155;
                var syncStartTime = 11.115 - moduloTime;
                console.log("Modulo time: " + moduloTime);
                this._sounds[this._step - 1].setVolume(this._soundVolume, BABYLON.Engine.audioEngine.audioContext.currentTime + syncStartTime);
            }
        };
        C4fWorldManager.prototype.waveFromSound = function () {
            switch (this._step) {
                case 1:
                    this.moveMultipleWave();
                    break;
                case 2:
                    this.moveMultipleWave2();
                    break;
                case 3:
                    this.moveMultipleWave();
                    break;
                case 4:
                    this.moveSquares();
                    break;
                case 5:
                    this.moveMultipleWave();
                    break;
                case 6:
                    this.moveSquares();
                    break;
                case 7:
                    this.moveMultipleWave2();
                    break;
            }
        };
        C4fWorldManager.prototype.moveSquares = function () {
            this._analyzer.FFT_SIZE = 64;
            this._analyzer.BARGRAPHAMPLITUDE = 256;
            var freqs = this._analyzer.getByteFrequencyData();
            var size = this._edgeSize / 5;
            var min = size;
            var max = this._edgeSize - size;
            for (var x = min; x < max; x++) {
                for (var y = min; y < max; y++) {
                    var distanceFromCenterX = Math.abs(this._edgeSize / 2 - x);
                    var distanceFromCenterY = Math.abs(this._edgeSize / 2 - y);
                    var distanceFromCenter = distanceFromCenterX > distanceFromCenterY ? distanceFromCenterX : distanceFromCenterY;
                    var value = freqs[distanceFromCenter];
                    var pitch = value / 256;
                    pitch = pitch > 0 ? pitch * this._pitchMultiplier : 0;
                    this.setPitch(x, y, pitch);
                }
            }
        };
        C4fWorldManager.prototype.moveMultipleWave = function () {
            this._analyzer.FFT_SIZE = 64;
            this._analyzer.BARGRAPHAMPLITUDE = 256;
            var freqs = this._analyzer.getByteFrequencyData();
            var freq = 0;
            var size = this._edgeSize / 5;
            var min = size;
            var max = this._edgeSize - size;
            var up = true;
            for (var x = min; x < max; x++) {
                for (var y = min; y < max; y++) {
                    var value = freqs[freq];
                    var pitch = value / 256;
                    this.setPitch(x, y, pitch * this._pitchMultiplier);
                    if (up) {
                        freq++;
                        if (freq >= this._analyzer.FFT_SIZE / 2 - 7) {
                            up = false;
                        }
                    }
                    else {
                        freq--;
                        if (freq <= 0) {
                            up = true;
                        }
                    }
                }
            }
        };
        C4fWorldManager.prototype.moveMultipleWave2 = function () {
            this._analyzer.FFT_SIZE = 64;
            this._analyzer.BARGRAPHAMPLITUDE = 256;
            var freqs = this._analyzer.getByteFrequencyData();
            var freq = Math.floor(this._freqStart);
            var size = this._edgeSize / 5;
            var min = size;
            var max = this._edgeSize - size;
            var up = true;
            for (var x = min; x < max; x++) {
                for (var y = min; y < max; y++) {
                    var value = freqs[freq];
                    var pitch = value / 256;
                    this.setPitch(x, y, pitch * this._pitchMultiplier);
                    if (up) {
                        freq++;
                        if (freq >= this._analyzer.FFT_SIZE / 2 - 7) {
                            up = false;
                        }
                    }
                    else {
                        freq--;
                        if (freq <= 0) {
                            up = true;
                        }
                    }
                }
            }
            if (this._freqStartUp) {
                this._freqStart += 0.5;
                if (this._freqStart >= this._analyzer.FFT_SIZE / 2 - 7) {
                    this._freqStartUp = false;
                }
            }
            else {
                this._freqStart -= 0.5;
                if (this._freqStart <= 0) {
                    this._freqStartUp = true;
                }
            }
        };
        C4fWorldManager.prototype.loadNextTweets = function () {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://coding4funintroapi.azurewebsites.net/api/tweet", true);
            xhr.addEventListener("load", function () {
                if (xhr.status === 200 || BABYLON.Tools.ValidateXHRData(xhr, 1)) {
                    try {
                        var nextTweets = JSON.parse(xhr.response);
                        for (var i = 0; i < nextTweets.length; i++) {
                            BABYLON.Tools.Log("Tweet: " + nextTweets[i].Text);
                            _this.displayTweet(nextTweets[i]);
                        }
                    }
                    catch (ex) {
                        BABYLON.Tools.Error("Unable to load tweets: " + ex);
                    }
                }
                else {
                    BABYLON.Tools.Error("Unable to load tweets");
                }
            }, false);
            try {
                xhr.send();
            }
            catch (ex) {
                BABYLON.Tools.Error("CustomProceduralTexture: Error on XHR send request.");
            }
            if (this.tweetCount / this._updateEveryTweets > this._step) {
                this.nextStep();
            }
        };
        C4fWorldManager.prototype.displayTweet = function (tweet) {
            this.tweetCount++;
            var tweetText = tweet.Text;
            var tweetUser = tweet.User;
            var tweetUserImageUrl = tweet.UserImageUrl;
            //Tweet dimensions
            var tweetHeight = 2;
            var tweetWidth = 8;
            // Background
            var background = C4fWorldManager.CreateTweetPlane("background", tweetHeight, tweetWidth, this._scene, false);
            var material = new BABYLON.StandardMaterial("background", this._scene);
            background.material = material;
            //Display lane
            if (this.tweetCount % 4 === 0) {
                background.position.z = Math.random() * 10 + 2;
                background.position.x = Math.random() * 50 + 10;
            }
            else if (this.tweetCount % 4 === 1) {
                background.position.z = Math.random() * 50 + 10;
                background.position.x = Math.random() * 10 + 2;
                background.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            }
            else if (this.tweetCount % 4 === 2) {
                background.position.z = Math.random() * 10 + 65;
                background.position.x = Math.random() * 50 + 10;
                background.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            }
            else if (this.tweetCount % 4 === 3) {
                background.position.z = Math.random() * 50 + 8;
                background.position.x = Math.random() * 10 + 65;
                background.rotation = new BABYLON.Vector3(0, Math.PI + Math.PI / 2, 0);
            }
            //height
            background.position.y = Math.random() * 5 + 2;
            //Texture
            var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", { width: 200, height: 50 }, this._scene, true);
            material.ambientTexture = backgroundTexture;
            material.emissiveColor = BABYLON.Color3.White();
            material.backFaceCulling = false;
            //Drawing on texture
            var context = backgroundTexture.getContext();
            context.fillStyle = "white";
            context.fillRect(0, 0, 500, 500);
            context.fillStyle = "black";
            //Wrapping and writing text
            context.font = "bold 10px Verdana";
            context.fillText("@" + tweetUser, 78, 10);
            context.font = "normal 15px Verdana";
            context.fillText(tweetText.substring(0, 20), 78, 28);
            context.fillText(tweetText.substring(21, 41), 78, 43);
            context.fillText(tweetText.substring(42, 62), 78, 58);
            //Drawing Image
            var img = new Image();
            img.src = "./ImageProxy.ashx?imagesrc=" + tweetUserImageUrl;
            img.onload = function () {
                context.drawImage(img, 0, 0, 70, 70);
                backgroundTexture.update(true);
            };
        };
        C4fWorldManager.prototype.deleteNextForLogo = function () {
            if (this._logoCoordinates.length > 0) {
                var coordId = Math.floor(Math.random() * this._logoCoordinates.length);
                var coordToDelete = this._logoCoordinates[coordId];
                this._logoCoordinates.splice(coordId, 1);
                this.setPitch(coordToDelete.x, coordToDelete.y, 100);
                this._shootSound.play();
                return true;
            }
            return false;
        };
        C4fWorldManager.prototype.loadLogoCoordinates = function () {
            this._logoCoordinates = new Array();
            this._logoCoordinates.push(new BABYLON.Vector2(21, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 22));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 23));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 24));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 58));
            this._logoCoordinates.push(new BABYLON.Vector2(21, 59));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 22));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 23));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 24));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 58));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 59));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 60));
            this._logoCoordinates.push(new BABYLON.Vector2(22, 61));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 56));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 60));
            this._logoCoordinates.push(new BABYLON.Vector2(23, 61));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 56));
            this._logoCoordinates.push(new BABYLON.Vector2(24, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 56));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 59));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 60));
            this._logoCoordinates.push(new BABYLON.Vector2(25, 61));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 56));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 60));
            this._logoCoordinates.push(new BABYLON.Vector2(26, 61));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 22));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 23));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 24));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 56));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 58));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 59));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 60));
            this._logoCoordinates.push(new BABYLON.Vector2(27, 61));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 20));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 21));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 22));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 23));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 24));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 27));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 45));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 46));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 53));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 54));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 57));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 58));
            this._logoCoordinates.push(new BABYLON.Vector2(28, 59));
            this._logoCoordinates.push(new BABYLON.Vector2(34, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(34, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(35, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(35, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(36, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(36, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(37, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(37, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(37, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(37, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(38, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(38, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(38, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(38, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(39, 44));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 35));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 36));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(40, 44));
            this._logoCoordinates.push(new BABYLON.Vector2(41, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(41, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(42, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(42, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(43, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(43, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(44, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(44, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(51, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 32));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 33));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(52, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(53, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 49));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(54, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 30));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 31));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 50));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(55, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(56, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(57, 52));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 28));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 29));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 37));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 38));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 39));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 40));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 41));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 42));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 43));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 47));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 48));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 51));
            this._logoCoordinates.push(new BABYLON.Vector2(58, 52));
        };
        /// DEMO END HERE
        C4fWorldManager.CreateTweetPlane = function (name, height, width, scene, updatable) {
            var plane = new BABYLON.Mesh(name, scene);
            var vertexData = C4fWorldManager.CreateTweetPlaneVertexData(height, width);
            vertexData.applyToMesh(plane, updatable);
            return plane;
        };
        C4fWorldManager.CreateTweetPlaneVertexData = function (height, width) {
            var indices = [];
            var positions = [];
            var normals = [];
            var uvs = [];
            // Vertices
            var halfheight = height / 2.0;
            var halfwidth = width / 2.0;
            positions.push(-halfwidth, -halfheight, 0);
            normals.push(0, 0, -1.0);
            uvs.push(0.0, 0.0);
            positions.push(halfwidth, -halfheight, 0);
            normals.push(0, 0, -1.0);
            uvs.push(1.0, 0.0);
            positions.push(halfwidth, halfheight, 0);
            normals.push(0, 0, -1.0);
            uvs.push(1.0, 1.0);
            positions.push(-halfwidth, halfheight, 0);
            normals.push(0, 0, -1.0);
            uvs.push(0.0, 1.0);
            // Indices
            indices.push(0);
            indices.push(1);
            indices.push(2);
            indices.push(0);
            indices.push(2);
            indices.push(3);
            // Result
            var vertexData = new BABYLON.VertexData();
            vertexData.indices = indices;
            vertexData.positions = positions;
            vertexData.normals = normals;
            vertexData.uvs = uvs;
            return vertexData;
        };
        C4fWorldManager.prototype.fadeSounds = function () {
            for (var i = 0; i < this._sounds.length; i++) {
                if (this._sounds[i].getVolume() > 0)
                    this._sounds[i].setVolume(0, BABYLON.Engine.audioEngine.audioContext.currentTime + 2);
            }
        };
        C4fWorldManager.prototype.stopSounds = function () {
            for (var i = 0; i < this._sounds.length; i++) {
                this._sounds[i].stop();
            }
        };
        C4fWorldManager.prototype.moveSquare = function (up, distanceFromCenter) {
            var size = this._edgeSize / 5;
            var min = size;
            var max = this._edgeSize - size;
            var moved = false;
            for (var x = min; x < max; x++) {
                for (var y = min; y < max; y++) {
                    var distanceFromCenterX = Math.abs(this._edgeSize / 2 - x);
                    var distanceFromCenterY = Math.abs(this._edgeSize / 2 - y);
                    var distanceFromCenterComputed = distanceFromCenterX > distanceFromCenterY ? distanceFromCenterX : distanceFromCenterY;
                    if (distanceFromCenterComputed === distanceFromCenter) {
                        var pitch = 0;
                        if (!up) {
                            pitch = -this._worldData.getData(x, y).value + (Math.floor((Math.random() * 0.2) * 100) / 100);
                        }
                        this.setPitch(x, y, pitch);
                        moved = true;
                    }
                }
            }
            if (moved)
                this._swoochSound.play();
        };
        C4fWorldManager.prototype.setPitch = function (x, y, pitch) {
            var current = this._worldData.getData(x, y);
            if (current === undefined)
                return;
            if (current.blockType === EqData.SNOW) {
                this._snowBox.moveBox(x, current.value + current.pitch, y, x, current.value + pitch, y);
            }
            else if (current.blockType === EqData.STONE) {
                this._stoneBox.moveBox(x, current.value + current.pitch, y, x, current.value + pitch, y);
            }
            else if (current.blockType === EqData.GRASS) {
                this._grassBox.moveBox(x, current.value + current.pitch, y, x, current.value + pitch, y);
            }
            this._worldData.setPitch(x, y, pitch);
        };
        C4fWorldManager.prototype.playSratch = function () {
            this._scratchSound.play();
        };
        C4fWorldManager.prototype.startFinish = function () {
            this._geekCouncilSound.play();
        };
        C4fWorldManager.prototype.initPlane = function () {
            this._snowHeight = 0;
            this._stoneHeight = 0;
            this._grassHeight = 0;
            var varianceFromCenter = 0.3;
            this.setHeightForBlockType(0, EqData.STONE, varianceFromCenter);
            this.setHeightForBlockType(7, EqData.GRASS, varianceFromCenter);
            this.setHeightForBlockType(5, EqData.SNOW, varianceFromCenter);
        };
        C4fWorldManager.prototype.addBox = function (x, y, z) {
            this._grassBox.addBox(x, y, z);
        };
        C4fWorldManager.prototype.removeBox = function (x, y, z) {
            this._grassBox.removeBox(x, y, z);
        };
        C4fWorldManager.prototype.Update = function () {
            this._grassBox.updateMesh();
            this._stoneBox.updateMesh();
            this._snowBox.updateMesh();
        };
        C4fWorldManager.prototype.setHeightForBlockType = function (height, blockType, variance) {
            var size = this._edgeSize / 5;
            if (blockType === EqData.SNOW) {
                var start = size * 2;
                var max = size * 3;
                for (var x = start; x < max; x++) {
                    for (var y = start; y < max; y++) {
                        var pitch = Math.floor((Math.random() * 0.2) * 100) / 100;
                        this._snowBox.addBox(x, height + pitch, y);
                        this._worldData.setData(x, y, height + pitch, EqData.SNOW);
                        this.setPitch(x, y, -(height));
                    }
                }
            }
            else if (blockType === EqData.GRASS) {
                var start = size;
                var max = start * 4;
                var nogozonestart = size * 2;
                var nogozonemax = size * 3;
                for (var x = start; x < max; x++) {
                    for (var y = start; y < max; y++) {
                        if (x >= nogozonestart && x < nogozonemax && y >= nogozonestart && y < nogozonemax)
                            continue;
                        var distanceFromCenterX = Math.abs(this._edgeSize / 2 - x);
                        var distanceFromCenterY = Math.abs(this._edgeSize / 2 - y);
                        var distanceFromCenter = distanceFromCenterX > distanceFromCenterY ? distanceFromCenterX : distanceFromCenterY;
                        var pitch = Math.floor((Math.random() * 0.2) * 100) / 100;
                        this._worldData.setData(x, y, height - (variance * distanceFromCenter + pitch), EqData.GRASS);
                        this._grassBox.addBox(x, height - (variance * distanceFromCenter + pitch), y);
                        this.setPitch(x, y, -(height - (variance * distanceFromCenter)));
                    }
                }
            }
            else if (blockType === EqData.STONE) {
                var start = 0;
                var max = this._edgeSize;
                var nogozonestart = size;
                var nogozonemax = size * 4;
                for (var x = start; x < max; x++) {
                    for (var y = start; y < max; y++) {
                        if (x >= nogozonestart && x < nogozonemax && y >= nogozonestart && y < nogozonemax)
                            continue;
                        this._worldData.setData(x, y, height, EqData.STONE);
                        var pitch = Math.floor((Math.random() * 0.2) * 100) / 100;
                        this._stoneBox.addBox(x, height + pitch, y);
                    }
                }
            }
        };
        return C4fWorldManager;
    }());
    BOXMONGER.C4fWorldManager = C4fWorldManager;
})(BOXMONGER || (BOXMONGER = {}));
//# sourceMappingURL=c4F.js.map