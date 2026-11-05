const fs = require("fs");
const path = require("path");

// Compiled ES6 demos served at /Demos/<slug>/ (built by `npm run demos:build`).
module.exports = function () {
    const manifestPath = path.join(__dirname, "..", "compiledDemos", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const demos = Array.isArray(manifest) ? manifest : manifest.demos || [];
    return demos.map((demo) => ({
        slug: demo.slug,
        title: demo.title,
        path: `/Demos/${demo.slug}/`,
    }));
};
