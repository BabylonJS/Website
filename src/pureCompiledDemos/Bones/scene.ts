import type { Engine } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    ArcRotateCamera,
    Color3,
    CreateGround,
    DirectionalLight,
    ImportMeshAsync,
    RegisterAnimatable,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterAnimatable();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export async function createBonesScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    const light = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), scene);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 30, 0), scene);
    camera.setPosition(new Vector3(20, 70, 120));
    light.position = new Vector3(20, 150, 70);
    camera.minZ = 10.0;

    scene.ambientColor = new Color3(0.3, 0.3, 0.3);

    const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    const shadowGenerator = new ShadowGenerator(1024, light);

    const rabbitResult = await ImportMeshAsync("/Scenes/Rabbit/Rabbit.babylon", scene, { meshNames: "Rabbit" });
    const rabbit = rabbitResult.meshes[1] as Mesh;
    rabbit.scaling = new Vector3(0.4, 0.4, 0.4);
    shadowGenerator.getShadowMap()!.renderList!.push(rabbit);

    const rabbit2 = rabbit.clone("rabbit2", null)!;
    const rabbit3 = rabbit.clone("rabbit3", null)!;
    shadowGenerator.getShadowMap()!.renderList!.push(rabbit2);
    shadowGenerator.getShadowMap()!.renderList!.push(rabbit3);

    rabbit2.position = new Vector3(-50, 0, -20);
    rabbit2.skeleton = rabbit.skeleton!.clone("clonedSkeleton");

    rabbit3.position = new Vector3(50, 0, -20);
    rabbit3.skeleton = rabbit.skeleton!.clone("clonedSkeleton2");

    scene.beginAnimation(rabbitResult.skeletons[0], 0, 100, true, 0.8);
    scene.beginAnimation(rabbit2.skeleton, 73, 100, true, 0.8);
    scene.beginAnimation(rabbit3.skeleton, 0, 72, true, 0.8);

    const dudeResult = await ImportMeshAsync("/Scenes/Dude/Dude.babylon", scene, { meshNames: "him" });
    const dude = dudeResult.meshes[0] as Mesh;
    for (const mesh of dudeResult.meshes) {
        shadowGenerator.getShadowMap()!.renderList!.push(mesh);
    }
    dude.rotation.y = Math.PI;
    dude.position = new Vector3(0, 0, -80);
    scene.beginAnimation(dudeResult.skeletons[0], 0, 100, true, 1.0);

    return scene;
}
