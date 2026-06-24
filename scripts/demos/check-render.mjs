import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const repoRoot = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const buildRoot = path.join(repoRoot, "build");
const manifestPath = path.resolve(repoRoot, process.env.DEMOS_MANIFEST_PATH || "src/compiledDemos/manifest.json");
const demosBasePath = (process.env.DEMOS_BASE_PATH || "Demos").replace(/^\/+|\/+$/g, "");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const selectedDemos = new Set(
    (process.env.DEMOS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
);

const contentTypes = new Map([
    [".html", "text/html; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".png", "image/png"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".webp", "image/webp"],
    [".wasm", "application/wasm"],
]);

function escapeAzureDevOpsMessage(message) {
    return String(message)
        .replace(/%/g, "%AZP25")
        .replace(/\r/g, "%0D")
        .replace(/\n/g, "%0A")
        .replace(/]/g, "%5D")
        .replace(/;/g, "%3B");
}

function logFailure(message) {
    console.error(`##vso[task.logissue type=error]${escapeAzureDevOpsMessage(message)}`);
    console.error(message);
}

function formatBrowserIssues(consoleErrors, pageErrors, requestFailures) {
    const sections = [];
    if (consoleErrors.length > 0) {
        sections.push(`console errors: ${consoleErrors.join(" | ")}`);
    }
    if (pageErrors.length > 0) {
        sections.push(`page errors: ${pageErrors.join(" | ")}`);
    }
    if (requestFailures.length > 0) {
        sections.push(`request failures: ${requestFailures.join(" | ")}`);
    }
    return sections.join("; ");
}

const demos = manifest.demos.filter(
    (demo) => !demo.renderCheck?.disabled && (selectedDemos.size === 0 || selectedDemos.has(demo.slug))
);

if (demos.length === 0) {
    console.log("No compiled demos selected for render checks.");
    process.exit(0);
}

const server = http.createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
        let relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
        if (!relativePath || relativePath.endsWith("/")) {
            relativePath = path.join(relativePath, "index.html");
        }

        const filePath = path.normalize(path.join(buildRoot, relativePath));
        if (!filePath.startsWith(buildRoot)) {
            response.writeHead(403);
            response.end("Forbidden");
            return;
        }

        const body = await fs.readFile(filePath);
        response.writeHead(200, {
            "content-type": contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
        });
        response.end(body);
    } catch {
        response.writeHead(404);
        response.end("Not found");
    }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({
    args: ["--ignore-gpu-blocklist", "--use-gl=swiftshader"],
});

const failures = [];

async function getCanvasBox(page, canvas, timeoutMs) {
    const box = await canvas.boundingBox({ timeout: timeoutMs });
    if (!box) {
        throw new Error("Canvas has no bounding box.");
    }

    const viewport = page.viewportSize();
    if (!viewport) {
        throw new Error("Page has no viewport size.");
    }

    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.min(viewport.width - x, Math.ceil(box.width));
    const height = Math.min(viewport.height - y, Math.ceil(box.height));

    if (width <= 0 || height <= 0) {
        throw new Error(`Canvas is outside the viewport (${JSON.stringify({ box, viewport })}).`);
    }

    return { x, y, width, height };
}

async function sampleCanvas(page, canvas, timeoutMs) {
    const clip = await getCanvasBox(page, canvas, timeoutMs);
    const screenshot = await page.screenshot({ clip, timeout: timeoutMs });
    const image = sharp(screenshot).ensureAlpha();
    const metadata = await image.metadata();
    const pixels = await image.raw().toBuffer();
    let coloredSamples = 0;
    let transparentSamples = 0;
    const step = 12;

    for (let y = 0; y < metadata.height; y += step) {
        for (let x = 0; x < metadata.width; x += step) {
            const index = (y * metadata.width + x) * 4;
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const alpha = pixels[index + 3];

            if (alpha === 0) {
                transparentSamples++;
            }

            if (alpha > 0 && (red > 8 || green > 8 || blue > 8)) {
                coloredSamples++;
            }
        }
    }

    return {
        stats: {
            exists: true,
            readable: true,
            width: metadata.width,
            height: metadata.height,
            coloredSamples,
            transparentSamples,
        },
        pixels,
    };
}

function countChangedSamples(before, after, width, height) {
    let changedSamples = 0;
    const step = 12;
    const threshold = 18;

    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const index = (y * width + x) * 4;
            const delta =
                Math.abs(before[index] - after[index]) +
                Math.abs(before[index + 1] - after[index + 1]) +
                Math.abs(before[index + 2] - after[index + 2]) +
                Math.abs(before[index + 3] - after[index + 3]);

            if (delta > threshold) {
                changedSamples++;
            }
        }
    }

    return changedSamples;
}

async function waitForAnimationFramePair(page) {
    await page.evaluate(
        () =>
            new Promise((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(resolve));
            })
    );
}

async function waitForDemoReady(page, timeoutMs) {
    await page.evaluate((timeout) => {
        const ready = window.__babylonDemoReady;
        return Promise.race([
            ready,
            new Promise((_, reject) => {
                window.setTimeout(() => reject(new Error(`Demo readiness timed out after ${timeout}ms`)), timeout);
            }),
        ]);
    }, timeoutMs);
}

async function checkCanvas(page, locator, demo, timeoutMs, label) {
    const minimumColoredSamples = demo.renderCheck?.minimumColoredSamples || 50;
    // Heavier scenes (large .babylon/glTF assets, post-process pipelines) can take several
    // render-loop iterations to fully paint, especially under the software renderer used in
    // CI. Rather than judging a single early frame, keep rendering and re-sampling until the
    // canvas reaches the expected coverage or the settle deadline passes. Genuinely blank
    // demos still fail once the deadline elapses.
    const settleTimeoutMs = demo.renderCheck?.settleTimeoutMs ?? 8000;
    const deadline = Date.now() + settleTimeoutMs;

    let best = await sampleCanvas(page, locator, timeoutMs);
    while (best.stats.coloredSamples < minimumColoredSamples && Date.now() < deadline) {
        await waitForAnimationFramePair(page);
        await page.waitForTimeout(150);
        const next = await sampleCanvas(page, locator, timeoutMs);
        if (next.stats.coloredSamples >= best.stats.coloredSamples) {
            best = next;
        }
    }

    if (best.stats.coloredSamples < minimumColoredSamples) {
        failures.push(
            `${demo.slug}: ${label} canvas check failed (${JSON.stringify(best.stats)}, expected at least ${minimumColoredSamples} colored samples)`
        );
    }

    return best;
}

try {
    for (const demo of demos) {
        const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
        const consoleErrors = [];
        const pageErrors = [];
        const requestFailures = [];
        page.on("console", (message) => {
            if (message.type() === "error") {
                consoleErrors.push(message.text());
            }
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("requestfailed", (request) => {
            requestFailures.push(`${request.url()} (${request.failure()?.errorText || "failed"})`);
        });
        page.on("response", (response) => {
            if (response.status() >= 400) {
                requestFailures.push(`${response.url()} (${response.status()} ${response.statusText()})`);
            }
        });

        const timeoutMs = demo.renderCheck?.timeoutMs || 15000;
        const url = `${baseUrl}/${demosBasePath}/${encodeURIComponent(demo.slug)}/`;

        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
            await page.waitForFunction(() => Boolean(window.__babylonDemoReady), null, { timeout: timeoutMs });
            await waitForDemoReady(page, timeoutMs);
            await waitForAnimationFramePair(page);

            const canvasSelector = demo.renderCheck?.canvasSelector || "canvas";
            const canvases = page.locator(canvasSelector);
            const canvasCount = await canvases.count();
            const minimumCanvasCount = demo.renderCheck?.minimumCanvasCount || 1;
            const canvas = canvases.first();
            let canvasStats = { exists: false };
            let canvasPixels = null;

            if (canvasCount < minimumCanvasCount) {
                failures.push(
                    `${demo.slug}: expected at least ${minimumCanvasCount} canvas element${minimumCanvasCount === 1 ? "" : "s"}, found ${canvasCount}`
                );
            }

            if (canvasCount > 0) {
                const sample = await checkCanvas(page, canvas, demo, timeoutMs, "primary");
                canvasStats = sample.stats;
                canvasPixels = sample.pixels;
            }

            for (let canvasIndex = 1; canvasIndex < Math.min(canvasCount, minimumCanvasCount); canvasIndex++) {
                await checkCanvas(page, canvases.nth(canvasIndex), demo, timeoutMs, `canvas ${canvasIndex + 1}`);
            }

            const interaction = demo.renderCheck?.interaction;
            if (interaction?.type === "clickCanvas" && canvasStats.readable) {
                const box = await getCanvasBox(page, canvas, timeoutMs);
                if (!box) {
                    failures.push(`${demo.slug}: interaction check failed (canvas has no bounding box)`);
                } else {
                    await page.mouse.click(
                        box.x + box.width * (interaction.x ?? 0.5),
                        box.y + box.height * (interaction.y ?? 0.5)
                    );
                    await page.waitForTimeout(interaction.waitMs || 750);
                    await waitForAnimationFramePair(page);

                    const afterInteraction = await sampleCanvas(page, canvas, timeoutMs);
                    const changedSamples = countChangedSamples(
                        canvasPixels,
                        afterInteraction.pixels,
                        canvasStats.width,
                        canvasStats.height
                    );
                    const minimumChangedSamples = interaction.minimumChangedSamples || 25;

                    if (changedSamples < minimumChangedSamples) {
                        failures.push(
                            `${demo.slug}: interaction check failed (${changedSamples} changed samples, expected at least ${minimumChangedSamples})`
                        );
                    }
                }
            }

            const browserIssues = formatBrowserIssues(consoleErrors, pageErrors, requestFailures);
            if (browserIssues) {
                failures.push(`${demo.slug}: browser issues while opening ${url}: ${browserIssues}`);
            }
        } catch (error) {
            const browserIssues = formatBrowserIssues(consoleErrors, pageErrors, requestFailures);
            failures.push(
                `${demo.slug}: ${error.message} while opening ${url}${browserIssues ? `. Browser details: ${browserIssues}` : ""}`
            );
        } finally {
            await page.close();
        }
    }
} finally {
    await browser.close();
    server.close();
}

if (failures.length > 0) {
    for (const failure of failures) {
        logFailure(failure);
    }
    process.exit(1);
}

console.log(`Checked ${demos.length} compiled demo${demos.length === 1 ? "" : "s"}.`);
