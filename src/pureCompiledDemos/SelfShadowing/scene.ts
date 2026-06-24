import type { Engine } from "@babylonjs/core/pure";
import {
    CreateTorusKnot,
    DirectionalLight,
    FreeCamera,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    Vector3,
} from "@babylonjs/core/pure";

RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export function createSelfShadowingScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);

    const camera = new FreeCamera("Camera", new Vector3(0, 0, -20), scene);
    camera.attachControl(canvas, true);

    const light = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
    light.position = new Vector3(20, 40, 20);

    const torus = CreateTorusKnot(
        "knot",
        { radius: 2, tube: 0.5, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );
    torus.position.x = -5;

    const torus2 = CreateTorusKnot(
        "knot",
        { radius: 2, tube: 0.5, radialSegments: 128, tubularSegments: 64, p: 2, q: 3 },
        scene
    );
    torus2.position.x = 5;

    const shadowGenerator = new ShadowGenerator(1024, light, true);
    shadowGenerator.getShadowMap()!.renderList!.push(torus);
    shadowGenerator.useBlurExponentialShadowMap = true;
    light.shadowMinZ = 1;
    light.shadowMaxZ = 2500;
    shadowGenerator.depthScale = 2500;
    shadowGenerator.bias = 0.001;

    torus.receiveShadows = true;

    scene.registerBeforeRender(() => {
        torus.rotation.x += 0.01;
        torus2.rotation.x += 0.01;
    });

    return scene;
}
