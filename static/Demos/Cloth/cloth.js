var Cloth = function(scene) {
    this.scene = scene;
    this.initMaterials();
    this.contactPoints = [];

}

Cloth.prototype.initMaterials = function() {
    var clothMat = new BABYLON.StandardMaterial("texture3", this.scene);
    clothMat.diffuseTexture = new BABYLON.Texture("./assets/cloth-diffuse.jpg", this.scene);
    clothMat.bumpTexture = new BABYLON.Texture("./assets/cloth-bump.jpg", this.scene);
    clothMat.backFaceCulling = false;
    clothMat.zOffset = -20;
    this.material = clothMat;


    var matForMounted = new BABYLON.StandardMaterial("firsts", this.scene);
    matForMounted.diffuseColor = BABYLON.Color3.Blue();

    this.matForMounted = matForMounted;
}

Cloth.prototype.initCloth = function(subdivisions, size, position, rotation) {
    if (this.cloth) {
        this.cloth.dispose();
    }

    this.size = size;
    this.subdivisions = subdivisions;
    this.distanceBetweenPoints = size / subdivisions;

    this.cloth = BABYLON.Mesh.CreateGround("cloth", this.size, this.size, this.subdivisions - 1, this.scene, true);
    this.cloth.material = this.material;
    this.cloth.position = position || BABYLON.Vector3.Zero();
    this.cloth.rotation = rotation || BABYLON.Vector3.Zero();
    this.cloth.computeWorldMatrix(true);
}

Cloth.prototype.initPhysics = function(mountedRows, particleMass, elasticFactor, friction) {
    this.contactPoints.forEach(function(c) {
        c.dispose();
    });
    this.contactPoints = [];

    var positions = this.cloth.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var row = -1;
    for (var i = 0; i < positions.length; i = i + 3) {
        var idx = i / 3;
        var positionInRow = idx % this.subdivisions;
        if (!positionInRow) {
            row++;
        }
        var mountedRow = mountedRows.indexOf(row) > -1

        var v = BABYLON.Vector3.FromArray(positions, i);

        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { diameter: 0.4 }, this.scene);
        BABYLON.Vector3.TransformCoordinatesToRef(v, this.cloth.getWorldMatrix(), s.position);
        if (mountedRow) {
            s.material = this.matForMounted;
        }
        this.contactPoints.push(s);

        //create the impostors
        var mass = mountedRow ? 0 : particleMass || 1;
        s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.ParticleImpostor, { mass: mass, friction: friction || 0.2 }, this.scene);
        if (row > 0) {
            this.createJoint(s.physicsImpostor, this.contactPoints[idx - this.subdivisions].physicsImpostor, elasticFactor);
        }
        if (positionInRow) {
            this.createJoint(s.physicsImpostor, this.contactPoints[idx - 1].physicsImpostor, 0);
        }
    }

    var invMat = this.cloth.getWorldMatrix().clone().invert();
    var tmpVec = BABYLON.Vector3.Zero();
    var that = this;
    this.cloth.registerBeforeRender(function() {
        var positions = [];
        that.contactPoints.forEach(function(c) {
            BABYLON.Vector3.TransformCoordinatesToRef(c.position, invMat, tmpVec);
            positions.push(tmpVec.x, tmpVec.y, tmpVec.z);
        });
        that.cloth.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        that.cloth.refreshBoundingInfo();
    })
}

Cloth.prototype.setVisibility = function(visible) {
    this.contactPoints.forEach(function(c) {
        c.isVisible = visible;
    });
}

Cloth.prototype.createJoint = function(imp1, imp2, elasticFactor) {
    var joint = new BABYLON.DistanceJoint({
        maxDistance: this.distanceBetweenPoints + elasticFactor || 0
    })
    imp1.addJoint(imp2, joint);
}

var CreateClothScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 6, 1.3, 30, new BABYLON.Vector3(0, -5, 0), scene);
    camera.attachControl(canvas);
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.groundColor = new BABYLON.Color3(.5, .5, .5);

    var clothSimulator = new Cloth(scene);

    clothSimulator.setVisibility(false);

    var params = {
        size: 16,
        subdivisions: 16,
        firstMount: 0,
        secondMount: 15,
        stretchFactor: 0.5,
        particleWeight: 1,
        particleFriction: 0.2,
        particlesVisible: false
    }

    var sceneParams = {
        movingSphere: true,
        sphereFriction: 0.5,
        throwSphere: function() {
            var newSphere = BABYLON.MeshBuilder.CreateSphere("thrown", { diameter: 3, segments: 16 }, scene);
            newSphere.position.y = 5;
            newSphere.physicsImpostor = new BABYLON.PhysicsImpostor(newSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: sceneParams.sphereFriction }, scene);
            
        }
    }

    function updateCloth() {
        console.log(params);
        clothSimulator.initCloth(params.subdivisions, params.size);
        clothSimulator.initPhysics([params.firstMount, params.secondMount], params.particleWeight, params.stretchFactor, params.particleFriction);
        clothSimulator.setVisibility(params.particlesVisible);
    }

    var movingSphere;

    function movingSphereToggle(display) {
        if (!display && movingSphere) {
            movingSphere.dispose();
            return;
        } else if (display) {
            movingSphere = BABYLON.MeshBuilder.CreateSphere("bigSphere", { diameter: 5, segments: 16 }, scene);
            movingSphere.position.y = -7;
            movingSphere.physicsImpostor = new BABYLON.PhysicsImpostor(movingSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, friction: sceneParams.sphereFriction }, scene);
            var t = 0;
            movingSphere.registerBeforeRender(function() {
                t = t + 0.01;
                movingSphere.position.z = Math.sin(t) * 10
            })
        }
    }

    updateCloth();
    movingSphereToggle(true);

    var gui = new dat.GUI();
    var meshGui = gui.addFolder('Cloth');
    meshGui.open();
    meshGui.add(params, 'size', 2, 20).step(1).onFinishChange(updateCloth);
    meshGui.add(params, 'subdivisions', 2, 20).step(1).onFinishChange(updateCloth);
    var physicsGui = gui.addFolder('Physics');
    physicsGui.add(params, 'stretchFactor', 0, 1).step(0.1).onFinishChange(updateCloth);
    physicsGui.add(params, 'particleWeight', 0.1, 2).step(0.1).onFinishChange(updateCloth);
    physicsGui.add(params, 'particleFriction', 0, 1).step(0.1).onFinishChange(updateCloth);
    physicsGui.add(params, 'firstMount', -1, 20).step(1).onFinishChange(updateCloth);
    physicsGui.add(params, 'secondMount', -1, 20).step(1).onFinishChange(updateCloth);
    physicsGui.open();
    var materialGui = gui.addFolder('Materials');
    materialGui.add(clothSimulator.material, "wireframe")
    materialGui.add(params, 'particlesVisible').onFinishChange(function(value) {
        clothSimulator.setVisibility(value);
    });
    materialGui.open();
    var sceneGui = gui.addFolder('Scene');
    sceneGui.add(sceneParams, 'movingSphere').onFinishChange(movingSphereToggle);
    sceneGui.add(sceneParams, 'throwSphere');
    sceneGui.open();

    return scene;
}