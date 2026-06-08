import type { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import type { SolidParticle } from "@babylonjs/core/Particles/solidParticle";

export function createFacetsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.15, 0.15, 0.3).toColor4(1);

    const camera = new ArcRotateCamera("Camera", 0, 0, 0, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.setPosition(new Vector3(0, 10.0, -150.0));

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.2;
    const pl = new PointLight("pl", camera.position, scene);
    pl.intensity = 0.9;

    new StandardMaterial("sm", scene);

    const gravity = new Vector3(0, -0.01, 0);
    const ballOrigin = new Vector3(-20.0, 60.0, 0.0);
    const restitution = 0.6;
    const speed = 0.05;
    const sceneLimit = ballOrigin.y + 2.0;

    const model1 = CreateTorusKnot("m1", { radius: 8.0, tube: 1.2, radialSegments: 48 }, scene);
    const posfunc = (p: SolidParticle): void => {
        p.position.x = ((0.5 - Math.random()) * sceneLimit) / 1.5;
        p.position.y = (0.5 - Math.random()) * sceneLimit;
        p.position.z = ((0.5 - Math.random()) * sceneLimit) / 1.5;
        p.rotation.x = 3.2 * Math.random();
        p.rotation.y = 3.2 * Math.random();
        p.rotation.z = 3.2 * Math.random();
        p.scaling.x = 0.5 + Math.random() * 0.5;
        p.scaling.y = p.scaling.x;
        p.scaling.z = p.scaling.x;
    };
    const meshSPS = new SolidParticleSystem("m", scene, { updatable: false });
    meshSPS.addShape(model1, 30, { positionFunction: posfunc });
    meshSPS.buildMesh();
    model1.dispose();

    meshSPS.refreshVisibleSize();
    const mesh = meshSPS.mesh;
    mesh.partitioningSubdivisions = 40;
    mesh.updateFacetData();

    const ballRadius = 1.0;
    const ballNb = 2000;
    const radiusSquared = ballRadius * ballRadius;
    const ball = CreateSphere("b", { diameter: ballRadius * 2.0, segments: 3 }, scene);
    const sps = new SolidParticleSystem("sps", scene);
    sps.addShape(ball, ballNb);
    ball.dispose();
    sps.buildMesh();
    sps.isAlwaysVisible = true;
    sps.computeParticleRotation = false;
    sps.computeParticleTexture = false;

    sps.recycleParticle = function (p: SolidParticle): SolidParticle {
        p.position.copyFrom(this.vars.origin);
        p.velocity.x = (Math.random() - 0.5) * this.vars.speed * 3.0 + this.vars.speed * 3.0;
        p.velocity.z = (Math.random() - 0.5) * this.vars.speed * 6.0;
        p.velocity.y = Math.random() * this.vars.speed * 10.0;
        p.scaling.x = 1.0;
        p.scaling.y = p.scaling.x;
        p.scaling.z = p.scaling.x;
        return p;
    };
    sps.initParticles = function (): void {
        for (let p = 0; p < this.nbParticles; p++) {
            this.recycleParticle(sps.particles[p]);
            this.particles[p].color!.r = 0.4 + Math.random() * 0.6;
            this.particles[p].color!.g = 0.4 + Math.random() * 0.6;
            this.particles[p].color!.b = 0.4 + Math.random() * 0.6;
            this.particles[p].rotation.x = Math.random() * 3.2;
            this.particles[p].rotation.y = Math.random() * 3.2;
            this.particles[p].rotation.z = Math.random() * 3.2;
        }
    };

    const projected = Vector3.Zero();
    const facetNorm = Vector3.Zero();
    const normPos = Vector3.Zero();
    const tmpVect = Vector3.Zero();

    sps.updateParticle = function (p: SolidParticle): SolidParticle {
        if (
            Math.abs(p.position.x) > sceneLimit ||
            Math.abs(p.position.y) > sceneLimit ||
            Math.abs(p.position.z) > sceneLimit
        ) {
            sps.recycleParticle(p);
            return p;
        }

        p.velocity.addInPlace(gravity);
        p.position.addInPlace(p.velocity);

        const closest = mesh.getClosestFacetAtCoordinates(
            p.position.x,
            p.position.y,
            p.position.z,
            projected,
            true,
            true
        );
        if (closest !== null) {
            mesh.getFacetNormalToRef(closest, facetNorm);

            p.position.subtractToRef(projected, tmpVect);

            if (tmpVect.lengthSquared() < radiusSquared) {
                const tmpDotVel = Vector3.Dot(p.velocity, facetNorm);
                p.velocity.x = (p.velocity.x - 2.0 * tmpDotVel * facetNorm.x) * restitution;
                p.velocity.y = (p.velocity.y - 2.0 * tmpDotVel * facetNorm.y) * restitution;
                p.velocity.z = (p.velocity.z - 2.0 * tmpDotVel * facetNorm.z) * restitution;

                facetNorm.scaleToRef(ballRadius * 1.01, normPos);
                projected.addToRef(normPos, p.position);
            }
        }
        p.scaling.x = 0.4 + Math.abs(p.velocity.x);
        p.scaling.y = 0.4 + Math.abs(p.velocity.y);
        p.scaling.z = 0.4 + Math.abs(p.velocity.z);
        return p;
    };

    sps.vars.origin = ballOrigin.clone();
    sps.vars.speed = speed;
    sps.initParticles();
    sps.setParticles();

    let k = 0.0;
    scene.registerBeforeRender(() => {
        mesh.rotation.y += 0.01;
        mesh.rotation.x = 0.6 * Math.sin(k);
        sps.setParticles();
        k += 0.02;
    });

    scene.onDisposeObservable.add(() => {
        mesh.disableFacetData();
    });

    return scene;
}
