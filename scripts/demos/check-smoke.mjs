import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

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
    [".hdr", "application/octet-stream"],
    [".wasm", "application/wasm"],
    [".mp4", "video/mp4"],
    [".webm", "video/webm"],
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
    console.log("No compiled demos selected for smoke checks.");
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
        const contentType = contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";

        // Support HTTP Range requests so that <video>/<audio> elements (which
        // request partial content) load correctly instead of being aborted.
        const rangeHeader = request.headers.range;
        if (rangeHeader) {
            const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
            if (match) {
                const start = match[1] ? Number.parseInt(match[1], 10) : 0;
                const end = match[2] ? Number.parseInt(match[2], 10) : body.length - 1;
                if (start <= end && end < body.length) {
                    response.writeHead(206, {
                        "content-type": contentType,
                        "content-range": `bytes ${start}-${end}/${body.length}`,
                        "accept-ranges": "bytes",
                        "content-length": end - start + 1,
                    });
                    response.end(body.subarray(start, end + 1));
                    return;
                }
            }
        }

        response.writeHead(200, {
            "content-type": contentType,
            "accept-ranges": "bytes",
            "content-length": body.length,
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
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--use-gl=swiftshader"] });
const failures = [];

async function waitForDemoReady(page, timeoutMs) {
    await page.waitForFunction(() => Boolean(window.__babylonDemoReady), null, { timeout: timeoutMs });
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
            await waitForDemoReady(page, timeoutMs);

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

console.log(`Smoke checked ${demos.length} compiled demo${demos.length === 1 ? "" : "s"}.`);
