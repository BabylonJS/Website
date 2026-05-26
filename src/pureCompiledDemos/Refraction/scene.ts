import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateSphere,
    CreateTorusKnot,
    Engine,
    FresnelParameters,
    HemisphericLight,
    Matrix,
    ReflectionProbe,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
export function createRefractionScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("camera1", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0, 5, -10));
    camera.attachControl(canvas, true);
    camera.upperBetaLimit = Math.PI / 2;
    camera.lowerRadiusLimit = 4;

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const knot = CreateTorusKnot(
        "knot",
        { radius: 1, tube: 0.4, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );
    const yellowSphere = CreateSphere("yellowSphere", { segments: 16, diameter: 1.5 }, scene);
    const greenSphere = CreateSphere("greenSphere", { segments: 16, diameter: 1.5 }, scene);

    yellowSphere.setPivotMatrix(Matrix.Translation(3, 0, 0));
    greenSphere.setPivotMatrix(Matrix.Translation(0, 0, 3));
    yellowSphere.material = createDiffuseMaterial("yellowMaterial", Color3.Yellow(), scene);
    greenSphere.material = createDiffuseMaterial("greenMaterial", Color3.Green(), scene);

    const ground = CreateBox("Mirror", { size: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    ground.scaling = new Vector3(100, 0.01, 100);
    const groundTexture = new Texture("/Demos/Refraction/refraction.jpg", scene);
    groundTexture.uScale = 10;
    groundTexture.vScale = 10;
    groundMaterial.diffuseTexture = groundTexture;
    ground.position = new Vector3(0, -2, 0);
    ground.material = groundMaterial;

    const mainMaterial = new StandardMaterial("main", scene);
    const probe = new ReflectionProbe("main", 512, scene);
    probe.renderList?.push(yellowSphere, greenSphere, ground);
    mainMaterial.diffuseColor = new Color3(1, 0.5, 0.5);
    mainMaterial.refractionTexture = probe.cubeTexture;
    mainMaterial.refractionFresnelParameters = new FresnelParameters();
    mainMaterial.refractionFresnelParameters.bias = 0.5;
    mainMaterial.refractionFresnelParameters.power = 16;
    mainMaterial.refractionFresnelParameters.leftColor = Color3.Black();
    mainMaterial.refractionFresnelParameters.rightColor = Color3.White();
    mainMaterial.refractionFresnelParameters.isEnabled = false;
    mainMaterial.indexOfRefraction = 1.05;
    knot.material = mainMaterial;

    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogColor = new Color3(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b);
    scene.fogStart = 20;
    scene.fogEnd = 50;

    wireControls(mainMaterial, scene);

    scene.registerBeforeRender(() => {
        yellowSphere.rotation.y += 0.01;
        greenSphere.rotation.y += 0.01;
    });

    return scene;
}

function createDiffuseMaterial(name: string, color: Color3, scene: Scene): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = color;
    return material;
}

function wireControls(mainMaterial: StandardMaterial, scene: Scene): void {
    const bumpToggle = document.getElementById("bumpToggle") as HTMLInputElement | null;
    const fresnelToggle = document.getElementById("fresnelToggle") as HTMLInputElement | null;
    const indexOfRefraction = document.getElementById("indexOfRefraction") as HTMLInputElement | null;

    bumpToggle?.addEventListener("change", () => {
        if (!bumpToggle.checked) {
            mainMaterial.bumpTexture?.dispose();
            mainMaterial.bumpTexture = null;
            return;
        }

        mainMaterial.bumpTexture = new Texture("/Scenes/Customs/normalMap.jpg", scene);
    });

    fresnelToggle?.addEventListener("change", () => {
        if (mainMaterial.refractionFresnelParameters) {
            mainMaterial.refractionFresnelParameters.isEnabled = fresnelToggle.checked;
        }
    });

    indexOfRefraction?.addEventListener("input", () => {
        mainMaterial.indexOfRefraction = Number(indexOfRefraction.value);
    });
}
