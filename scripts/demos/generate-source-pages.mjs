import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const sourceRoot = path.resolve(repoRoot, process.env.DEMOS_SOURCE_ROOT || "src/compiledDemos");
const outputRoot = process.env.DEMOS_OUTPUT_ROOT || "Demos";
const buildRoot = path.join(repoRoot, "build", outputRoot);
const manifestPath = path.resolve(repoRoot, process.env.DEMOS_MANIFEST_PATH || path.join(sourceRoot, "manifest.json"));
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const escapeHtml = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const renderSourcePage = (demo, files) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(demo.title)} source</title>
    <style>
        :root {
            color-scheme: dark;
            background: #111;
            color: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            margin: 0;
            padding: 24px;
        }

        header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 0 0 20px;
        }

        h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
        }

        a {
            color: #8bd6ff;
        }

        .back {
            min-height: 32px;
            padding: 7px 10px;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 4px;
            color: #fff;
            text-decoration: none;
        }

        section {
            margin: 0 0 24px;
        }

        h2 {
            margin: 0;
            padding: 10px 12px;
            border: 1px solid #333;
            border-bottom: 0;
            border-radius: 6px 6px 0 0;
            background: #1c1c1c;
            font-size: 14px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 500;
        }

        pre {
            margin: 0;
            padding: 16px;
            border: 1px solid #333;
            border-radius: 0 0 6px 6px;
            overflow: auto;
            background: #080808;
            line-height: 1.45;
        }

        code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <header>
        <h1>${escapeHtml(demo.title)} source</h1>
        <a class="back" href="../">Back to demo</a>
    </header>
    ${files
        .map(
            (file) => `<section>
        <h2>${escapeHtml(file.path)}</h2>
        <pre><code>${escapeHtml(file.contents)}</code></pre>
    </section>`
        )
        .join("\n")}
</body>
</html>
`;

for (const demo of manifest.demos) {
    const sourceFiles = demo.sourceFiles || ["main.ts", "scene.ts"];
    const files = [];

    for (const sourceFile of sourceFiles) {
        const filePath = path.normalize(path.join(sourceRoot, demo.slug, sourceFile));
        const demoRoot = path.join(sourceRoot, demo.slug);

        if (!filePath.startsWith(demoRoot)) {
            throw new Error(`Source file ${sourceFile} escapes ${demo.slug}.`);
        }

        files.push({
            path: sourceFile,
            contents: await fs.readFile(filePath, "utf8"),
        });
    }

    const sourceOutDir = path.join(buildRoot, demo.slug, "source");
    await fs.mkdir(sourceOutDir, { recursive: true });
    await fs.writeFile(path.join(sourceOutDir, "index.html"), renderSourcePage(demo, files));
}

console.log(
    `Generated source pages for ${manifest.demos.length} compiled demo${manifest.demos.length === 1 ? "" : "s"}.`
);
