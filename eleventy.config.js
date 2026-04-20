const path = require("path");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  // ---- Watch targets ----
  eleventyConfig.addWatchTarget("src/content/");
  eleventyConfig.addWatchTarget("src/assets/");

  // ---- Passthrough copy: global assets ----
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // ---- Passthrough copy: static files (non-generated content) ----
  eleventyConfig.addPassthroughCopy({ "static": "." });

  // ---- Passthrough copy: per-page assets ----
  // Read site.json to discover all content sections that may have assets
  const siteJsonPath = path.join(__dirname, "src/content/site.json");
  const siteConfig = JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));

  const contentDirs = new Set();

  // Collect all root directories from menu items
  function collectRoots(items) {
    if (!items) return;
    for (const item of items) {
      if (item.root) {
        contentDirs.add(item.root);
        if (item.children) {
          for (const child of item.children) {
            if (child.root) {
              contentDirs.add(path.join(item.root, child.root));
            }
          }
        }
      }
    }
  }

  collectRoots(siteConfig.menu);

  // Also check for the home page root assets
  const homeAssetsPath = path.join(__dirname, "src/content/assets");
  if (fs.existsSync(homeAssetsPath)) {
    eleventyConfig.addPassthroughCopy({ "src/content/assets": "assets" });
  }

  for (const dir of contentDirs) {
    const assetsPath = path.join(__dirname, "src/content", dir, "assets");
    if (fs.existsSync(assetsPath)) {
      eleventyConfig.addPassthroughCopy({
        [`src/content/${dir}/assets`]: `${dir}/assets`,
      });
    }
  }

  // ---- Load site variables for the var filter ----
  const siteData = JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));
  const siteVariables = siteData.variables || {};

  // ---- Nunjucks: render block shortcode ----
  eleventyConfig.addShortcode("renderBlock", function (block) {
    const njk = require("nunjucks");
    const includesDir = path.join(__dirname, "src/_includes");
    const env = new njk.Environment(new njk.FileSystemLoader(includesDir), {
      autoescape: false,
    });
    // Register filters on this environment
    env.addFilter("var", function (key) {
      if (siteVariables[key]) return siteVariables[key];
      return key;
    });
    env.addFilter("json", function (obj) {
      return JSON.stringify(obj);
    });
    const templateFile = `blocks/${block.templateName}.njk`;
    // Pass block.content as context (matching original Handlebars behavior)
    // Also include block-level properties like delay for carousel
    const content = block.content || {};
    const context = { ...content, delay: block.delay };
    // Nunjucks can't access hyphenated keys as top-level variables (e.g. background-color),
    // so also provide the raw content object for bracket-notation access
    context._content = content;
    return env.render(templateFile, context);
  });

  // ---- Filters ----
  // json filter (Nunjucks has `dump` built-in, but this matches the Handlebars helper)
  eleventyConfig.addFilter("json", function (obj) {
    return JSON.stringify(obj);
  });

  // var filter: access site.variables
  eleventyConfig.addFilter("var", function (key) {
    const siteData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "src/content/site.json"),
        "utf8"
      )
    );
    if (siteData.variables && siteData.variables[key]) {
      return siteData.variables[key];
    }
    return key;
  });

  // ---- Config ----
  return {
    dir: {
      input: "src",
      output: "build",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
