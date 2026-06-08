import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StarfieldProceduralTexture } from "@babylonjs/procedural-textures/starfield/starfieldProceduralTexture";

export function createStarfieldScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, -30, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    new HemisphericLight("hemi", new Vector3(0, 0.5, 0), scene);

    const spaceScale = 10.0;
    const space = CreateCylinder(
        "space",
        { height: 10 * spaceScale, diameterTop: 0, diameterBottom: 6 * spaceScale, tessellation: 20, subdivisions: 20 },
        scene
    );

    const starfieldPT = new StarfieldProceduralTexture("starfieldPT", 512, scene);
    const starfieldMaterial = new StandardMaterial("starfield", scene);
    starfieldMaterial.diffuseTexture = starfieldPT;
    starfieldMaterial.diffuseTexture.coordinatesMode = Texture.SKYBOX_MODE;
    starfieldMaterial.backFaceCulling = false;
    starfieldPT.beta = 0.1;

    space.material = starfieldMaterial;

    scene.registerBeforeRender(() => {
        starfieldPT.time += scene.getAnimationRatio() * 0.8;
    });

    return scene;
}
