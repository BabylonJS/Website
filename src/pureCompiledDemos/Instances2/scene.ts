import type { Engine, Scene as SceneType } from "@babylonjs/core/pure";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { InstancedMesh } from "@babylonjs/core/Meshes/instancedMesh";
import {
    ArcRotateCamera,
    Axis,
    Color3,
    CreateBox,
    CubeTexture,
    HemisphericLight,
    ImportMeshAsync,
    PointLight,
    RegisterBabylonFileLoader,
    RegisterEnginesExtensionsEngineRawTexture,
    RegisterEnginesExtensionsEngineRenderTarget,
    RegisterEnginesExtensionsEngineRenderTargetTexture,
    RegisterInstancedMesh,
    RegisterRenderTargetTexture,
    RegisterVolumetricLightScatteringPostProcess,
    Scene,
    Space,
    StandardMaterial,
    Texture,
    Vector3,
    VolumetricLightScatteringPostProcess,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/postprocess.vertex";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.vertex";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.fragment";
import "@babylonjs/core/Shaders/volumetricLightScattering.fragment";

RegisterBabylonFileLoader();
RegisterInstancedMesh();
RegisterEnginesExtensionsEngineRawTexture();
RegisterEnginesExtensionsEngineRenderTarget();
RegisterEnginesExtensionsEngineRenderTargetTexture();
RegisterRenderTargetTexture();
RegisterVolumetricLightScatteringPostProcess();

export function createInstancesTestScene(engine: Engine, canvas: HTMLCanvasElement): SceneType {
    const rings1: InstancedMesh[] = [];
    const rings2: InstancedMesh[] = [];
    const rings3: InstancedMesh[] = [];
    const rings4: InstancedMesh[] = [];
    const rings5: InstancedMesh[] = [];

    const radius = 280;
    const numPoints = 10;
    const TWO_PI = Math.PI * 2;
    const angle = TWO_PI / numPoints;

    let scale = 600;
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("Camera", 1.7, 0.7, 1350, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, false);

    const light = new HemisphericLight("light1", new Vector3(0, 0, 10), scene);
    light.intensity = 0.2;

    const plight = new PointLight("plight1", new Vector3(0, 0, 180), scene);

    const mat = new StandardMaterial("mat", scene);
    mat.diffuseTexture = new Texture("/Demos/Instances2/test8q_dDo_d.jpg", scene);
    mat.bumpTexture = new Texture("/Demos/Instances2/test8q_dDo_n.jpg", scene);
    mat.specularTexture = new Texture("/Demos/Instances2/test8q_dDo_s.jpg", scene);

    const skybox = CreateBox("skyBox", { size: 5000 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("/Demos/Instances2/skybox/nebula", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    const emitter = new VolumetricLightScatteringPostProcess(
        "godrays",
        1.0,
        camera,
        undefined,
        100,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );
    const emitterMaterial = emitter.mesh.material as StandardMaterial;
    emitterMaterial.diffuseTexture = new Texture(
        "/Demos/Instances2/sun.png",
        scene,
        true,
        false,
        Texture.BILINEAR_SAMPLINGMODE
    );
    emitterMaterial.diffuseTexture.hasAlpha = true;
    emitter.mesh.position = new Vector3(0, 180, 0);

    ImportMeshAsync("/Demos/Instances2/killer.babylon", scene).then((result) => {
        const obj = result.meshes[0] as Mesh;
        obj.material = mat;

        for (let index = 0; index < numPoints; index++) {
            rings1[index] = obj.createInstance("i1_" + index);
            rings2[index] = obj.createInstance("i2_" + index);
            rings3[index] = obj.createInstance("i3_" + index);
            rings4[index] = obj.createInstance("i4_" + index);
            rings5[index] = obj.createInstance("i5_" + index);
        }

        obj.rotation.x = 200;
        obj.isVisible = false;

        let t = 0.0;
        scene.registerBeforeRender(function () {
            for (let index = 0; index < numPoints; index++) {
                const speed = t / 10.0;
                rings1[index].position.x = radius * Math.sin(speed + angle * index);
                rings1[index].position.z = radius * Math.cos(speed + angle * index);
                rings1[index].lookAt(Vector3.Zero());
                rings1[index].rotate(Axis.Y, 1.6, Space.LOCAL);
            }

            for (let index = 0; index < numPoints; index++) {
                const speed = -t / 8.0;
                rings2[index].position.x = radius * Math.sin(speed + angle * index);
                rings2[index].position.y = 70;
                rings2[index].position.z = radius * Math.cos(speed + angle * index);
                rings2[index].lookAt(new Vector3(0, 100, 0));
                rings2[index].rotate(Axis.Y, 1.6, Space.LOCAL);
            }

            for (let index = 0; index < numPoints; index++) {
                const speed = t / 12.0;
                rings3[index].position.x = 200 * Math.sin(speed + angle * index);
                rings3[index].position.y = 180;
                rings3[index].position.z = 200 * Math.cos(speed + angle * index);
                rings3[index].lookAt(new Vector3(0, 150, 0));
                rings3[index].rotate(Axis.Y, 1.6, Space.LOCAL);
                rings3[index].rotate(Axis.Z, -1.2, Space.LOCAL);
            }

            for (let index = 0; index < numPoints; index++) {
                const speed = -t / 6.0;
                rings4[index].position.x = 150 * Math.sin(speed + angle * index);
                rings4[index].position.y = 180;
                rings4[index].position.z = 150 * Math.cos(speed + angle * index);
                rings4[index].scaling = new Vector3(0.8, 0.8, 0.8);
                rings4[index].lookAt(new Vector3(0, 150, 0));
                rings4[index].rotate(Axis.Y, 1.6, Space.LOCAL);
                rings4[index].rotate(Axis.Z, -1.2, Space.LOCAL);
            }

            for (let index = 0; index < numPoints; index++) {
                const speed = -t / 10.0;
                rings5[index].position.x = 750 * Math.sin(speed + angle * index);
                rings5[index].position.z = 750 * Math.cos(speed + angle * index);
                rings5[index].scaling = new Vector3(2.5, 2.5, 2.5);
                rings5[index].lookAt(Vector3.Zero());
                rings5[index].rotate(Axis.Y, 1.6, Space.LOCAL);
            }

            plight.intensity = 1 + Math.random() * 1.0 - 0.5;
            scale = Math.random() * 100 - 500;
            emitter.mesh.scaling = new Vector3(scale, scale, scale);
            t += 0.1;
        });
    });

    return scene;
}
