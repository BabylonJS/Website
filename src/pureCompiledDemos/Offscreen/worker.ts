import { Engine } from "@babylonjs/core/pure";
import { createOffscreenScene } from "./scene";

type InitMessage = {
    type: "init";
    canvas: OffscreenCanvas;
    width: number;
    height: number;
};

type ResizeMessage = {
    type: "resize";
    width: number;
    height: number;
};

type WorkerMessage = InitMessage | ResizeMessage;

let canvas: OffscreenCanvas | undefined;
let engine: Engine | undefined;

async function waitForSceneReady(scene: Awaited<ReturnType<typeof createOffscreenScene>>): Promise<void> {
    await new Promise<void>((resolve) => {
        scene.executeWhenReady(resolve);
    });
}

async function startWorkerRender(message: InitMessage): Promise<void> {
    canvas = message.canvas;
    canvas.width = message.width;
    canvas.height = message.height;

    engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });

    const scene = await createOffscreenScene(engine, false);
    await waitForSceneReady(scene);

    engine.runRenderLoop(() => {
        engine?.resize();
        if (scene.activeCamera) {
            scene.render();
        }
    });

    self.postMessage({ type: "ready" });
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const message = event.data;

    if (message.type === "init") {
        startWorkerRender(message).catch((error: unknown) => {
            self.postMessage({
                type: "error",
                message: error instanceof Error ? error.message : String(error),
            });
        });
        return;
    }

    if (canvas) {
        canvas.width = message.width;
        canvas.height = message.height;
        engine?.resize();
    }
};
