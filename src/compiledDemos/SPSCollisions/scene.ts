import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreatePolyhedron } from "@babylonjs/core/Meshes/Builders/polyhedronBuilder";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import type { SolidParticle } from "@babylonjs/core/Particles/solidParticle";
import { Scene } from "@babylonjs/core/scene";

export function createSPSCollisionsTestScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.4, 0.6, 0.9).toColor4(1);
    const camera = new ArcRotateCamera("camera1", 0, 0, 0, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(0, 100, -200));
    camera.attachControl(canvas, true);

    const pl = new PointLight("pl", new Vector3(0, 0, 0), scene);
    pl.diffuse = new Color3(1, 1, 1);
    pl.specular = new Color3(1, 1, 0.8);
    pl.intensity = 0.95;
    pl.position = camera.position;

    const sphereRadius = 18.0;
    const boxSize = 4.0;
    const ground = CreateGround("gd", { width: 1000.0, height: 1000.0 }, scene);
    const sphere = CreateSphere("sphere", { segments: 10, diameter: sphereRadius * 2.0 }, scene);
    const box = CreateBox("b", { size: boxSize }, scene);
    const poly = CreatePolyhedron("p", { size: boxSize, type: 4, flat: true }, scene);
    const tetra = CreatePolyhedron("t", { size: boxSize / 2.0, flat: true }, scene);
    const matSphere = new StandardMaterial("ms", scene);
    const matGround = new StandardMaterial("mg", scene);
    matSphere.diffuseColor = Color3.Red();
    matGround.diffuseColor = new Color3(0.65, 0.6, 0.5);
    sphere.material = matSphere;
    ground.material = matGround;
    ground.freezeWorldMatrix();
    matSphere.freeze();
    matGround.freeze();

    // Particle system
    const particleNb = 1200;
    const nb = (particleNb / 3) | 0;
    const SPS = new SolidParticleSystem("SPS", scene, { particleIntersection: true });
    SPS.addShape(box, nb);
    SPS.addShape(poly, nb);
    SPS.addShape(tetra, nb);
    box.dispose();
    poly.dispose();
    tetra.dispose();
    const mesh = SPS.buildMesh();
    mesh.hasVertexAlpha = true;
    SPS.isAlwaysVisible = true;
    SPS.computeParticleTexture = false;

    // position things
    mesh.position.y = 80.0;
    mesh.position.x = -70.0;
    const sphereAltitude = mesh.position.y / 2.0;
    sphere.position.y = sphereAltitude;

    // shared variables
    const speed = 1.9; // particle max speed
    const cone = 0.5; // emitter aperture
    const gravity = -speed / 100; // gravity
    const restitution = 0.99; // energy restitution
    let k = 0.0;
    let sign = 1;
    const tmpPos = Vector3.Zero(); // current particle world position
    const tmpNormal = Vector3.Zero(); // current sphere normal on intersection point
    let tmpDot = 0.0; // current dot product
    let bboxesComputed = false; // the bbox are actually computed only after the first particle.update()

    // SPS initialization : just recycle all
    SPS.initParticles = function () {
        for (let p = 0; p < SPS.nbParticles; p++) {
            SPS.recycleParticle(SPS.particles[p]);
        }
    };

    // recycle : reset the particle at the emitter origin
    SPS.recycleParticle = function (particle: SolidParticle) {
        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;
        particle.velocity.x = Math.random() * speed;
        particle.velocity.y = (Math.random() - 0.3) * cone * speed;
        particle.velocity.z = (Math.random() - 0.5) * cone * speed;

        particle.rotation.x = Math.random() * Math.PI;
        particle.rotation.y = Math.random() * Math.PI;
        particle.rotation.z = Math.random() * Math.PI;

        particle.scaling.x = Math.random() + 0.1;
        particle.scaling.y = Math.random() + 0.1;
        particle.scaling.z = Math.random() + 0.1;

        particle.color!.r = Math.random() + 0.1;
        particle.color!.g = Math.random() + 0.1;
        particle.color!.b = Math.random() + 0.1;
        particle.color!.a = 1.0;
        return particle;
    };

    // particle behavior
    SPS.updateParticle = function (particle: SolidParticle) {
        // recycle if touched the ground
        if (particle.position.y + mesh.position.y < ground.position.y + boxSize) {
            particle.position.y = ground.position.y - mesh.position.y + boxSize / 2.0;
            particle.color!.a -= 0.05;
            if (particle.color!.a < 0) {
                this.recycleParticle(particle);
            }
            return particle;
        }

        // update velocity, rotation and position
        particle.velocity.y += gravity; // apply gravity to y
        particle.position.addInPlace(particle.velocity); // update particle new position
        sign = particle.idx % 2 == 0 ? 1 : -1; // rotation sign and then new value
        particle.rotation.z += 0.1 * sign;
        particle.rotation.x += 0.05 * sign;
        particle.rotation.y += 0.008 * sign;

        // intersection
        if (bboxesComputed && particle.intersectsMesh(sphere)) {
            particle.position.addToRef(mesh.position, tmpPos); // particle World position
            tmpPos.subtractToRef(sphere.position, tmpNormal); // normal to the sphere
            tmpNormal.normalize(); // normalize the sphere normal
            tmpDot = Vector3.Dot(particle.velocity, tmpNormal); // dot product (velocity, normal)
            // bounce result computation
            particle.velocity.x = -particle.velocity.x + 2.0 * tmpDot * tmpNormal.x;
            particle.velocity.y = -particle.velocity.y + 2.0 * tmpDot * tmpNormal.y;
            particle.velocity.z = -particle.velocity.z + 2.0 * tmpDot * tmpNormal.z;
            particle.velocity.scaleInPlace(restitution); // aply restitution
            particle.rotation.x *= -1.0;
            particle.rotation.y *= -1.0;
            particle.rotation.z *= -1.0;
        }
        return particle;
    };

    SPS.afterUpdateParticles = function () {
        bboxesComputed = true;
    };

    // init all particle values
    SPS.initParticles();

    // animation
    scene.registerBeforeRender(function () {
        SPS.setParticles();
        sphere.position.x = 30.0 * Math.sin(k);
        sphere.position.z = 20.0 * Math.sin(k * 6.0);
        sphere.position.y = 8.0 * Math.sin(k * 8.0) + sphereAltitude;
        k += 0.02;
    });

    return scene;
}
