const fs = require("fs");
const path = require("path");

const NAMED_ENTITIES = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    rsquo: "\u2019",
    lsquo: "\u2018",
    rdquo: "\u201d",
    ldquo: "\u201c",
    mdash: "\u2014",
    ndash: "\u2013",
    hellip: "\u2026",
    copy: "\u00a9",
    reg: "\u00ae",
    trade: "\u2122",
};

function decodeEntities(text) {
    return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
        if (entity[0] === "#") {
            const code =
                entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : match;
        }
        const named = NAMED_ENTITIES[entity.toLowerCase()];
        return named === undefined ? match : named;
    });
}

function inlineText(html) {
    return decodeEntities(html.replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function absolutize(href, pageUrl) {
    try {
        return new URL(decodeEntities(href), pageUrl).href;
    } catch {
        return href;
    }
}

// Extracts the main content of a generated page and converts it to lightweight Markdown.
function htmlToMarkdown(html, pageUrl) {
    let body = html;
    const container = body.indexOf('<div class="content-container">');
    if (container !== -1) {
        body = body.slice(container);
        const footer = body.indexOf('<footer class="footer">');
        if (footer !== -1) body = body.slice(0, footer);
    } else {
        const main = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        if (main) body = main[1];
    }

    return decodeEntities(
        body
            .replace(/<!--[\s\S]*?-->/g, "")
            // The fallback heading repeats the page title already emitted above.
            .replace(/<h1 class="visually-hidden">[\s\S]*?<\/h1>/gi, "")
            .replace(/<(script|style|svg|noscript|template|canvas|iframe|video|audio)\b[\s\S]*?<\/\1>/gi, "")
            .replace(/<a\b[^>]*?href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, href, inner) => {
                const text = inlineText(inner);
                if (!text) return "";
                if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
                    return text;
                }
                return `[${text}](${absolutize(href, pageUrl)})`;
            })
            .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (match, level, inner) => {
                const text = inlineText(inner);
                if (!text) return "";
                return `\n\n${Number(level) <= 2 ? "###" : "####"} ${text}\n\n`;
            })
            .replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, (match, inner) => `\n\n**${inlineText(inner)}**\n`)
            .replace(/<li\b[^>]*>/gi, "\n- ")
            .replace(/<(td|th)\b[^>]*>/gi, " | ")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(
                /<\/(p|div|section|article|header|ul|ol|tr|table|details|figure|figcaption|blockquote|pre)>/gi,
                "\n"
            )
            .replace(/<[^>]*>/g, " ")
    )
        .split("\n")
        .map((line) => line.replace(/[ \t\u00a0]+/g, " ").trim())
        .filter((line) => line !== "-" && !/^(\|\s*)+$/.test(line))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/**
 * Writes /llms-full.txt: the readable text of every indexable generated page,
 * so LLM crawlers and agents can ingest the whole site in one request.
 */
function writeLlmsFull({ outputDir, pages, seo }) {
    const sections = [];
    for (const page of pages) {
        if (!page.seo || !page.seo.indexable) continue;
        const htmlPath = path.join(outputDir, page.url, "index.html");
        if (!fs.existsSync(htmlPath)) continue;
        const markdown = htmlToMarkdown(fs.readFileSync(htmlPath, "utf8"), page.seo.url);
        sections.push(`## ${page.seo.title}\n\nURL: ${page.seo.url}\n\n> ${page.seo.description}\n\n${markdown}`);
    }

    const header = [
        `# ${seo.siteName} website: full content`,
        "",
        `> ${seo.defaultDescription}`,
        "",
        `This file contains the text of every page on ${seo.siteUrl}/ for LLMs and AI agents. ` +
            `For an index of links, see ${seo.siteUrl}/llms.txt. ` +
            `For engine documentation and API reference, see ${seo.docsUrl} and https://doc.babylonjs.com/llms.txt.`,
    ].join("\n");

    fs.writeFileSync(path.join(outputDir, "llms-full.txt"), `${header}\n\n${sections.join("\n\n---\n\n")}\n`);
}

module.exports = { htmlToMarkdown, writeLlmsFull };
