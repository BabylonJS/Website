import { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import { createOffscreenScene } from "./scene";

declare global {
    interface Window {
        __babylonDemoReady?: Promise<void>;
        __babylonDemo?: {
            engine: Engine;
            scene?: Scene;
        };
    }
}

type WorkerMessage =
    | {
          type: "ready";
      }
    | {
          type: "error";
          message: string;
      };

const mainCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;
const workerCanvas = document.getElementById("workerRenderCanvas") as HTMLCanvasElement | null;
const loading = document.getElementById("loading");
const notSupported = document.getElementById("notSupported");
const labelWorker = document.getElementById("labelWorker");
const slowButton = document.getElementById("slowButton");

if (!mainCanvas || !workerCanvas) {
    throw new Error("Offscreen demo requires renderCanvas and workerRenderCanvas elements.");
}

function fitCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight));
}

function slowDownMainThread(): void {
    let count = 0;
    window.setInterval(() => {
        for (let index = 0; index < 10_000_000; index++) {
            count += Math.cos(Math.sin(Math.random()));
        }

        if (count > Number.MAX_SAFE_INTEGER) {
            count = 0;
        }
    }, 1);
}

async function waitForSceneReady(scene: Scene): Promise<void> {
    await new Promise<void>((resolve) => {
        scene.executeWhenReady(resolve);
    });
}

function startMainThreadDemo(): Promise<void> {
    const engine = new Engine(mainCanvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });
    window.__babylonDemo = { engine };

    return createOffscreenScene(engine, true).then(async (scene) => {
        window.__babylonDemo = { engine, scene };
        await waitForSceneReady(scene);
        mainCanvas.style.opacity = "1";

        engine.runRenderLoop(() => {
            engine.resize();
            if (scene.activeCamera) {
                scene.render();
            }
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    });
}

function startWorkerDemo(): Promise<void> {
    if (!("OffscreenCanvas" in window) || typeof workerCanvas.transferControlToOffscreen !== "function") {
        notSupported?.classList.remove("hidden");
        if (labelWorker) {
            labelWorker.textContent = "OffscreenCanvas is not supported";
        }
        return Promise.reject(new Error("OffscreenCanvas is not supported by this browser."));
    }

    fitCanvasToDisplaySize(workerCanvas);
    const offscreenCanvas = workerCanvas.transferControlToOffscreen();
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

    const ready = new Promise<void>((resolve, reject) => {
        worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
            if (event.data.type === "ready") {
                workerCanvas.style.opacity = "1";
                resolve();
            } else if (event.data.type === "error") {
                reject(new Error(event.data.message));
            }
        });

        worker.addEventListener("error", (event) => {
            reject(new Error(event.message));
        });
    });

    worker.postMessage(
        {
            type: "init",
            canvas: offscreenCanvas,
            width: workerCanvas.width,
            height: workerCanvas.height,
        },
        [offscreenCanvas]
    );

    window.addEventListener("resize", () => {
        worker.postMessage({
            type: "resize",
            width: Math.max(1, Math.floor(workerCanvas.clientWidth)),
            height: Math.max(1, Math.floor(workerCanvas.clientHeight)),
        });
    });

    return ready;
}

slowButton?.addEventListener("click", slowDownMainThread);

window.__babylonDemoReady = Promise.all([startMainThreadDemo(), startWorkerDemo()]).then(() => {
    loading?.classList.add("hidden");
});
