var createScene = function () {
    var scene = new BABYLON.Scene(engine);

 
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, 1.0, 110, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var hemi = new BABYLON.HemisphericLight("toto");

    //Creation of 6 spheres
    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 9.0, scene);
    var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 2.0, 9.0, scene);//Only two segments
    var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 10.0, 9.0, scene);
    var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 10.0, 0.5, scene);
    var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 10.0, 9.0, scene);
    var sphere6 = BABYLON.Mesh.CreateSphere("Sphere6", 10.0, 9.0, scene);
    var sphere7 = BABYLON.Mesh.CreateSphere("Sphere7", 10.0, 9.0, scene);

    //Position the spheres
    sphere1.position.x = -30;
    sphere2.position.x = -20;
    sphere3.position.x = -10;
    sphere4.position.x = 0;
    sphere5.position.x = 10;
    sphere6.position.x = 20;
    sphere7.position.x = 30;

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");

    var panel = new BABYLON.GUI.StackPanel();  
    panel.width = 0.25;
    panel.rotation = 0.2;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    advancedTexture.addControl(panel);

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = 0.2;
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        circle.scaleX += 0.1;
    });
    panel.addControl(button1);

    var circle = new BABYLON.GUI.Ellipse();
    circle.width = "50px";
    circle.color = "white";
    circle.thickness = 5;
    circle.height = "50px";
    circle.marginTop = "2px";
    circle.marginBottom = "2px";
    panel.addControl(circle);

    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Click Me 2");
    button2.width = 0.2;
    button2.height = "40px";
    button2.color = "white";
    button2.background = "green";
    button2.onPointerUpObservable.add(function() {
        circle.scaleX -= 0.1;
    });
    panel.addControl(button2); 

    var createLabel = function(mesh) {
        var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.5;
        label.width = "100px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        advancedTexture.addControl(label); 
        label.linkWithMesh(mesh);

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = mesh.name;
        text1.color = "white";
        label.addControl(text1);  
    }  

    createLabel(sphere1);
    createLabel(sphere2);
    createLabel(sphere3);
    createLabel(sphere4);
    createLabel(sphere5);
    createLabel(sphere6);

    var label = new BABYLON.GUI.Rectangle("label for " + sphere7.name);
    label.background = "black"
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;
    label.top = 0.1;
    label.zIndex = 5;
    label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;    
    advancedTexture.addControl(label); 

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = sphere7.name;
    text1.color = "white";
    label.addControl(text1);    

    var line = new BABYLON.GUI.Line();
    line.alpha = 0.5;
    line.lineWidth = 5;
    line.dash = [5, 10];
    advancedTexture.addControl(line); 
    line.linkWithMesh(sphere7);
    line.connectedControl = label;

    var endRound = new BABYLON.GUI.Ellipse();
    endRound.width = "10px";
    endRound.background = "black";
    endRound.height = "10px";
    endRound.color = "white";
    advancedTexture.addControl(endRound);
    endRound.linkWithMesh(sphere7);

    // Plane
    var plane = BABYLON.Mesh.CreatePlane("plane", 20);
    plane.parent = sphere4;
    plane.position.y = -10;

    // GUI
    var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    var panel2 = new BABYLON.GUI.StackPanel();  
    advancedTexture2.addControl(panel2);    

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "white";
    button1.fontSize = 50;
    button1.background = "green";
    panel2.addControl(button1);

    scene.registerBeforeRender(function() {
        panel.rotation += 0.01;
    });

    return scene;
};