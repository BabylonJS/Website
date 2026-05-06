import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const repoRoot = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const buildRoot = path.join(repoRoot, "build");
const manifestPath = path.join(repoRoot, "src/compiledDemos/manifest.json");
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

async function sampleCanvas(canvas, timeoutMs) {
    const screenshot = await canvas.screenshot({ timeout: timeoutMs });
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

try {
    for (const demo of demos) {
        const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
            if (message.type() === "error") {
                consoleErrors.push(message.text());
            }
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));

        const timeoutMs = demo.renderCheck?.timeoutMs || 15000;
        const url = `${baseUrl}/Demos/${encodeURIComponent(demo.slug)}/`;

        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
            await page.waitForFunction(() => Boolean(window.__babylonDemoReady), null, { timeout: timeoutMs });
            await page.evaluate(() => window.__babylonDemoReady);
            await waitForAnimationFramePair(page);

            const canvas = page.locator("canvas").first();
            const canvasCount = await canvas.count();
            let canvasStats = { exists: false };
            let canvasPixels = null;

            if (canvasCount > 0) {
                const sample = await sampleCanvas(canvas, timeoutMs);
                canvasStats = sample.stats;
                canvasPixels = sample.pixels;
            }

            const minimumColoredSamples = demo.renderCheck?.minimumColoredSamples || 50;
            if (!canvasStats.exists || !canvasStats.readable || canvasStats.coloredSamples < minimumColoredSamples) {
                failures.push(
                    `${demo.slug}: canvas check failed (${JSON.stringify(canvasStats)}, expected at least ${minimumColoredSamples} colored samples)`
                );
            }

            const interaction = demo.renderCheck?.interaction;
            if (interaction?.type === "clickCanvas" && canvasStats.readable) {
                const box = await canvas.boundingBox();
                if (!box) {
                    failures.push(`${demo.slug}: interaction check failed (canvas has no bounding box)`);
                } else {
                    await canvas.click({
                        position: {
                            x: box.width * (interaction.x ?? 0.5),
                            y: box.height * (interaction.y ?? 0.5),
                        },
                        timeout: timeoutMs,
                    });
                    await page.waitForTimeout(interaction.waitMs || 750);
                    await waitForAnimationFramePair(page);

                    const afterInteraction = await sampleCanvas(canvas, timeoutMs);
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

            if (consoleErrors.length > 0 || pageErrors.length > 0) {
                failures.push(`${demo.slug}: browser errors: ${[...consoleErrors, ...pageErrors].join(" | ")}`);
            }
        } catch (error) {
            failures.push(`${demo.slug}: ${error.message}`);
        } finally {
            await page.close();
        }
    }
} finally {
    await browser.close();
    server.close();
}

if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exit(1);
}

console.log(`Checked ${demos.length} compiled demo${demos.length === 1 ? "" : "s"}.`);
