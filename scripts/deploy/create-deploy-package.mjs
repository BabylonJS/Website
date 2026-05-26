#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultBuildDir = resolve(repoRoot, "build");
const defaultOutput = resolve(repoRoot, "deploy.zip");

const args = parseArgs(process.argv.slice(2));
const buildDir = resolve(repoRoot, args["build-dir"] ?? defaultBuildDir);
const manifestPath = resolve(repoRoot, args.manifest ?? "deploy-package-manifest.json");
const outputPath = resolve(repoRoot, args.out ?? defaultOutput);
const includeAssets =
    args["include-assets"] ?? args["include-static"] ?? process.env.DEPLOY_INCLUDE_ASSETS ?? "changed";
const baseRef = args.base ?? process.env.DEPLOY_BASE_REF ?? findDefaultBaseRef();

if (!["all", "changed", "none"].includes(includeAssets)) {
    fail(`Invalid --include-assets value: ${includeAssets}. Expected all, changed, or none.`);
}

if (!existsSync(buildDir)) {
    fail(`Build directory does not exist: ${buildDir}`);
}

const compiledDemoSlugs = readCompiledDemoSlugs();
const buildFiles = await listFiles(buildDir);
const passthroughOutputs = await collectPassthroughOutputs();
const changedAssetPaths =
    includeAssets === "all"
        ? new Set(passthroughOutputs.keys())
        : includeAssets === "none"
          ? new Set()
          : getChangedAssetOutputPaths(baseRef);
const unsupportedDeletes = includeAssets === "changed" ? getDeletedAssetOutputPaths(baseRef) : [];

const includedFiles = [];
const skippedAssetFiles = [];

for (const file of buildFiles) {
    const copiedFromPassthrough = passthroughOutputs.has(file) && !isCompiledDemoOutput(file, compiledDemoSlugs);
    if (copiedFromPassthrough && !changedAssetPaths.has(file)) {
        skippedAssetFiles.push(file);
        continue;
    }

    includedFiles.push(file);
}

writeFileSync(
    manifestPath,
    `${JSON.stringify(
        {
            baseRef: baseRef || null,
            buildDir: toPosix(relative(repoRoot, buildDir)),
            includeAssets,
            output: toPosix(relative(repoRoot, outputPath)),
            includedFileCount: includedFiles.length,
            skippedAssetFileCount: skippedAssetFiles.length,
            changedAssetFileCount: changedAssetPaths.size,
            unsupportedDeletedAssetFiles: unsupportedDeletes,
            includedFiles,
            skippedAssetFiles,
        },
        null,
        2
    )}\n`
);

if (includedFiles.length === 0) {
    writeAzureVariable("deployPackageHasFiles", "false");
    console.log("No files need to be uploaded.");
    process.exit(0);
}

createZip(outputPath, buildDir, includedFiles);
const sizeBytes = statSync(outputPath).size;
writeAzureVariable("deployPackageHasFiles", "true");
writeAzureVariable("deployPackagePath", outputPath);
writeAzureVariable("deployPackageFileCount", String(includedFiles.length));
console.log(
    `Created ${toPosix(relative(repoRoot, outputPath))} with ${includedFiles.length} files (${sizeBytes} bytes).`
);
console.log(`Skipped ${skippedAssetFiles.length} unchanged passthrough asset files.`);

if (unsupportedDeletes.length > 0) {
    console.warn("Passthrough asset deletions were detected, but the zip upload endpoint cannot remove files:");
    unsupportedDeletes.forEach((file) => console.warn(`- ${file}`));
}

function parseArgs(values) {
    const result = {};
    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        if (!value.startsWith("--")) {
            fail(`Unexpected argument: ${value}`);
        }

        const key = value.slice(2);
        const next = values[index + 1];
        if (!next || next.startsWith("--")) {
            result[key] = "true";
        } else {
            result[key] = next;
            index++;
        }
    }

    return result;
}

async function listFiles(root) {
    const files = [];
    await walk(root, "", files);
    return files.sort();
}

async function walk(root, current, files) {
    const dir = join(root, current);
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const relativePath = current ? `${current}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            await walk(root, relativePath, files);
        } else if (entry.isFile()) {
            files.push(toPosix(relativePath));
        }
    }
}

function readCompiledDemoSlugs() {
    const manifestFile = join(repoRoot, "src/compiledDemos/manifest.json");
    if (!existsSync(manifestFile)) {
        return new Set();
    }

    const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
    return new Set((manifest.demos ?? []).map((demo) => demo.slug));
}

function isCompiledDemoOutput(file, slugs) {
    if (file.startsWith("Demos/_compiled/")) {
        return true;
    }

    for (const slug of slugs) {
        if (file === `Demos/${slug}/index.html` || file === `Demos/${slug}/source/index.html`) {
            return true;
        }
    }

    return false;
}

async function collectPassthroughOutputs() {
    const outputs = new Map();
    await addPassthroughDirectory(outputs, "static", "");
    await addPassthroughDirectory(outputs, "src/assets", "assets");
    await addContentAssetOutputs(outputs);
    return outputs;
}

async function addPassthroughDirectory(outputs, sourceRoot, outputRoot) {
    const absoluteSourceRoot = resolve(repoRoot, sourceRoot);
    if (!existsSync(absoluteSourceRoot)) {
        return;
    }

    for (const file of await listFiles(absoluteSourceRoot)) {
        const outputPath = outputRoot ? `${outputRoot}/${file}` : file;
        addPassthroughOutput(outputs, outputPath, `${sourceRoot}/${file}`);
    }
}

async function addContentAssetOutputs(outputs) {
    const contentRoot = resolve(repoRoot, "src/content");
    if (!existsSync(contentRoot)) {
        return;
    }

    for (const sourceFile of await listFiles(contentRoot)) {
        const segments = sourceFile.split("/");
        const assetIndex = segments.indexOf("assets");
        if (assetIndex === -1) {
            continue;
        }

        const pageSegments = segments.slice(0, assetIndex);
        const assetSegments = segments.slice(assetIndex + 1);
        const outputPath =
            pageSegments.length === 0
                ? `assets/${assetSegments.join("/")}`
                : `${pageSegments.join("/")}/assets/${assetSegments.join("/")}`;
        addPassthroughOutput(outputs, outputPath, `src/content/${sourceFile}`);
    }
}

function addPassthroughOutput(outputs, outputPath, sourcePath) {
    const normalizedOutput = toPosix(outputPath);
    const sources = outputs.get(normalizedOutput) ?? [];
    sources.push(toPosix(sourcePath));
    outputs.set(normalizedOutput, sources);
}

function findDefaultBaseRef() {
    const candidates = ["HEAD^1", "HEAD~1"];
    for (const candidate of candidates) {
        const result = runGit(["rev-parse", "--verify", candidate], { allowFailure: true });
        if (result.status === 0) {
            return candidate;
        }
    }

    return "";
}

function getChangedAssetOutputPaths(base) {
    if (!base) {
        return new Set(passthroughOutputs.keys());
    }

    const result = runAssetDiff(base);
    if (result.status !== 0) {
        console.warn(`Unable to diff passthrough assets from ${base}; including all passthrough assets.`);
        return new Set(passthroughOutputs.keys());
    }

    const paths = new Set();
    for (const line of result.stdout.trim().split("\n")) {
        if (!line) {
            continue;
        }

        const columns = line.split("\t");
        const status = columns[0];
        const sourcePath = status.startsWith("R") ? columns[2] : columns[1];
        if (!sourcePath || status.startsWith("D")) {
            continue;
        }

        const buildPath = outputPathFromSourcePath(sourcePath);
        if (buildPath && existsSync(join(buildDir, buildPath))) {
            paths.add(toPosix(buildPath));
        }
    }

    return paths;
}

function getDeletedAssetOutputPaths(base) {
    if (!base) {
        return [];
    }

    const result = runAssetDiff(base);
    if (result.status !== 0) {
        return [];
    }

    return result.stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => line.split("\t"))
        .filter(([status]) => status.startsWith("D"))
        .map(([, file]) => outputPathFromSourcePath(file))
        .filter(Boolean)
        .map(toPosix);
}

function runAssetDiff(base) {
    return runGit(
        ["diff", "--name-status", "--find-renames", base, "HEAD", "--", "static", "src/assets", "src/content"],
        { allowFailure: true }
    );
}

function outputPathFromSourcePath(sourcePath) {
    const normalized = toPosix(sourcePath);
    if (normalized.startsWith("static/")) {
        return normalized.replace(/^static\//, "");
    }

    if (normalized.startsWith("src/assets/")) {
        return normalized.replace(/^src\//, "");
    }

    if (!normalized.startsWith("src/content/")) {
        return null;
    }

    const contentPath = normalized.replace(/^src\/content\//, "");
    const segments = contentPath.split("/");
    const assetIndex = segments.indexOf("assets");
    if (assetIndex === -1) {
        return null;
    }

    const pageSegments = segments.slice(0, assetIndex);
    const assetSegments = segments.slice(assetIndex + 1);
    return pageSegments.length === 0
        ? `assets/${assetSegments.join("/")}`
        : `${pageSegments.join("/")}/assets/${assetSegments.join("/")}`;
}

function createZip(output, cwd, files) {
    const tempRoot = mkdtempSync(join(tmpdir(), "website-deploy-"));
    const fileList = join(tempRoot, "files.txt");
    writeFileSync(fileList, `${files.join("\n")}\n`);
    rmSync(output, { force: true });

    const result = spawnSync("zip", ["-q", "--symlinks", output, "-@"], {
        cwd,
        input: readFileSync(fileList),
        stdio: ["pipe", "inherit", "inherit"],
    });

    rmSync(tempRoot, { recursive: true, force: true });

    if (result.status !== 0) {
        fail(`zip failed with exit code ${result.status ?? "unknown"}`);
    }
}

function runGit(args, options = {}) {
    const result = spawnSync("git", args, {
        cwd: repoRoot,
        encoding: "utf8",
    });

    if (!options.allowFailure && result.status !== 0) {
        fail(result.stderr || `git ${args.join(" ")} failed`);
    }

    return result;
}

function writeAzureVariable(name, value) {
    console.log(`##vso[task.setvariable variable=${name}]${value}`);
}

function toPosix(value) {
    return value.split(sep).join("/");
}

function fail(message) {
    console.error(message);
    process.exit(1);
}
