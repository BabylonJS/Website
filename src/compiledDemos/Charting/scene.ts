import type { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Animation } from "@babylonjs/core/Animations/animation";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Animations/animatable";

interface IChartSeries {
    label: string;
    value: number;
    color: Color3;
}

export function createChartingTestScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const light = new DirectionalLight("dir01", new Vector3(0, -0.5, 1.0), scene);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(20, 70, -100));
    camera.attachControl(canvas, true);
    light.position = new Vector3(0, 25, -50);

    const scale = 0.6;

    const browsersSeries: IChartSeries[] = [
        { label: "IE", value: 32, color: new Color3(0, 0, 1) },
        { label: "Chrome", value: 28, color: new Color3(1, 0, 0) },
        { label: "Firefox", value: 16, color: new Color3(1, 0, 1) },
        { label: "Opera", value: 14, color: new Color3(1, 1, 0) },
        { label: "Safari", value: 10, color: new Color3(0, 1, 1) },
    ];

    const playgroundSize = 100;

    // Background
    const background = CreatePlane("background", { size: playgroundSize }, scene);
    const backgroundMaterial = new StandardMaterial("background", scene);
    background.material = backgroundMaterial;
    background.scaling.y = 0.5;
    background.position.z = playgroundSize / 2 - 0.5;
    background.position.y = playgroundSize / 4;
    background.receiveShadows = true;
    const backgroundTexture = new DynamicTexture("dynamic texture", 512, scene, true);
    backgroundMaterial.diffuseTexture = backgroundTexture;
    backgroundMaterial.specularColor = new Color3(0, 0, 0);
    backgroundMaterial.backFaceCulling = false;

    backgroundTexture.drawText("Eternalcoding", null, 80, "bold 70px Segoe UI", "white", "#555555");
    backgroundTexture.drawText("- browsers statistics -", null, 250, "35px Segoe UI", "white", null);

    // Ground
    const ground = CreateGround("ground", { width: playgroundSize, height: playgroundSize, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.position.y = -0.1;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.usePoissonSampling = true;

    const createSeries = function (series: IChartSeries[]) {
        const margin = 2;
        const offset = playgroundSize / series.length - margin;
        let x = -playgroundSize / 2 + offset / 2;

        for (let index = 0; index < series.length; index++) {
            const data = series[index];

            const bar = CreateBox(data.label, { size: 1.0 }, scene);
            bar.scaling = new Vector3(offset / 2.0, 0, offset / 2.0);
            bar.position.x = x;
            bar.position.y = 0;

            let animation = new Animation("anim", "scaling", 30, Animation.ANIMATIONTYPE_VECTOR3);
            animation.setKeys([
                { frame: 0, value: new Vector3(offset / 2.0, 0, offset / 2.0) },
                { frame: 100, value: new Vector3(offset / 2.0, data.value * scale, offset / 2.0) },
            ]);
            bar.animations.push(animation);

            animation = new Animation("anim2", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT);
            animation.setKeys([
                { frame: 0, value: 0 },
                { frame: 100, value: (data.value * scale) / 2 },
            ]);
            bar.animations.push(animation);
            scene.beginAnimation(bar, 0, 100, false, 2.0);

            const barMaterial = new StandardMaterial(data.label + "mat", scene);
            barMaterial.diffuseColor = data.color;
            barMaterial.emissiveColor = data.color.scale(0.3);
            barMaterial.specularColor = new Color3(0, 0, 0);
            bar.material = barMaterial;

            shadowGenerator.getShadowMap()!.renderList!.push(bar);

            const barLegend = CreateGround(
                data.label + "Legend",
                { width: playgroundSize / 2, height: offset * 2, subdivisions: 1 },
                scene
            );
            barLegend.position.x = x;
            barLegend.position.z = -playgroundSize / 4;
            barLegend.rotation.y = Math.PI / 2;

            const barLegendMaterial = new StandardMaterial(data.label + "LegendMat", scene);
            const barLegendTexture = new DynamicTexture("dynamic texture", 512, scene, true);
            barLegendTexture.hasAlpha = true;
            barLegendMaterial.diffuseTexture = barLegendTexture;
            barLegendMaterial.emissiveColor = new Color3(0.4, 0.4, 0.4);
            barLegend.material = barLegendMaterial;

            const size = barLegendTexture.getSize();
            barLegendTexture.drawText(
                data.label + " (" + data.value + "%)",
                80,
                size.height / 2 + 30,
                "bold 50px Segoe UI",
                "white",
                "transparent"
            );

            x += offset + margin;
        }
    };

    createSeries(browsersSeries);

    camera.lowerAlphaLimit = Math.PI;
    camera.upperAlphaLimit = 2 * Math.PI;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 150;

    return scene;
}
