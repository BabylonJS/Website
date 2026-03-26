# Babylon.js website

## Installation process

``` sh
    npm install -g gulp
    npm install
```

## Development mode

Web site will be available at http://localhost:8080/

``` sh
    gulp run
```

## Updating the Website

This repository uses GitHub Copilot skills (`.github/skills/`) and helper scripts to automate content updates across the site. The blog post at `.github/blog_post/BlogPost.md` is the single source of truth for all feature content — every skill reads from it. See [.github/INSTRUCTIONS.md](.github/INSTRUCTIONS.md) for detailed workflow documentation.

### Prerequisites

Before running any update, make sure the blog post is in place:

1. Save the release blog post markdown to `.github/blog_post/BlogPost.md`.
2. For homepage updates, save feature images to `.github/raw_images/` and run `npm run process-images`.

### What You Can Update with Copilot

| Page | What to say | What happens |
|------|-------------|--------------|
| **Homepage** | "Update the homepage with new features" | Creates `imageAndTextBlock` entries in `src/content/config.json` with images, colors, descriptions, and links from the blog post. |
| **Specifications** | "Update the specifications page from the blog post" | Adds feature names and doc links to the ENGINE SPECIFICATIONS sections in `src/content/specifications/config.json`. Detects duplicates and checks column balance. |
| **Feature Demos** | "Add blog post demos to feature demos" | Adds demo entries to the gallery in `src/content/featureDemos/config.json`. Uses a two-pass workflow (see below). |
| **Alt Text** | "Add alt tags to the feature demos page" | Generates descriptive alt text for any config JSON file with image references. Works on any page. |

### How to Invoke a Skill

Open GitHub Copilot Chat and type a natural language prompt. You don't need to reference skill files — Copilot matches your request to the right skill automatically. Examples:

- "Update the specifications page with the new features from the blog post"
- "Add the new demos to the feature demos page"
- "Add alt tags to the main page"
- "Update alt text on the community page"

Each skill will read the blog post, compare against existing content, and present a plan before making changes. You confirm before anything is written.

### Homepage Updates

The homepage skill handles the most complex update — converting blog post features into visual content blocks with images, background colors, descriptions, and links.

**Process:**

1. Place feature images in `.github/raw_images/` (named to match the blog post image references).
2. Run `npm run process-images` to resize, optimize, and sample background colors. Colors are written to `.github/image-colors.json`.
3. Ask Copilot: "Update the homepage with new features from the blog post."
4. The skill creates `imageAndTextBlock` entries with alternating alignment, sampled background colors, condensed descriptions, and doc links.
5. Run `npm start` to preview at http://localhost:8080.

**To update a single image later:**

1. Place the updated image in `.github/raw_images/` with an `_updated` suffix (e.g., `particleFMAT_updated.png`).
2. Run `npm run update-image -- particleFMAT`.
3. Update the `background` hex color in `src/content/config.json` with the value printed by the script.

### Specifications Updates

Ask Copilot: "Update the specifications page from the blog post."

The skill extracts feature names and documentation links, then places each feature in the best-matching section (Main Features, Shaders/Rendering, Geometry, Optimizations, Special FX, Cameras, or Exporters and Tooling). It flags potential duplicates with existing entries and asks how to handle them. After adding all features, it checks whether the left and right columns are balanced and suggests moving whole sections if needed.

### Feature Demos Updates (Two-Pass Workflow)

Automated screenshot capture of WebGL Playground demos is extremely resource-intensive (headless Chromium rendering full 3D scenes). Instead, the feature demos skill uses a **manual screenshot workflow**:

**Pass 1 — Create entries with placeholders:**

1. Ask Copilot: "Add blog post demos to feature demos."
2. The skill identifies non-Playground demo links (e.g., the Babylon.js Editor or Viewer Configurator) and asks whether to skip them.
3. It creates all config entries with placeholder image paths and temporary alt text, then outputs a table of **camelCase filenames** you need to provide (e.g., `clusteredLighting.jpg`, `frameGraph.jpg`, `sdfText.jpg`).

**Between passes — Capture screenshots manually:**

4. Visit each demo link from the blog post and take a screenshot.
5. Save each screenshot to `src/content/featureDemos/assets/img/` using the exact filename from the table.

**Pass 2 — Generate alt text:**

6. Ask Copilot: "Add alt tags to the feature demos page."
7. The alt text skill views each image and writes descriptive alt text based on what the screenshot actually shows.

### Alt Text Generation

The alt text skill works on **any page** — not just the homepage. Ask Copilot to add or fix alt tags on any page, and it will find images with missing, empty, or placeholder alt text, view each image file, and write descriptive text.

Examples:
- "Add alt tags to the main page"
- "Fix alt tags on the feature demos page"
- "Update alt text on the community page"

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Process all images | `npm run process-images` | Resize, optimize, and sample background colors for all feature images |
| Update single image | `npm run update-image -- <name>` | Process one updated image on demand |

### .github/ Structure

```
.github/
├── INSTRUCTIONS.md          # Full workflow documentation
├── image-colors.json        # Generated background colors
├── blog_post/
│   └── BlogPost.md          # Blog post content (ground truth)
├── raw_images/              # Source images for homepage
├── scripts/
│   ├── process-images.js    # Batch image processor
│   └── update-image.js      # Single image updater
└── skills/
    ├── homepage-update.prompt.md       # Homepage feature blocks
    ├── blog-text-conversion.prompt.md  # Text conversion rules
    ├── specifications-update.prompt.md # Specifications page entries
    ├── feature-demos-update.prompt.md  # Feature demos gallery
    └── homepage-alt-text.prompt.md     # Image alt text (any page)
```

## Additional options for the page

### Page title

this property available as part of page level Json property

``` sh
    "title": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
```

### Meta tags

meta tags can be unique for each page. This property available as part of page level Json property and contains list of tags

``` json
    "metaTags": [
    {
      "name": "description",
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    },
    {
      "property": "og:title", //optional property for open graph
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    }
  ]
```

