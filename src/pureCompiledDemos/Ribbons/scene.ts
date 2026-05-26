import {
    ArcRotateCamera,
    Color3,
    CreateRibbon,
    type Engine,
    type Mesh,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
    VolumetricLightScatteringPostProcess,
} from "@babylonjs/core/pure";
import "@babylonjs/core/Shaders/volumetricLightScattering.fragment";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.fragment";
import "@babylonjs/core/Shaders/volumetricLightScatteringPass.vertex";

const latitude = 50;
const longitude = 50;
const morphDelayMs = 4000;
const morphSteps = Math.floor(morphDelayMs / 80);

function randomHalfColor(): Color3 {
    return new Color3(Math.random() / 2, Math.random() / 2, Math.random() / 2);
}

function harmonic(multipliers: number[], paths: Vector3[][]): void {
    const stepLatitude = Math.PI / latitude;
    const stepLongitude = (Math.PI * 2) / longitude;
    let index = 0;

    for (let theta = 0; theta <= Math.PI * 2; theta += stepLongitude) {
        const path: Vector3[] = [];

        for (let phi = 0; phi <= Math.PI; phi += stepLatitude) {
            let radius = 0;
            radius += Math.pow(Math.sin(Math.floor(multipliers[0]) * phi), Math.floor(multipliers[1]));
            radius += Math.pow(Math.cos(Math.floor(multipliers[2]) * phi), Math.floor(multipliers[3]));
            radius += Math.pow(Math.sin(Math.floor(multipliers[4]) * theta), Math.floor(multipliers[5]));
            radius += Math.pow(Math.cos(Math.floor(multipliers[6]) * theta), Math.floor(multipliers[7]));

            path.push(
                new Vector3(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.cos(phi),
                    radius * Math.sin(phi) * Math.sin(theta)
                )
            );
        }

        paths[index] = path;
        index++;
    }
}

function setNextTarget(
    multipliers: number[],
    paths: Vector3[][],
    targetPaths: Vector3[][],
    deltas: Vector3[],
    colors: Color3[],
    deltaColors: Color3[]
): void {
    const scale = 1 / morphSteps;

    for (let index = 0; index < multipliers.length; index++) {
        multipliers[index] = Math.floor(Math.random() * 10);
    }

    harmonic(multipliers, targetPaths);

    let deltaIndex = 0;
    for (let pathIndex = 0; pathIndex < targetPaths.length; pathIndex++) {
        const targetPath = targetPaths[pathIndex];
        const path = paths[pathIndex];

        for (let pointIndex = 0; pointIndex < targetPath.length; pointIndex++) {
            deltas[deltaIndex] = targetPath[pointIndex].subtract(path[pointIndex]).scale(scale);
            deltaIndex++;
        }
    }

    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        deltaColors[colorIndex] = randomHalfColor().subtract(colors[colorIndex]).scale(scale);
    }
}

function morphRibbon(
    scene: Scene,
    mesh: Mesh,
    paths: Vector3[][],
    targetPaths: Vector3[][],
    deltas: Vector3[],
    colors: Color3[],
    deltaColors: Color3[],
    counter: number
): Mesh {
    if (counter === morphSteps) {
        paths.length = 0;
        targetPaths.forEach((path) => paths.push(path));
        return mesh;
    }

    let deltaIndex = 0;
    for (const path of paths) {
        for (let pointIndex = 0; pointIndex < path.length; pointIndex++) {
            path[pointIndex] = path[pointIndex].add(deltas[deltaIndex]);
            deltaIndex++;
        }
    }

    const updatedMesh = CreateRibbon("ribbon", { pathArray: paths, instance: mesh }, scene);

    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        colors[colorIndex] = colors[colorIndex].add(deltaColors[colorIndex]);
    }

    return updatedMesh;
}

export function createRibbonsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0.2, 1);

    const camera = new ArcRotateCamera("Camera", Math.PI / 2 - 0.5, 0.5, 6, Vector3.Zero(), scene);
    camera.wheelPrecision = 100;
    camera.attachControl(canvas, true);

    const colors = [
        randomHalfColor(),
        randomHalfColor(),
        randomHalfColor(),
        randomHalfColor(),
        randomHalfColor(),
        randomHalfColor(),
    ];
    const material = new StandardMaterial("ribbonMaterial", scene);
    material.diffuseColor = colors[0];
    material.emissiveColor = colors[1];
    material.specularColor = colors[2];
    material.specularPower = 4;
    material.backFaceCulling = false;

    const multipliers = [1, 3, 1, 5, 1, 7, 1, 9];
    const paths: Vector3[][] = [];
    const targetPaths: Vector3[][] = [];
    const deltas: Vector3[] = [];
    const deltaColors: Color3[] = [];
    harmonic(multipliers, paths);

    let mesh = CreateRibbon(
        "ribbon",
        { pathArray: paths, closeArray: true, closePath: false, offset: 0, updatable: true },
        scene
    );
    mesh.freezeNormals();
    mesh.material = material;

    const volumetricLight = new VolumetricLightScatteringPostProcess(
        "vl",
        1,
        camera,
        mesh,
        50,
        Texture.BILINEAR_SAMPLINGMODE,
        engine,
        false
    );
    volumetricLight.exposure = 0.15;
    volumetricLight.decay = 0.95;
    volumetricLight.weight = 0.5;

    let morphing = true;
    let counter = 0;
    let rotationX = 0;
    let rotationY = 0;
    let deltaRotationX = Math.random() / 200;
    let deltaRotationY = Math.random() / 400;

    const beginMorph = () => {
        morphing = true;
        counter = 0;
        setNextTarget(multipliers, paths, targetPaths, deltas, colors, deltaColors);
        deltaRotationX = Math.random() / 200;
        deltaRotationY = Math.random() / 400;
    };

    const interval = window.setInterval(beginMorph, morphDelayMs);
    beginMorph();

    scene.registerBeforeRender(() => {
        if (morphing) {
            mesh = morphRibbon(scene, mesh, paths, targetPaths, deltas, colors, deltaColors, counter);
            material.diffuseColor = colors[0];
            material.emissiveColor = colors[1];
            material.specularColor = colors[2];
            counter++;

            if (counter > morphSteps) {
                morphing = false;
            }
        }

        rotationX += deltaRotationX;
        rotationY -= deltaRotationY;
        mesh.rotation.y = rotationY;
        mesh.rotation.z = rotationX;
    });

    scene.onDisposeObservable.add(() => {
        window.clearInterval(interval);
    });

    return scene;
}
