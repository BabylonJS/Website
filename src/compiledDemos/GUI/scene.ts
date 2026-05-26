import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";

export function createGuiScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 12, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    const sphere = CreateSphere("sphere", { segments: 32, diameter: 4 }, scene);
    const material = new StandardMaterial("sphereMaterial", scene);
    material.diffuseColor = new Color3(0.2, 0.6, 1);
    sphere.material = material;
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, scene);
    const panel = new StackPanel("panel");
    panel.width = "260px";
    panel.top = "20px";
    panel.horizontalAlignment = 2;
    panel.verticalAlignment = 0;
    ui.addControl(panel);
    const title = new TextBlock("title", "GUI Controls");
    title.height = "42px";
    title.color = "white";
    title.fontSize = 24;
    panel.addControl(title);
    const button = Button.CreateSimpleButton("button", "Change Color");
    button.height = "48px";
    button.color = "white";
    button.background = "#2364aa";
    button.onPointerClickObservable.add(() => {
        material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
    });
    panel.addControl(button);
    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.01 * scene.getAnimationRatio();
    });
    return scene;
}
