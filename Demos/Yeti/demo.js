var demo = {
    constructor: CreateYetiScene,
    onload: function () {
        scene.activeCamera.alpha = 2;
        scene.activeCamera.beta = 1.5;
        scene.activeCamera.upperRadiusLimit = 4;
        scene.activeCamera.useAutoRotationBehavior = true;

        // Environment
        var helper = scene.createDefaultEnvironment({
            groundShadowLevel: 0.6,
        });
        helper.setMainColor(BABYLON.Color3.White());

        // FOG
        // scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        // scene.fogStart = 0;
        // scene.fogEnd = 50;
        // scene.fogDensity = .5;
        // scene.fogColor = new BABYLON.Color3(1,1,1);

        // SNOW 
        var fountain = BABYLON.Mesh.CreateBox("fountain", .1, scene);
        fountain.position.y = 5;
        fountain.isVisible = false;

        var particleSystem = new BABYLON.ParticleSystem("particles", 1500, scene, null, true);
        particleSystem.particleTexture = new BABYLON.Texture("/Assets/Yeti/snowflake.png", scene);
        particleSystem.startSpriteCellID = 1;
        particleSystem.endSpriteCellID = 3;
        particleSystem.spriteCellHeight = 512;
        particleSystem.spriteCellWidth = 512;

        // Where the particles come from
        particleSystem.emitter = fountain; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-10, 0, -10); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(10, 0, 10); // To...

        // Size of each particle (random between...
        particleSystem.minSize = .015;
        particleSystem.maxSize = .15;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 2.5;

        // Emission rate
        particleSystem.emitRate = 150;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 4;
        particleSystem.updateSpeed = 0.01;

        var gui = new dat.GUI();
        gui.add(particleSystem, 'minSize', 0.01, 1.5);
        gui.add(particleSystem, 'maxSize', 0.01, 1.5);
        gui.add(particleSystem, 'emitRate', 1, 500);
        gui.add(particleSystem, 'updateSpeed', 0.001, 1);

        // Start the particle system
        particleSystem.start();
    }
};