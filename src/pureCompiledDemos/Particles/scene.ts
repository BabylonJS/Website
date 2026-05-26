import {
    ArcRotateCamera,
    Color3,
    Color4,
    CreateBox,
    Engine,
    MirrorTexture,
    ParticleSystem,
    Plane,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
const particleTextureUrl = "/Scenes/WorldMonger/Assets/Flare.png";

export function createParticlesScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 5;
    camera.attachControl(canvas, true);

    const mirror = CreateBox("Mirror", { size: 1 }, scene);
    mirror.scaling = new Vector3(100, 0.01, 100);
    mirror.position.set(0, 0, 0);

    const mirrorMaterial = new StandardMaterial("mirror", scene);
    const mirrorTexture = new MirrorTexture("mirror", 512, scene, true);
    mirrorTexture.mirrorPlane = new Plane(0, -1, 0, 0);
    mirrorTexture.level = 0.2;
    mirrorMaterial.diffuseColor = new Color3(0.4, 0.4, 0.4);
    mirrorMaterial.specularColor = Color3.Black();
    mirrorMaterial.reflectionTexture = mirrorTexture;
    mirror.material = mirrorMaterial;

    const emitter0 = CreateBox("emitter0", { size: 0.1 }, scene);
    emitter0.isVisible = false;
    const emitter1 = CreateBox("emitter1", { size: 0.1 }, scene);
    emitter1.isVisible = false;
    mirrorTexture.renderList = [emitter0, emitter1];

    const particleSystem = new ParticleSystem("particles", 4000, scene);
    particleSystem.particleTexture = new Texture(particleTextureUrl, scene);
    particleSystem.minAngularSpeed = -0.5;
    particleSystem.maxAngularSpeed = 0.5;
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 2;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 4;
    particleSystem.emitter = emitter0;
    particleSystem.emitRate = 400;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.minEmitBox = new Vector3(-0.5, 0, -0.5);
    particleSystem.maxEmitBox = new Vector3(0.5, 0, 0.5);
    particleSystem.direction1 = new Vector3(-1, 1, -1);
    particleSystem.direction2 = new Vector3(1, 1, 1);
    particleSystem.color1 = new Color4(1, 0, 0, 1);
    particleSystem.color2 = new Color4(0, 1, 1, 1);
    particleSystem.gravity = new Vector3(0, -2, 0);
    particleSystem.start();

    const particleSystem2 = new ParticleSystem("particles2", 4000, scene);
    particleSystem2.particleTexture = new Texture(particleTextureUrl, scene);
    particleSystem2.minSize = 0.1;
    particleSystem2.maxSize = 0.3;
    particleSystem2.minEmitPower = 1;
    particleSystem2.maxEmitPower = 2;
    particleSystem2.minLifeTime = 0.5;
    particleSystem2.maxLifeTime = 1;
    particleSystem2.emitter = emitter1;
    particleSystem2.emitRate = 500;
    particleSystem2.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem2.minEmitBox = Vector3.Zero();
    particleSystem2.maxEmitBox = Vector3.Zero();
    particleSystem2.gravity = new Vector3(0, -0.5, 0);
    particleSystem2.direction1 = Vector3.Zero();
    particleSystem2.direction2 = Vector3.Zero();
    particleSystem2.start();

    let alpha = 0;
    scene.registerBeforeRender(() => {
        emitter1.position.x = 3 * Math.cos(alpha);
        emitter1.position.y = 1;
        emitter1.position.z = 3 * Math.sin(alpha);
        alpha += 0.05 * scene.getAnimationRatio();
    });

    return scene;
}
