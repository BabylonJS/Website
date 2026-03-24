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

## AI-Assisted Content Workflow

This repository includes automated tooling in `.github/` for updating the homepage with new Babylon.js release features. See [.github/INSTRUCTIONS.md](.github/INSTRUCTIONS.md) for full details.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Process all images | `npm run process-images` | Resize, optimize, and sample background colors for all feature images |
| Update single image | `npm run update-image -- <name>` | Process one updated image on demand |

### Quick Start: Updating a Feature Image

1. Place your updated image in `.github/raw_images/` with an `_updated` suffix (e.g., `particleFMAT_updated.png`)
2. Run `npm run update-image -- particleFMAT`
3. Update the `background` hex color in `src/content/config.json` with the value printed by the script

### Quick Start: Full Release Update

When a new version of Babylon.js is released, the marketing team publishes a blog post with all the new features. To update the homepage:

1. **Blog post**: Save the blog post markdown to `.github/blog_post/BlogPost.md`. This is the ground truth for all feature titles, descriptions, and links used in `config.json`.
2. **Images**: Save all feature images from the blog post into `.github/raw_images/`. These are the raw, unprocessed screenshots — the naming should match the image references in the blog post (e.g., `clusteredLights.png`, `NPE.png`). See the filename mapping table in [.github/INSTRUCTIONS.md](.github/INSTRUCTIONS.md) for how source names map to output names.
3. Run `npm run process-images` to batch resize, optimize, and sample background colors for all images.
4. Update `src/content/config.json` with new `imageAndTextBlock` entries using the generated colors from `.github/image-colors.json`.
5. Run `npm start` to preview at http://localhost:8080

### .github/ Structure

```
.github/
├── INSTRUCTIONS.md          # Full workflow documentation
├── image-colors.json        # Generated background colors
├── blog_post/
│   └── BlogPost.md          # Blog post content (ground truth)
├── raw_images/              # Source images
├── scripts/
│   ├── process-images.js    # Batch processor
│   └── update-image.js      # Single image updater
└── skills/
    ├── homepage-update.prompt.md      # Copilot skill for homepage updates
    └── blog-text-conversion.prompt.md # Copilot skill for text conversion rules
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

