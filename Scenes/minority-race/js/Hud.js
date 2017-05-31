var Hud = (function () {
    function Hud() {
        // A changer de place
        this.defaultLapMax = 3;
        this.bestTime = " ";
        this.rpmMinAngle = 2.3562;
        this.rpmMaxAngle = 1.98968;
        this.kphMinAngle = 2.16421;
        this.kphMaxAngle = -1.32645;
        this.boostMinAngle = 1.98968;
        this.boostMaxAngle = -1.98968;
        // A enlever et utiliser la variable renvoyer par le node
        this.nbPlayer = 1;
    }
    Hud.prototype.lerp = function (a, b, t) {
        return a + (b - a) * t;
    };
    Hud.prototype.initHud = function (scene) {
        var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: "HudCanvas",
            size: new BABYLON.Size(window.innerWidth, window.innerHeight)
        });
        this.initCadrans(scene, canvas, 0.9);
        this.timer = new BABYLON.Text2D("00:00.00", {
            id: "text", parent: canvas, x: 0, y: window.innerHeight - 60,
            marginAlignment: "v : center, h: center",
            fontName: "30pt Arial Black",
        });
        this.lap = new BABYLON.Text2D("1 / 1", {
            id: "text", parent: canvas, x: -30, y: window.innerHeight - 60,
            marginAlignment: "v : center, h: right",
            fontName: "30pt Arial Black",
        });
        this.rank = new BABYLON.Text2D("1st / 1", {
            id: "text", parent: canvas, x: 20, y: window.innerHeight - 60,
            marginAlignment: "v : center, h: left",
            fontName: "30pt Arial Black",
        });
        this.countDown = new BABYLON.Text2D("0", {
            id: "text", parent: canvas, x: 0, y: window.innerHeight / 2,
            marginAlignment: "v : center, h: center",
            fontName: "60pt Arial Black",
        });
    };
    Hud.prototype.initCadrans = function (scene, canvas, scale) {
        if (scale === void 0) { scale = 1; }
        this.RPMTexture = new BABYLON.Texture("assets/hud/RPM.png", scene);
        this.RPMTexture.hasAlpha = true;
        this.RPM = new BABYLON.Sprite2D(this.RPMTexture, {
            id: "text", parent: canvas, x: 20, y: 90,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.RPMNeedleTexture = new BABYLON.Texture("assets/hud/RPM_needle.png", scene);
        this.RPMNeedleTexture.hasAlpha = true;
        this.RPMNeedle = new BABYLON.Sprite2D(this.RPMNeedleTexture, {
            id: "text", parent: this.RPM, x: 0, y: 0,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.KPHTexture = new BABYLON.Texture("assets/hud/KPH.png", scene);
        this.KPHTexture.hasAlpha = true;
        this.KPH = new BABYLON.Sprite2D(this.KPHTexture, {
            id: "text", parent: canvas, x: -160, y: -20,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.KPHNeedleTexture = new BABYLON.Texture("assets/hud/KPH_needle.png", scene);
        this.KPHNeedleTexture.hasAlpha = true;
        this.KPHNeedle = new BABYLON.Sprite2D(this.KPHNeedleTexture, {
            id: "text", parent: this.KPH, x: 0, y: 0,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.BOOSTTexture = new BABYLON.Texture("assets/hud/BOOST.png", scene);
        this.BOOSTTexture.hasAlpha = true;
        this.BOOST = new BABYLON.Sprite2D(this.BOOSTTexture, {
            id: "text", parent: canvas, x: -32, y: 7,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.BOOSTNeedleTexture = new BABYLON.Texture("assets/hud/BOOST_needle.png", scene);
        this.BOOSTNeedleTexture.hasAlpha = true;
        this.BOOSTNeedle = new BABYLON.Sprite2D(this.BOOSTNeedleTexture, {
            id: "text", parent: this.BOOST, x: 0, y: 0,
            marginAlignment: "v : center, h: right",
            scale: scale
        });
        this.speedString = new BABYLON.Text2D("000", {
            id: "text", parent: canvas, x: -265, y: 21,
            marginAlignment: "v : center, h: right",
            fontName: "22pt Arial",
            scale: scale,
        });
        this.gear = new BABYLON.Text2D("0", {
            id: "text", parent: canvas, x: -45, y: 170,
            marginAlignment: "v : center, h: right",
            fontName: "25pt Arial",
            scale: scale
        });
    };
    Hud.prototype.setTimer = function (seconds) {
        this.timer.text = this.numberToTimer(seconds);
    };
    Hud.prototype.numberToTimer = function (seconds) {
        var min = Math.floor(seconds / 60);
        var sec = Math.floor((seconds % 60) * 100) / 100;
        return (min < 10 ? "0" : "") + min + (sec < 10 ? ":0" : ":") + sec;
    };
    Hud.prototype.timerToNumber = function (timer) {
        var result = +timer.substr(0, 2) * 60 + +timer.substr(3, 2) + +timer.substr(5, 2);
        return result;
    };
    Hud.prototype.setCountDown = function (count) {
        this.countDown.text = Math.ceil(count).toString();
        this.countDown.levelVisible = (count > 0);
    };
    Hud.prototype.setLap = function (lap, maximalLap) {
        if (maximalLap === void 0) { maximalLap = null; }
        var lapMax;
        maximalLap != null ? lapMax = maximalLap : lapMax = this.defaultLapMax;
        this.lap.text = lap + "/" + lapMax;
    };
    Hud.prototype.setRank = function (rankValue) {
        if (rankValue === void 0) { rankValue = 1; }
        this.rank.text = "0" + rankValue + "/0" + this.nbPlayer;
    };
    Hud.prototype.setBestTime = function (bestTime) {
        this.rank.text = "Best Time: " + bestTime;
    };
    Hud.prototype.setBOOST = function (value) {
        this.BOOSTNeedle.rotation = this.lerp(this.boostMinAngle, this.boostMaxAngle, value);
    };
    Hud.prototype.setRPM = function (currentRPM, maxRPM) {
        this.RPMNeedle.rotation = this.lerp(this.rpmMinAngle, this.rpmMaxAngle, (currentRPM / 1000));
    };
    Hud.prototype.setKPH = function (currentKPH, maxKPH) {
        this.KPHNeedle.rotation = this.lerp(this.kphMinAngle, this.kphMaxAngle, (currentKPH / maxKPH));
        var speedFloored = Math.floor(Math.abs(currentKPH));
        this.speedString.text = "";
        if (speedFloored < 100)
            this.speedString.text += "0";
        if (speedFloored < 10)
            this.speedString.text += "0";
        this.speedString.text += speedFloored;
    };
    Hud.prototype.setGear = function (gear) {
        if (gear == 0)
            this.gear.text = "R";
        else if (gear == 1)
            this.gear.text = "N";
        else
            this.gear.text = (gear - 1).toString();
    };
    return Hud;
})();
//# sourceMappingURL=Hud.js.map