import {
    RegisterAbstractEngineCubeTexture,
    DepthRenderer,
    Engine,
    RegisterDepthRendererSceneComponent,
    RegisterEnginesExtensionsEngineCubeTexture,
    RegisterEnginesExtensionsEngineDynamicTexture,
    RegisterEnginesExtensionsEngineReadTexture,
    RegisterOutlineRenderer,
    Scene,
    RegisterStandardMaterial,
} from "@babylonjs/core/pure";

void Scene;

// Required in pure builds so common demos don't rely on stripped side-effect registration.
RegisterAbstractEngineCubeTexture();
RegisterEnginesExtensionsEngineCubeTexture();
RegisterEnginesExtensionsEngineDynamicTexture();
RegisterEnginesExtensionsEngineReadTexture();
RegisterStandardMaterial();
RegisterDepthRendererSceneComponent(DepthRenderer);
RegisterOutlineRenderer();

export interface DemoDefinition {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Scene | Promise<Scene>;
    onReady?: (scene: Scene, engine: Engine) => void | Promise<void>;
}

declare global {
    interface Window {
        __babylonDemoReady?: Promise<void>;
        __babylonDemo?: {
            engine: Engine;
            scene?: Scene;
        };
    }
}

export function runDemo(definition: DemoDefinition): void {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;
    const fps = document.getElementById("fps");
    const status = document.getElementById("status");
    const debugButton = document.getElementById("enableDebug");
    const fullscreenButton = document.getElementById("fullscreen");
    const notSupported = document.getElementById("notSupported");

    if (!canvas) {
        throw new Error("Compiled demo requires a canvas with id renderCanvas.");
    }

    if (!Engine.isSupported()) {
        notSupported?.classList.remove("hidden");
        return;
    }

    const engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });

    let scene: Scene | undefined;
    window.__babylonDemo = { engine };

    const ready = Promise.resolve(definition.createScene(engine, canvas)).then(
        (createdScene) =>
            new Promise<void>((resolve) => {
                scene = createdScene;
                window.__babylonDemo = { engine, scene };

                if (status) {
                    status.textContent = "Loading...";
                }

                scene.executeWhenReady(async () => {
                    if (scene?.activeCamera) {
                        scene.activeCamera.attachControl(canvas, true);
                    }

                    await definition.onReady?.(scene, engine);

                    canvas.style.opacity = "1";
                    if (status) {
                        status.textContent = "";
                    }
                    resolve();
                });
            })
    );

    window.__babylonDemoReady = ready;

    engine.runRenderLoop(() => {
        if (fps) {
            fps.textContent = `${engine.getFps().toFixed()} fps`;
        }

        scene?.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });

    fullscreenButton?.addEventListener("click", () => {
        engine.switchFullscreen(true);
    });

    debugButton?.addEventListener("click", async () => {
        if (!scene) {
            return;
        }

        await import("@babylonjs/inspector");

        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            scene.debugLayer.show();
        }
    });
}
