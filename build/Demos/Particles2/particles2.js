var CreateParticles2TestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.95;
    camera.lowerRadiusLimit = 5;

    // Emitters
    var emitter0 = BABYLON.Mesh.CreateBox("emitter0", 0.1, scene);
    emitter0.isVisible = false;

    // Custom shader for particles
    BABYLON.Effect.ShadersStore["myParticleFragmentShader"] =
    "#ifdef GL_ES\n" +
    "precision highp float;\n" +
    "#endif\n" +

    "varying vec2 vUV;\n" +                     // Provided by babylon.js
    "varying vec4 vColor;\n" +                  // Provided by babylon.js

    "uniform sampler2D diffuseSampler;\n" +     // Provided by babylon.js
    "uniform float time;\n" +                   // This one is custom so we need to declare it to the effect

    "void main(void) {\n" +
        "vec2 position = vUV;\n" +

        "float color = 0.0;\n" +
        "vec2 center = vec2(0.5, 0.5);\n" +
	
        "color = sin(distance(position, center) * 10.0+ time * vColor.g);\n" +

        "vec4 baseColor = texture2D(diffuseSampler, vUV);\n" +

        "gl_FragColor = baseColor * vColor * vec4( vec3(color, color, color), 1.0 );\n" +
    "}\n" +
    "";

    // Effect
    var effect = engine.createEffectForParticles("myParticle", ["time"]);

    // Particles
    var particleSystem = new BABYLON.ParticleSystem("particles", 4000, scene, effect);
    particleSystem.particleTexture = new BABYLON.Texture("../../Assets/Flare.png", scene);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 1.0;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 5.0;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 3.0;
    particleSystem.emitter = emitter0;
    particleSystem.emitRate = 100;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.gravity = new BABYLON.Vector3(0, -1.0, 0);
    particleSystem.start();

    var time = 0;
    var order = 0.1;

    scene.registerBeforeRender(function () {
        // Waiting for effect to be compiled
        if (!effect) {
            return;
        }

        effect.setFloat("time", time);

        time += order;

        if (time > 100 || time < 0) {
            order *= -1;
        }
    });

    return scene;
};