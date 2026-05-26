import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const demosRoot = path.join(repoRoot, "src/compiledDemos");
const manifestPath = path.join(demosRoot, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const input = Object.fromEntries(
    manifest.demos.map((demo) => [`${demo.slug}/index`, path.join(demosRoot, demo.slug, "index.html")])
);

export default defineConfig({
    root: demosRoot,
    base: "/Demos/",
    publicDir: false,
    build: {
        outDir: path.join(repoRoot, "build/Demos"),
        emptyOutDir: false,
        sourcemap: true,
        rollupOptions: {
            input,
            output: {
                entryFileNames: "_compiled/[name]-[hash].js",
                chunkFileNames: "_compiled/[name]-[hash].js",
                assetFileNames: "_compiled/[name]-[hash][extname]",
            },
        },
    },
});
