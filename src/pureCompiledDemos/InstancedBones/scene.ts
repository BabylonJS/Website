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
    RegisterInstancedMesh,
    RegisterRenderTargetTexture,
    RegisterShadowGeneratorSceneComponent,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core/pure";

RegisterBabylonFileLoader();
RegisterAnimatable();
RegisterInstancedMesh();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterShadowGeneratorSceneComponent(ShadowGenerator);

export async function createBones2TestScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    const light = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), scene);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 30, 0), scene);
    camera.setPosition(new Vector3(20, 70, 120));
    light.position = new Vector3(50, 250, 200);
    light.shadowOrthoScale = 2.0;
    camera.minZ = 1.0;

    scene.ambientColor = new Color3(0.3, 0.3, 0.3);

    // Ground
    const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    // Shadows
    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;

    // Dude
    const result = await ImportMeshAsync("/Scenes/Dude/Dude.babylon", scene, { meshNames: "him" });
    const newMeshes = result.meshes;
    const dude = newMeshes[0] as Mesh;

    for (let index = 1; index < newMeshes.length; index++) {
        shadowGenerator.getShadowMap()!.renderList!.push(newMeshes[index]);
    }

    for (let count = 0; count < 50; count++) {
        const offsetX = 200 * Math.random() - 100;
        const offsetZ = 200 * Math.random() - 100;
        for (let index = 1; index < newMeshes.length; index++) {
            const instance = (newMeshes[index] as Mesh).createInstance("instance" + count);

            shadowGenerator.getShadowMap()!.renderList!.push(instance);

            instance.parent = newMeshes[index].parent;
            instance.position = newMeshes[index].position.clone();

            if (!(instance.parent as Mesh).subMeshes) {
                instance.position.x += offsetX;
                instance.position.z -= offsetZ;
            }
        }
    }

    dude.rotation.y = Math.PI;
    dude.position = new Vector3(0, 0, -80);

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    return scene;
}
