import {
    ArcRotateCamera,
    Color3,
    CreateCylinder,
    CreateSphere,
    CreateTorus,
    Effect,
    type Engine,
    PointLight,
    Scene,
    ShaderMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core/pure";
Effect.ShadersStore.customCellVertexShader = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 world;
uniform mat4 worldViewProjection;
varying vec3 vNormalW;
varying vec2 vUV;
void main(void) {
    vec4 worldPosition = world * vec4(position, 1.0);
    vNormalW = normalize(mat3(world) * normal);
    vUV = uv;
    gl_Position = worldViewProjection * vec4(position, 1.0);
}`;

Effect.ShadersStore.customCellFragmentShader = `
precision highp float;
varying vec3 vNormalW;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec3 vLightPosition;
uniform vec3 vLightColor;
void main(void) {
    vec3 normal = normalize(vNormalW);
    float light = max(dot(normal, normalize(vLightPosition)), 0.0);
    float shade = light > 0.95 ? 1.0 : light > 0.5 ? 0.8 : light > 0.2 ? 0.55 : 0.25;
    vec3 tex = texture2D(textureSampler, vUV * 3.0).rgb;
    gl_FragColor = vec4(tex * vLightColor * shade, 1.0);
}`;

export function createCustomShaderScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, Math.PI / 4, 40, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new PointLight("Omni", new Vector3(20, 100, 2), scene);

    const material = new ShaderMaterial(
        "cellShading",
        scene,
        { vertex: "customCell", fragment: "customCell" },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldViewProjection", "vLightPosition", "vLightColor"],
            samplers: ["textureSampler"],
        }
    );
    material.setTexture("textureSampler", new Texture("/Scenes/Customs/Ground.jpg", scene));
    material.setVector3("vLightPosition", light.position);
    material.setColor3("vLightColor", Color3.White());

    const sphere = CreateSphere("Sphere0", { segments: 32, diameter: 6 }, scene);
    const cylinder = CreateCylinder(
        "Cylinder",
        { height: 5, diameterTop: 3, diameterBottom: 2, tessellation: 32 },
        scene
    );
    const torus = CreateTorus("Torus", { diameter: 6, thickness: 1, tessellation: 32 }, scene);
    sphere.position.x = -10;
    torus.position.x = 10;
    sphere.material = material;
    cylinder.material = material;
    torus.material = material;

    let alpha = 0;
    scene.registerBeforeRender(() => {
        sphere.rotation.set(alpha, alpha, 0);
        cylinder.rotation.set(alpha, alpha, 0);
        torus.rotation.set(alpha, alpha, 0);
        alpha += 0.04 * scene.getAnimationRatio();
    });

    return scene;
}
