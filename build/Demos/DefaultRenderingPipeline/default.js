var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(80, 80, 120));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight();

    BABYLON.SceneLoader.ImportMesh("", "/assets/skull/", "skull.babylon", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        camera.target = newMeshes[0];
    });

    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    defaultPipeline.bloomEnabled = false;
    defaultPipeline.fxaaEnabled = false;
    defaultPipeline.bloomWeight = 0.5;
    defaultPipeline.cameraFov = camera.fov;

    // GUI
    var bgCamera = new BABYLON.ArcRotateCamera("BGCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100,
        new BABYLON.Vector3(0, 20, 0),
        scene);
    bgCamera.layerMask = 0x10000000;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.layer.layerMask = 0x10000000;

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "300px";
    panel.isVertical = true;
    panel.paddingRight = "20px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);

    var addCheckbox = function(text, func, initialValue, left) {
        var checkbox = new BABYLON.GUI.Checkbox();
        checkbox.width = "20px";
        checkbox.height = "20px";
        checkbox.isChecked = initialValue;
        checkbox.color = "green";
        checkbox.onIsCheckedChangedObservable.add(function(value) {
            func(value);
        });

        var header = BABYLON.GUI.Control.AddHeader(checkbox, text, "180px", { isHorizontal: true, controlFirst: true});
        header.height = "30px";
        header.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        if (left) {
            header.left = left;
        }

        panel.addControl(header);  
    }

    var addSlider = function(text, func, initialValue, min, max, left) {
        var header = new BABYLON.GUI.TextBlock();
        header.text = text;
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.addControl(header); 
        if (left) {
            header.left = left;
        }

        var slider = new BABYLON.GUI.Slider();
        slider.minimum = min;
        slider.maximum = max;
        slider.value = initialValue;
        slider.height = "20px";
        slider.color = "green";
        slider.background = "white";
        slider.onValueChangedObservable.add(function(value) {
            func(value);
        });

        if (left) {
            slider.paddingLeft = left;
        }

       panel.addControl(slider);  
    }

    var addColorPicker = function(text, func, initialValue, left) {
        var header = new BABYLON.GUI.TextBlock();
        header.text = text;
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.addControl(header); 

        if (left) {
            header.left = left;
        }        

        var colorPicker = new BABYLON.GUI.ColorPicker();
        colorPicker.value = initialValue;
        colorPicker.size = "100px";
        colorPicker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        colorPicker.onValueChangedObservable.add(function(value) {
            func(value);
        });

        if (left) {
            colorPicker.left = left;
        }        

        panel.addControl(colorPicker);  
    }

    var toneMappingEnabled = defaultPipeline.imageProcessing.toneMappingEnabled;
    var vignetteEnabled = defaultPipeline.imageProcessing.vignetteEnabled;
    var vignetteColor = defaultPipeline.imageProcessing.vignetteColor;
    var vignetteWeight = defaultPipeline.imageProcessing.vignetteWeight;
    var vignetteBlendMode = defaultPipeline.imageProcessing.vignetteBlendMode;
    var colorCurvesEnabled = defaultPipeline.imageProcessing.colorCurvesEnabled;
    var contrast = defaultPipeline.imageProcessing.contrast;
    var exposure = defaultPipeline.imageProcessing.exposure;

    var curve = new BABYLON.ColorCurves();
    curve.globalHue = 200;
    curve.globalDensity = 80;
    curve.globalSaturation = 80;

    curve.highlightsHue = 20;
    curve.highlightsDensity = 80;
    curve.highlightsSaturation = -80;

    curve.shadowsHue = 2;
    curve.shadowsDensity = 80;
    curve.shadowsSaturation = 40;
    
    defaultPipeline.imageProcessing.colorCurves = curve;     

    var rebindValues = function() {
        if (defaultPipeline.imageProcessing) {
            defaultPipeline.imageProcessing.toneMappingEnabled = toneMappingEnabled;
            defaultPipeline.imageProcessing.vignetteEnabled = vignetteEnabled;
            defaultPipeline.imageProcessing.vignetteWeight = vignetteWeight;
            defaultPipeline.imageProcessing.vignetteColor = vignetteColor;
            defaultPipeline.imageProcessing.vignetteBlendMode = vignetteBlendMode;
            defaultPipeline.imageProcessing.colorCurvesEnabled = colorCurvesEnabled;
            defaultPipeline.imageProcessing.contrast = contrast;
            defaultPipeline.imageProcessing.exposure = exposure;
            defaultPipeline.imageProcessing.colorCurves = curve;            
        }
    }

    addCheckbox("fxaa", function(value) {
        defaultPipeline.fxaaEnabled = value;
        rebindValues();
    }, defaultPipeline.fxaaEnabled );

    addCheckbox("bloom", function(value) {
        defaultPipeline.bloomEnabled = value;
        rebindValues();
    }, defaultPipeline.bloomEnabled);    

    addSlider("bloom weight", function(value) {
        defaultPipeline.bloomWeight = value;
    }, defaultPipeline.bloomWeight, 0, 2, "20px");        

    addCheckbox("image processing", function(value) {
        defaultPipeline.imageProcessingEnabled = value;
        rebindValues();
    }, defaultPipeline.imageProcessingEnabled);

    addCheckbox("tone mapping", function(value) {
        defaultPipeline.imageProcessing.toneMappingEnabled = value;
        toneMappingEnabled = value;
    }, toneMappingEnabled, "20px");      

    addCheckbox("vignette", function(value) {
        defaultPipeline.imageProcessing.vignetteEnabled = value;
        vignetteEnabled = value;
    }, vignetteEnabled, "20px");     

    addCheckbox("vignette multiply", function(value) {
        var blendMode = value ? BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY : BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE;
        defaultPipeline.imageProcessing.vignetteBlendMode = blendMode;
        vignetteBlendMode = blendMode;
    }, vignetteBlendMode === BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY, "40px");     

    addColorPicker("vignette color", function(value) {
        defaultPipeline.imageProcessing.vignetteColor = value;
        vignetteColor = value;
    }, vignetteColor, "40px");    

    addSlider("vignette weight", function(value) {
        defaultPipeline.imageProcessing.vignetteWeight = value;
        vignetteWeight = value;
    }, vignetteWeight, 0, 10, "40px");             

    addCheckbox("color curves", function(value) {
        defaultPipeline.imageProcessing.colorCurvesEnabled = value;
        colorCurvesEnabled = value;
    }, colorCurvesEnabled, "20px");    

    addSlider("camera contrast", function(value) {
        defaultPipeline.imageProcessing.contrast = value;
        contrast = value;
    }, contrast, 0, 4, "20px");  

    addSlider("camera exposure", function(value) {
        defaultPipeline.imageProcessing.exposure = value;
        exposure = value;
        console.log(value);
    }, exposure, 0, 4, "20px");      
    
    scene.activeCameras = [camera, bgCamera];
           
    return scene;   
}