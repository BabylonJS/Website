import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateDisc } from "@babylonjs/core/Meshes/Builders/discBuilder";
import { CreateGroundFromHeightMap } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

export function createBoomScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const size = 10;
    const widthCount = 30;
    const heightCount = 20;
    const gravity = -0.07;
    const restitution = 0.9;
    const friction = 0.995;
    const radius = (size * heightCount) / 12;
    const speed = radius * 1.2;

    const subdivisions = 50;
    const width = 1000;
    const height = 1000;
    const groundHeight = width / 6;

    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.4, 0.6, 0.8).toColor4(1);

    const camera = new ArcRotateCamera("camera1", 0, 0, 0, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0, 0, -800));
    camera.attachControl(canvas, true);

    const hemisphericLight = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    hemisphericLight.groundColor = new Color3(0.5, 0.5, 0.5);
    hemisphericLight.intensity = 0.2;

    const lightDirection = new Vector3(0, -1, 1);
    const directionalLight = new DirectionalLight("dl", lightDirection, scene);
    directionalLight.position = new Vector3(0, 200, -1000);
    directionalLight.diffuse = Color3.White();
    directionalLight.intensity = 0.8;
    directionalLight.specular = new Color3(0.5, 0.5, 0.2);

    const pointLight = new PointLight("pl", Vector3.Zero(), scene);
    pointLight.diffuse = Color3.White();
    pointLight.specular = Color3.Black();
    pointLight.intensity = 0.4;

    const texture = new DynamicTexture("dt", { width: 500, height: 65 }, scene);
    texture.hasAlpha = true;
    texture.drawText("BabylonJS Roxxx", null, 45, "bold 56px Arial", "blue", "red", true, false);
    texture.drawText("CLICK = BOOM", null, 60, "bold 20px Arial", "yellow", null, true, true);

    const particleMaterial = new StandardMaterial("mat1", scene);
    particleMaterial.diffuseTexture = texture;
    particleMaterial.freeze();

    const ground = CreateGroundFromHeightMap(
        "ground",
        "/Scenes/Customs/heightMap.png",
        {
            width,
            height,
            subdivisions,
            minHeight: 0,
            maxHeight: groundHeight,
            onReady: (mesh) => {
                mesh.getHeightAtCoordinates(mesh.position.x, mesh.position.z);
            },
        },
        scene
    );

    const groundMaterial = new StandardMaterial("ground", scene);
    const groundTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);
    groundTexture.uScale = 6;
    groundTexture.vScale = 6;
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.specularColor = Color3.Black();
    ground.material = groundMaterial;
    ground.isPickable = false;
    ground.position.y = -heightCount * size;
    ground.position.z = heightCount * size;
    groundMaterial.freeze();
    ground.freezeWorldMatrix();

    const disc = CreateDisc("d", { radius: width * 4 }, scene);
    disc.position.copyFrom(ground.position);
    disc.position.y -= 0.1;
    disc.rotation.x = Math.PI / 2;

    const discMaterial = new StandardMaterial("groundDisc", scene);
    const discTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);
    discTexture.uScale = 50;
    discTexture.vScale = 50;
    discMaterial.diffuseTexture = discTexture;
    discMaterial.specularColor = Color3.Black();
    discMaterial.zOffset = 1;
    discMaterial.freeze();
    disc.material = discMaterial;
    disc.isPickable = false;
    disc.freezeWorldMatrix();

    const model = CreateBox("m", { size }, scene);
    const solidParticles = new SolidParticleSystem("sps", scene, { isPickable: true });
    solidParticles.addShape(model, widthCount * heightCount);
    model.dispose();

    const particleMesh = solidParticles.buildMesh();
    particleMesh.material = particleMaterial;
    particleMesh.freezeWorldMatrix();

    const particleVars = solidParticles.vars as Record<string, any>;
    particleVars.target = Vector3.Zero();
    particleVars.temp = Vector3.Zero();
    particleVars.totalWidth = size * widthCount;
    particleVars.totalHeight = size * heightCount;
    particleVars.shiftX = -particleVars.totalWidth / 2;
    particleVars.shiftY = -particleVars.totalHeight / 2;
    particleVars.radius = radius;
    particleVars.minY = 0;
    particleVars.normal = Vector3.Zero();
    particleVars.symmetry = 0;
    particleVars.loss = 0;
    particleVars.justClicked = false;

    const shadowGenerator = new ShadowGenerator(1024, directionalLight);
    shadowGenerator.getShadowMap()?.renderList?.push(particleMesh);
    shadowGenerator.setDarkness(0.2);
    shadowGenerator.usePoissonSampling = true;
    ground.receiveShadows = true;
    disc.receiveShadows = true;

    solidParticles.initParticles = () => {
        let particleIndex = 0;
        for (let heightIndex = 0; heightIndex < heightCount; heightIndex++) {
            for (let widthIndex = 0; widthIndex < widthCount; widthIndex++) {
                const particle = solidParticles.particles[particleIndex] as any;
                particle.position.x = widthIndex * size + particleVars.shiftX;
                particle.position.y = heightIndex * size + particleVars.shiftY;
                particle.position.z = 0;
                particle.uvs.x = (widthIndex * size) / particleVars.totalWidth;
                particle.uvs.y = (heightIndex * size) / particleVars.totalHeight;
                particle.uvs.z = ((widthIndex + 1) * size) / particleVars.totalWidth;
                particle.uvs.w = ((heightIndex + 1) * size) / particleVars.totalHeight;
                particle.randomFactor = 1 / (1 + Math.random()) / 10;
                particleIndex++;
            }
        }
    };

    let exploded = false;

    solidParticles.updateParticle = (particle) => {
        const activeParticle = particle as any;

        if (particleVars.justClicked) {
            activeParticle.position.subtractToRef(particleVars.target, particleVars.temp);
            const distance = particleVars.temp.length();
            const scale = distance < 0.001 ? 1 : particleVars.radius / distance;
            particleVars.temp.normalize();
            activeParticle.velocity.x += particleVars.temp.x * scale * speed * (1 + Math.random() * 0.3);
            activeParticle.velocity.y += particleVars.temp.y * scale * speed * (1 + Math.random() * 0.3);
            activeParticle.velocity.z += particleVars.temp.z * scale * speed * (1 + Math.random() * 0.3);
            if (activeParticle.idx === solidParticles.nbParticles - 1) {
                particleVars.justClicked = false;
            }
        }

        if (exploded && !particleVars.justClicked) {
            particleVars.minY =
                ground.getHeightAtCoordinates(activeParticle.position.x, activeParticle.position.z) + size;
            particleVars.loss = -restitution * activeParticle.randomFactor * 10;

            if (activeParticle.position.y < particleVars.minY) {
                ground.getNormalAtCoordinatesToRef(
                    activeParticle.position.x,
                    activeParticle.position.z,
                    particleVars.normal
                );
                particleVars.symmetry =
                    (2 *
                        (particleVars.normal.x * activeParticle.velocity.x +
                            particleVars.normal.y * activeParticle.velocity.y +
                            particleVars.normal.z * activeParticle.velocity.z)) /
                    particleVars.normal.lengthSquared();

                activeParticle.velocity.x = particleVars.symmetry * particleVars.normal.x - activeParticle.velocity.x;
                activeParticle.velocity.z = particleVars.symmetry * particleVars.normal.z - activeParticle.velocity.z;
                activeParticle.velocity.y = particleVars.symmetry * particleVars.normal.y - activeParticle.velocity.y;
                activeParticle.velocity.x *= particleVars.loss;
                activeParticle.velocity.y *= particleVars.loss;
                activeParticle.velocity.z *= particleVars.loss;
            }

            activeParticle.velocity.y += gravity;
            activeParticle.position.x += activeParticle.velocity.x;
            activeParticle.position.y += activeParticle.velocity.y;
            activeParticle.position.z += activeParticle.velocity.z;
            activeParticle.rotation.x += activeParticle.velocity.z * activeParticle.randomFactor;
            activeParticle.rotation.y += activeParticle.velocity.x * activeParticle.randomFactor;
            activeParticle.rotation.z += activeParticle.velocity.y * activeParticle.randomFactor;

            if (activeParticle.position.y < particleVars.minY && Math.abs(activeParticle.velocity.y) < 0.1 - gravity) {
                activeParticle.velocity.x *= friction;
                activeParticle.velocity.z *= friction;
                activeParticle.position.y = particleVars.minY;
                activeParticle.velocity.y = 0;
            }
        }
        return particle;
    };

    solidParticles.afterUpdateParticles = function () {
        this.refreshVisibleSize();
    };

    solidParticles.initParticles();
    solidParticles.setParticles();
    solidParticles.computeParticleColor = false;
    solidParticles.computeParticleTexture = false;

    scene.onPointerDown = (_event, pickResult) => {
        const faceId = pickResult.faceId;
        if (faceId === -1 || faceId === undefined) {
            return;
        }

        const pickedParticle = solidParticles.pickedParticles[faceId];
        if (!pickedParticle) {
            return;
        }

        const particle = solidParticles.particles[pickedParticle.idx] as any;
        exploded = true;
        camera.position.subtractToRef(particle.position, particleVars.target);
        particleVars.target.normalize();
        particleVars.target.scaleInPlace(radius);
        particleVars.target.addInPlace(particle.position);
        particleVars.justClicked = true;
    };

    scene.registerBeforeRender(() => {
        solidParticles.setParticles();
        pointLight.position.copyFrom(camera.position);
    });

    return scene;
}
