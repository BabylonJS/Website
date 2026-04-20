var CreateAdvancedShadowsTestScene = function (engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(20, 30, -100), scene);

    // Ground
    var ground01 = BABYLON.Mesh.CreateGround("Spotlight Hard Shadows", 24, 60, 1, scene, false);
    var ground02 = BABYLON.Mesh.CreateGround("Spotlight Poisson Sampling", 24, 60, 1, scene, false);
    var ground03 = BABYLON.Mesh.CreateGround("Spotlight VSM", 24, 60, 1, scene, false);
    var ground04 = BABYLON.Mesh.CreateGround("Spotlight Blur VSM", 24, 60, 1, scene, false);

    var ground11 = BABYLON.Mesh.CreateGround("Directional Hard Shadows", 24, 60, 1, scene, false);
    var ground12 = BABYLON.Mesh.CreateGround("Directional Poisson Sampling", 24, 60, 1, scene, false);
    var ground13 = BABYLON.Mesh.CreateGround("Directional VSM", 24, 60, 1, scene, false);
    var ground14 = BABYLON.Mesh.CreateGround("Directional Blur VSM", 24, 60, 1, scene, false);

    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/Scenes/Customs/ground.jpg", scene);
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    ground01.material = groundMaterial;
    ground01.receiveShadows = true;
    ground01.position.x = -30;
    ground02.material = groundMaterial;
    ground02.receiveShadows = true;
    ground02.position.x = 0;
    ground03.material = groundMaterial;
    ground03.receiveShadows = true;
    ground03.position.x = 30;
    ground04.material = groundMaterial;
    ground04.receiveShadows = true;
    ground04.position.x = 60;

    ground11.material = groundMaterial;
    ground11.receiveShadows = true;
    ground11.position.z = 100;
    ground11.position.x = -30;
    ground12.material = groundMaterial;
    ground12.receiveShadows = true;
    ground12.position.z = 100;
    ground13.material = groundMaterial;
    ground13.receiveShadows = true;
    ground13.position.z = 100;
    ground13.position.x = 30;
    ground14.material = groundMaterial;
    ground14.receiveShadows = true;
    ground14.position.z = 100;
    ground14.position.x = 60;


	// --------- SPOTS -------------
	var light00 = new BABYLON.SpotLight("*spot00", new BABYLON.Vector3(-30, 20, -10), new BABYLON.Vector3(0, -1, 0.3), 1.2, 24, scene);
	var light01 = new BABYLON.SpotLight("*spot01", new BABYLON.Vector3(0, 20, -10), new BABYLON.Vector3(0, -1, 0.3), 1.2, 24, scene);
	var light02 = new BABYLON.SpotLight("*spot02", new BABYLON.Vector3(30, 20, -10), new BABYLON.Vector3(0, -1, 0.3), 1.2, 24, scene);
	var light03 = new BABYLON.SpotLight("*spot03", new BABYLON.Vector3(60, 20, -10), new BABYLON.Vector3(0, -1, 0.3), 1.2, 24, scene);

	// Boxes
    var box00 = BABYLON.Mesh.CreateBox("*box00", 5, scene, false);
    box00.position = new BABYLON.Vector3(-30, 5, 0);
    var box01 = BABYLON.Mesh.CreateBox("*box01", 5, scene, false);
	box01.position = new BABYLON.Vector3(0, 5, 0);
	var box02 = BABYLON.Mesh.CreateBox("*box02", 5, scene, false);
	box02.position = new BABYLON.Vector3(30, 5, 0);
	var box03 = BABYLON.Mesh.CreateBox("*box03", 5, scene, false);
	box03.position = new BABYLON.Vector3(60, 5, 0);

    var boxMaterial = new BABYLON.StandardMaterial("mat", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1.0, 0, 0);
    boxMaterial.specularColor = new BABYLON.Color3(0.5, 0, 0);
    box00.material = boxMaterial;
    box01.material = boxMaterial;
    box02.material = boxMaterial;
    box03.material = boxMaterial;

	// Inclusions
    light00.includedOnlyMeshes.push(box00);
    light00.includedOnlyMeshes.push(ground01);

    light01.includedOnlyMeshes.push(box01);
    light01.includedOnlyMeshes.push(ground02);

    light02.includedOnlyMeshes.push(box02);
    light02.includedOnlyMeshes.push(ground03);

    light03.includedOnlyMeshes.push(box03);
    light03.includedOnlyMeshes.push(ground04);

    // Shadows
    var shadowGenerator00 = new BABYLON.ShadowGenerator(512, light00);
    shadowGenerator00.getShadowMap().renderList.push(box00);

    var shadowGenerator01 = new BABYLON.ShadowGenerator(512, light01);
    shadowGenerator01.getShadowMap().renderList.push(box01);
    shadowGenerator01.usePoissonSampling = true;

    var shadowGenerator02 = new BABYLON.ShadowGenerator(512, light02);
    shadowGenerator02.getShadowMap().renderList.push(box02);
    shadowGenerator02.useVarianceShadowMap = true;

    var shadowGenerator03 = new BABYLON.ShadowGenerator(512, light03);
    shadowGenerator03.getShadowMap().renderList.push(box03);
    shadowGenerator03.useBlurVarianceShadowMap = true;
    shadowGenerator03.blurBoxOffset = 2.0;

	// --------- DIRECTIONALS -------------
    var light04 = new BABYLON.DirectionalLight("*dir00", new BABYLON.Vector3(0, -0.6, 0.3), scene);
    var light05 = new BABYLON.DirectionalLight("*dir01", new BABYLON.Vector3(0, -0.6, 0.3), scene);
    var light06 = new BABYLON.DirectionalLight("*dir02", new BABYLON.Vector3(0, -0.6, 0.3), scene);
    var light07 = new BABYLON.DirectionalLight("*dir03", new BABYLON.Vector3(0, -0.6, 0.3), scene);
    light04.position = new BABYLON.Vector3(-30, 50, 60);
    light05.position = new BABYLON.Vector3(0, 50, 60);
    light06.position = new BABYLON.Vector3(30, 50, 60);
    light07.position = new BABYLON.Vector3(60, 50, 60);

	// Boxes
    var box04 = BABYLON.Mesh.CreateBox("*box04", 5, scene, false);
    box04.position = new BABYLON.Vector3(-30, 5, 100);
    var box05 = BABYLON.Mesh.CreateBox("*box05", 5, scene, false);
    box05.position = new BABYLON.Vector3(0, 5, 100);
    var box06 = BABYLON.Mesh.CreateBox("*box06", 5, scene, false);
    box06.position = new BABYLON.Vector3(30, 5, 100);
    var box07 = BABYLON.Mesh.CreateBox("*box07", 5, scene, false);
    box07.position = new BABYLON.Vector3(60, 5, 100);

    box04.material = boxMaterial;
    box05.material = boxMaterial;
    box06.material = boxMaterial;
    box07.material = boxMaterial;

	// Inclusions
    light04.includedOnlyMeshes.push(box04);
    light04.includedOnlyMeshes.push(ground11);

    light05.includedOnlyMeshes.push(box05);
    light05.includedOnlyMeshes.push(ground12);

    light06.includedOnlyMeshes.push(box06);
    light06.includedOnlyMeshes.push(ground13);

    light07.includedOnlyMeshes.push(box07);
    light07.includedOnlyMeshes.push(ground14);

	// Shadows
    var shadowGenerator04 = new BABYLON.ShadowGenerator(512, light04);
    shadowGenerator04.getShadowMap().renderList.push(box04);

    var shadowGenerator05 = new BABYLON.ShadowGenerator(512, light05);
    shadowGenerator05.getShadowMap().renderList.push(box05);
    shadowGenerator05.usePoissonSampling = true;

    var shadowGenerator06 = new BABYLON.ShadowGenerator(512, light06);
    shadowGenerator06.getShadowMap().renderList.push(box06);
    shadowGenerator06.useVarianceShadowMap = true;

    var shadowGenerator07 = new BABYLON.ShadowGenerator(512, light07);
    shadowGenerator07.getShadowMap().renderList.push(box07);
    shadowGenerator07.useBlurVarianceShadowMap = true;
       
    // Animations
    scene.registerBeforeRender(function () {
    	box00.rotation.x += 0.01;
    	box00.rotation.z += 0.02;

    	box01.rotation.x += 0.01;
    	box01.rotation.z += 0.02;

    	box02.rotation.x += 0.01;
    	box02.rotation.z += 0.02;

    	box03.rotation.x += 0.01;
    	box03.rotation.z += 0.02;

    	box04.rotation.x += 0.01;
    	box04.rotation.z += 0.02;

    	box05.rotation.x += 0.01;
    	box05.rotation.z += 0.02;

    	box06.rotation.x += 0.01;
    	box06.rotation.z += 0.02;

    	box07.rotation.x += 0.01;
    	box07.rotation.z += 0.02;
    });

    scene.debugLayer.show(false);

    scene.debugLayer.shouldDisplayLabel = function (node) {
    	return node.name.indexOf("*") === -1;
    }

    scene.debugLayer.shouldDisplayAxis = function (node) {
    	return false;
    }
    
    return scene;
};