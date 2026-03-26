var CreateCustomRenderTargetTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.diffuseColor = BABYLON.Color3.Purple();
    var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);

    camera.setPosition(new BABYLON.Vector3(-15, 10, -20));
    camera.minZ = 1.0;
    camera.maxZ = 120.0;

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../assets/skybox/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // depth material
    BABYLON.Effect.ShadersStore["customDepthVertexShader"] = 
        "#ifdef GL_ES\n" +
        "precision highp float;\n" +
        "#endif\n" +
        "attribute vec3 position;\n" +
        "uniform mat4 worldViewProjection;\n" +
        "void main(void) {\n" +
        "gl_Position = worldViewProjection * vec4(position, 1.0);\n" +
        "}";
    BABYLON.Effect.ShadersStore["customDepthPixelShader"] =
        "#ifdef GL_ES\n" +
        "precision highp float;\n" +
        "#endif\n" +

        "void main(void) {\n" +
        "float depth =  1.0 - (2.0 / (100.0 + 1.0 - gl_FragCoord.z * (100.0 - 1.0)));\n" +
        "gl_FragColor = vec4(depth, depth, depth, 1.0);\n" +
        "}\n" +
        "";

    var depthMaterial = new BABYLON.ShaderMaterial("customDepth", scene, "customDepth",
        {
            attributes: ["position"],
            uniforms: ["worldViewProjection"]
        });

    depthMaterial.backFaceCulling = false;

    // Plane
    var plane = BABYLON.Mesh.CreatePlane("map", 10, scene);
    plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    plane.scaling.y = 1.0 / engine.getAspectRatio(scene.activeCamera);

    // Render target
    var renderTarget = new BABYLON.RenderTargetTexture("depth", 1024, scene, true);
    renderTarget.renderList.push(skybox);
    scene.customRenderTargets.push(renderTarget);

    renderTarget.onBeforeRender = function () {
        for (var index = 0; index < renderTarget.renderList.length; index++) {
            renderTarget.renderList[index]._savedMaterial = renderTarget.renderList[index].material;
            renderTarget.renderList[index].material = depthMaterial;
        }
    }

    renderTarget.onAfterRender = function () {
        // Restoring previoux material
        for (var index = 0; index < renderTarget.renderList.length; index++) {
            renderTarget.renderList[index].material = renderTarget.renderList[index]._savedMaterial;
        }
    }

    // Spheres
    var spheresCount = 20;
    var alpha = 0;
    for (var index = 0; index < spheresCount; index++) {
        var sphere = BABYLON.Mesh.CreateSphere("Sphere" + index, 32, 3, scene);
        sphere.position.x = 10 * Math.cos(alpha);
        sphere.position.z = 10 * Math.sin(alpha);
        sphere.material = material;

        alpha += (2 * Math.PI) / spheresCount;

        renderTarget.renderList.push(sphere);
    }

    // Plane material
    var mat = new BABYLON.StandardMaterial("plan mat", scene);
    mat.emissiveTexture = renderTarget;
    mat.disableLighting = true;

    plane.material = mat;

    // Animations
    scene.registerBeforeRender(function () {
        camera.alpha += 0.01 * scene.getAnimationRatio();
    });

    return scene;
};