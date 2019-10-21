var CreateSPSCollisionsTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.4, .6, .9);
    var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 100, -200));
    camera.attachControl(canvas, true);

    var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.specular = new BABYLON.Color3(1, 1, 0.8);
    pl.intensity = 0.95;
    pl.position = camera.position;

    var sphereRadius = 18.0;
    var boxSize = 4.0;
    var ground = BABYLON.MeshBuilder.CreateGround("gd", { width: 1000.0, height: 1000.0 }, scene);
    var sphere = BABYLON.Mesh.CreateSphere("sphere", 10, sphereRadius * 2.0, scene);
    var box = BABYLON.MeshBuilder.CreateBox("b", { size: boxSize }, scene);
    var poly = BABYLON.MeshBuilder.CreatePolyhedron("p", { size: boxSize, type: 4, flat: true }, scene);
    var tetra = BABYLON.MeshBuilder.CreatePolyhedron("t", { size: boxSize / 2.0, flat: true }, scene);
    var matSphere = new BABYLON.StandardMaterial("ms", scene);
    var matGround = new BABYLON.StandardMaterial("mg", scene);
    matSphere.diffuseColor = BABYLON.Color3.Red();
    matGround.diffuseColor = new BABYLON.Color3(0.65, 0.6, 0.5);
    sphere.material = matSphere;
    ground.material = matGround;
    ground.freezeWorldMatrix();
    matSphere.freeze();
    matGround.freeze();

    // Particle system
    var particleNb = 1200;
    var nb = (particleNb / 3) | 0;
    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, { particleIntersection: true });
    SPS.addShape(box, nb);
    SPS.addShape(poly, nb);
    SPS.addShape(tetra, nb)
    box.dispose();
    poly.dispose();
    tetra.dispose();
    var mesh = SPS.buildMesh();
    mesh.hasVertexAlpha = true;
    SPS.isAlwaysVisible = true;
    SPS.computeParticleTexture = false;

    // position things
    mesh.position.y = 80.0;
    mesh.position.x = -70.0;
    var sphereAltitude = mesh.position.y / 2.0;
    sphere.position.y = sphereAltitude;

    // shared variables
    var speed = 1.9;                  // particle max speed
    var cone = 0.5;                   // emitter aperture
    var gravity = -speed / 100;       // gravity
    var restitution = 0.99;           // energy restitution
    var k = 0.0;
    var sign = 1;
    var tmpPos = BABYLON.Vector3.Zero();          // current particle world position
    var tmpNormal = BABYLON.Vector3.Zero();       // current sphere normal on intersection point
    var tmpDot = 0.0;                             // current dot product
    var bboxesComputed = false;                     // the bbox are actually computed only after the first particle.update()


    // SPS initialization : just recycle all
    SPS.initParticles = function () {
        for (var p = 0; p < SPS.nbParticles; p++) {
            SPS.recycleParticle(SPS.particles[p]);
        }
    };

    // recycle : reset the particle at the emitter origin
    SPS.recycleParticle = function (particle) {
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

        particle.color.r = Math.random() + 0.1;
        particle.color.g = Math.random() + 0.1;
        particle.color.b = Math.random() + 0.1;
        particle.color.a = 1.0;
    };


    // particle behavior
    SPS.updateParticle = function (particle) {

        // recycle if touched the ground
        if ((particle.position.y + mesh.position.y) < (ground.position.y + boxSize)) {
            particle.position.y = ground.position.y - mesh.position.y + boxSize / 2.0;
            particle.color.a -= 0.05;
            if (particle.color.a < 0) {
                this.recycleParticle(particle);
            }
            return;
        }

        // update velocity, rotation and position
        particle.velocity.y += gravity;                         // apply gravity to y
        (particle.position).addInPlace(particle.velocity);      // update particle new position
        sign = (particle.idx % 2 == 0) ? 1 : -1;                // rotation sign and then new value
        particle.rotation.z += 0.1 * sign;
        particle.rotation.x += 0.05 * sign;
        particle.rotation.y += 0.008 * sign;

        // intersection
        if (bboxesComputed && particle.intersectsMesh(sphere)) {
            particle.position.addToRef(mesh.position, tmpPos);                  // particle World position
            tmpPos.subtractToRef(sphere.position, tmpNormal);                   // normal to the sphere
            tmpNormal.normalize();                                              // normalize the sphere normal
            tmpDot = BABYLON.Vector3.Dot(particle.velocity, tmpNormal);            // dot product (velocity, normal)
            // bounce result computation
            particle.velocity.x = -particle.velocity.x + 2.0 * tmpDot * tmpNormal.x;
            particle.velocity.y = -particle.velocity.y + 2.0 * tmpDot * tmpNormal.y;
            particle.velocity.z = -particle.velocity.z + 2.0 * tmpDot * tmpNormal.z;
            particle.velocity.scaleInPlace(restitution);                      // aply restitution
            particle.rotation.x *= -1.0;
            particle.rotation.y *= -1.0;
            particle.rotation.z *= -1.0;
        }
    };

    SPS.afterUpdateParticles = function () {
        bboxesComputed = true;
    };

    // init all particle values
    SPS.initParticles();

    //scene.debugLayer.show();
    // animation
    scene.registerBeforeRender(function () {
        SPS.setParticles();
        sphere.position.x = 30.0 * Math.sin(k);
        sphere.position.z = 20.0 * Math.sin(k * 6.0);
        sphere.position.y = 8.0 * Math.sin(k * 8.0) + sphereAltitude;
        k += 0.02;
    });

    return scene;
};