const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const seo = require("./seo");

const contentRoot = path.join(__dirname, "..", "content");

// Blocks that already render the page's <h1>.
const H1_BLOCKS = new Set(["topBlock", "miniTopBlock", "twoColumns"]);
// Meta tags rendered by the shared SEO head; per-page duplicates are dropped.
const RESERVED_META = new Set([
  "description",
  "robots",
  "og:title",
  "og:description",
  "og:url",
  "og:image",
  "og:image:alt",
  "og:type",
  "og:site_name",
  "og:locale",
  "twitter:card",
  "twitter:site",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
  "twitter:url",
]);

function parseJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Last commit date (YYYY-MM-DD) touching a page's content, for sitemap <lastmod>.
function gitLastModified(contentPath) {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", contentPath],
      { cwd: contentRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return iso ? iso.slice(0, 10) : undefined;
  } catch {
    return undefined;
  }
}

function absoluteUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url;
  return seo.siteUrl + (url.startsWith("/") ? url : `/${url}`);
}

function buildPageSeo(page, socials) {
  const config = page.pageConfig || {};
  const blocks = config.blocks || [];
  const metaTags = (config.metaTags || []).filter((m) => m && m.content);
  const findMeta = (key) =>
    metaTags.find((m) => m.name === key || m.property === key);

  const isHome = page.url === "";
  const url = seo.siteUrl + (isHome ? "/" : `/${page.url}/`);
  const title = String(config.title || seo.defaultTitle).trim();
  const descriptionMeta = findMeta("description") || findMeta("og:description");
  const description = stripHtml(
    config.description ||
      (descriptionMeta && descriptionMeta.content) ||
      seo.defaultDescription
  );
  const image = absoluteUrl(config.socialImage || seo.defaultImage);
  const imageAlt = config.socialImageAlt || "Babylon.js logo";
  const indexable = !config.noindex && blocks.length > 0;
  const hasH1 =
    config.layout === "litePartners.njk" ||
    blocks.some(
      (b) => H1_BLOCKS.has(b.templateName) && b.content && b.content.title
    );

  const extraMeta = metaTags
    .filter((m) => !RESERVED_META.has(m.name) && !RESERVED_META.has(m.property))
    .map((m) =>
      m.property
        ? { attr: "property", key: m.property, content: m.content }
        : { attr: "name", key: m.name, content: m.content }
    )
    .filter((m) => m.key);

  const faq = [];
  for (const block of blocks) {
    if (block.templateName !== "faqBlock") continue;
    for (const item of (block.content && block.content.items) || []) {
      const question = stripHtml(item.question);
      const answer = stripHtml(item.answer);
      if (question && answer) faq.push({ question, answer });
    }
  }

  const orgId = `${seo.siteUrl}/#organization`;
  const siteId = `${seo.siteUrl}/#website`;
  const softwareId = `${seo.siteUrl}/#software`;
  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: seo.siteName,
      url: `${seo.siteUrl}/`,
      logo: absoluteUrl(seo.logo),
      parentOrganization: {
        "@type": "Organization",
        name: "Microsoft",
        url: "https://www.microsoft.com/",
      },
      sameAs: (socials || [])
        .map((s) => s.link)
        .filter((link) => link && !link.includes("netlify.com")),
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: `${seo.siteUrl}/`,
      name: seo.siteName,
      description: seo.defaultDescription,
      publisher: { "@id": orgId },
      inLanguage: "en",
    },
    {
      "@type": faq.length ? "FAQPage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { "@id": siteId },
      about: isHome ? { "@id": softwareId } : undefined,
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      breadcrumb: isHome ? undefined : { "@id": `${url}#breadcrumb` },
      inLanguage: "en",
      mainEntity: faq.length
        ? faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          }))
        : undefined,
    },
  ];

  if (isHome) {
    graph.push({
      "@type": "SoftwareSourceCode",
      "@id": softwareId,
      name: "Babylon.js",
      description: seo.defaultDescription,
      url: `${seo.siteUrl}/`,
      codeRepository: seo.repository,
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: ["Web browser", "WebGL", "WebGPU"],
      license: seo.license,
      author: { "@id": orgId },
      sameAs: [
        seo.repository,
        seo.docsUrl,
        "https://www.npmjs.com/package/@babylonjs/core",
      ],
    });
  } else {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: seo.siteName,
          item: `${seo.siteUrl}/`,
        },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
  }

  return {
    url,
    title,
    description,
    image,
    imageAlt,
    indexable,
    robots: indexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, follow",
    lastModified: gitLastModified(
      isHome ? path.join(contentRoot, "config.json") : config.absoluteRoot || contentRoot
    ),
    hasH1,
    heading: config.heading || title,
    extraMeta,
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  };
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

  for (const page of pages) {
    page.seo = buildPageSeo(page, siteConfig.socials);
  }

  return pages;
};
