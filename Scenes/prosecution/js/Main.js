var Main = (function () {
    function Main(canvasID) {
        Services.initialize(canvasID);
        Services.setActiveCamera(new BABYLON.TargetCamera("Camera", new BABYLON.Vector3(0, 0, -200), Services.scene));
        // Services.scene.debugLayer.show();
        this.setupSky();
        this.loadingScreen = new LoadingScreen();
        this.loadAssets(this.onAssetsLoaded.bind(this));
    }
    Main.prototype.setupSky = function () {
        var light = new BABYLON.DirectionalLight('', new BABYLON.Vector3(1, 1, 1), Services.scene);
        light.intensity = 0.7;
        Services.scene.clearColor = new BABYLON.Color3(0, 0, 0);
        Services.scene.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, Services.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", Services.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/nebula", Services.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    };
    Main.prototype.loadAssets = function (callBack) {
        var loader = Services.loader;
        loader.addMesh("assets/Airplane.babylon");
        loader.addMesh("assets/Missile.babylon");
        loader.addMesh("assets/FastMissile.babylon");
        loader.addMesh("assets/Planet.babylon");
        loader.addMesh("assets/Mine.babylon");
        loader.addMesh("assets/Cloud1.babylon");
        loader.addMesh("assets/Cloud2.babylon");
        loader.addMesh("assets/Cloud3.babylon");
        loader.addSound("sounds/click");
        loader.addSound("sounds/enemy_death");
        loader.addSound("sounds/helicopter");
        loader.addSound("sounds/orangerocket_loop");
        loader.addSound("sounds/redrocket_loop");
        loader.addSound("sounds/prosecution_music02");
        loader.addSound("sounds/menu_music");
        Services.screensManager.openOnlyScreen(this.loadingScreen);
        loader.load(callBack, this.onLoadRatioProgress.bind(this), this.onLoadError.bind(this));
    };
    Main.prototype.onAssetsLoaded = function () {
        Planet.instance;
        this.openTitleScreen();
        this.loadingScreen.destroy();
        this.loadingScreen = null;
    };
    Main.prototype.openTitleScreen = function () {
        Services.screensManager.openOnlyScreen(new TitleScreen());
    };
    Main.prototype.removeCanvasLoader = function () {
        var canvasLoader = document.querySelector("#loader");
        canvasLoader.style.display = "none";
    };
    Main.prototype.onLoadError = function (error, taskFailed) {
        console.log(error);
    };
    Main.prototype.onLoadRatioProgress = function (ratioProgress) {
        this.loadingScreen.setRatioProgress(ratioProgress);
    };
    return Main;
}());
//# sourceMappingURL=Main.js.map