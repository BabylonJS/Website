import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateTorus } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

export function createPointLightShadowMapScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", (3 * Math.PI) / 2, Math.PI / 8, 30, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 40;
    camera.minZ = 0;
    camera.attachControl(canvas, true);

    const light = new PointLight("light1", Vector3.Zero(), scene);
    light.intensity = 0.7;

    const lightImpostor = CreateSphere("sphere1", { segments: 16, diameter: 1 }, scene);
    const lightImpostorMaterial = new StandardMaterial("lightImpostor", scene);
    lightImpostorMaterial.emissiveColor = Color3.Yellow();
    lightImpostorMaterial.linkEmissiveWithDiffuse = true;
    lightImpostor.material = lightImpostorMaterial;
    lightImpostor.parent = light;

    const knot = CreateTorusKnot(
        "knot",
        { radius: 2, tube: 0.2, radialSegments: 128, tubularSegments: 64, p: 4, q: 1 },
        scene
    );
    const torus = CreateTorus("torus", { diameter: 8, thickness: 1, tessellation: 32 }, scene);

    const torusMaterial = new StandardMaterial("torus", scene);
    torusMaterial.diffuseColor = Color3.Red();
    torus.material = torusMaterial;

    const knotMaterial = new StandardMaterial("knot", scene);
    knotMaterial.diffuseColor = Color3.White();
    knot.material = knotMaterial;

    const container = CreateSphere("sphere2", { segments: 16, diameter: 50, sideOrientation: Mesh.BACKSIDE }, scene);
    const containerMaterial = new StandardMaterial("container", scene);
    const containerTexture = new Texture("/Scenes/Customs/grass.jpg", scene);
    containerTexture.uScale = 10;
    containerTexture.vScale = 10;
    containerMaterial.diffuseTexture = containerTexture;
    container.material = containerMaterial;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.getShadowMap()?.renderList?.push(knot, torus);
    shadowGenerator.setDarkness(0.5);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.bias = 0;

    container.receiveShadows = true;
    torus.receiveShadows = true;

    scene.registerBeforeRender(() => {
        knot.rotation.y += 0.01;
        knot.rotation.x += 0.01;
        torus.rotation.y += 0.05;
        torus.rotation.z += 0.03;
    });

    return scene;
}
