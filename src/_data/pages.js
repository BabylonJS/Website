const fs = require("fs");
const path = require("path");

const contentRoot = path.join(__dirname, "..", "content");

function parseJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getPageConfig(rootPath, pageConfig) {
  const res = { ...pageConfig };
  if (pageConfig && pageConfig.root) {
    const configPath = path.join(rootPath, pageConfig.root, "config.json");
    if (fs.existsSync(configPath)) {
      const config = parseJson(configPath);
      Object.assign(res, config);
    }
    res.absoluteRoot = path.join(rootPath, pageConfig.root);
  }
  return res;
}

module.exports = function () {
  const siteConfig = parseJson(path.join(contentRoot, "site.json"));
  const pages = [];

  // Build the global menu (visible items)
  const globalMenu = [];

  siteConfig.menu.forEach(function (menuItem) {
    const pageConfig = getPageConfig(contentRoot, menuItem);
    if (pageConfig.children) {
      for (let i = 0; i < pageConfig.children.length; i++) {
        pageConfig.children[i] = getPageConfig(
          path.join(contentRoot, menuItem.root),
          pageConfig.children[i]
        );
      }
    }
    if (pageConfig.visible) {
      if (pageConfig.absoluteRoot) globalMenu.push(pageConfig);
    }
    // Mutate back for page rendering
    menuItem._resolved = pageConfig;
  });

  const globalConfig = {
    menu: globalMenu,
    socials: siteConfig.socials,
    footerMenu: siteConfig.footerMenu,
    downloadLink: siteConfig.downloadLink,
  };

  // Home page
  const homeConfig = getPageConfig(contentRoot, siteConfig.home);
  pages.push({
    url: "",
    pageConfig: homeConfig,
    ...globalConfig,
  });

  // All menu pages
  siteConfig.menu.forEach(function (menuItem) {
    const pageConfig = menuItem._resolved || getPageConfig(contentRoot, menuItem);
    if (pageConfig.menuUrl && pageConfig.menuUrl.startsWith("http")) return;
    if (!pageConfig.absoluteRoot) return;

    const url = pageConfig.absoluteRoot
      .replace(contentRoot + path.sep, "")
      .replace(contentRoot + "/", "")
      .replace(contentRoot, "");

    pages.push({
      url: url,
      pageConfig: pageConfig,
      ...globalConfig,
    });

    if (pageConfig.children) {
      for (let i = 0; i < pageConfig.children.length; i++) {
        const child = pageConfig.children[i];
        if (child.menuUrl) continue; // external link child
        if (!child.absoluteRoot) continue;

        const childUrl = child.absoluteRoot
          .replace(contentRoot + path.sep, "")
          .replace(contentRoot + "/", "")
          .replace(contentRoot, "");

        pages.push({
          url: childUrl,
          pageConfig: child,
          ...globalConfig,
        });
      }
    }
  });

  return pages;
};
