# Website Content Update Instructions

This document explains the workflow for updating the Babylon.js website homepage with new feature releases.

## Overview

The homepage features are driven by `src/content/config.json`, which contains an array of `imageAndTextBlock` objects. Each block represents a feature with an image, title, description, and documentation link.

## Workflow for Updating Homepage Features

### 1. Prepare Blog Post Content

When a new Babylon.js release is announced, the marketing team will publish a blog post on Medium with all the new features.

**Location for blog content:** `.github/blog_post/BlogPost.md`

Extract the feature information from the blog post including:
- Feature name/title
- Feature description (full version)
- Demo link (usually aka.ms links)
- Documentation link

### 2. Collect Feature Images

Images for each feature should be placed in:
```
.github/raw_images/
```

**Image naming convention** (from source in blog):
- `clusteredLights.png` → Clustered Lighting
- `texturedAreaLights.png` → Textured Area Lights  
- `NPE.png` → Node Particle Editor
- `particleFMAT.png` → Particle Flow Maps
- etc.

See the current image mapping in `.github/scripts/process-images.js` for the full list.

### 3. Process Images

The image processing script will:
- Resize all images to 550px wide (maintaining aspect ratio)
- Optimize as PNG with maximum compression for web
- Sample edge colors for background hex values
- Copy to `src/assets/img/` with standardized names
- Generate `image-colors.json` with sampled colors

**Run the script:**
```bash
npm run process-images
```

Or directly:
```bash
node .github/scripts/process-images.js
```

**Output includes:**
- Progress for each image
- File sizes in KB
- Sampled background colors
- Summary with total images processed

The script saves background colors to `.github/image-colors.json` for easy reference.

### 3b. Update a Single Image

When you need to update an individual image (e.g., better crop, new background), use the single-image update workflow:

1. Place the updated image in `.github/raw_images/` with an `_updated` suffix:
   - Example: `particleFMAT_updated.png` to update the Particle Flow Maps image
   - The base name must match an existing entry in the image mapping table

2. Run the update script:
```bash
npm run update-image -- <baseName>
```

Example:
```bash
npm run update-image -- particleFMAT
```

Or directly:
```bash
node .github/scripts/update-image.js particleFMAT
```

**What the script does:**
- Finds `<baseName>_updated.png` in `.github/raw_images/`
- Resizes to 550px wide, optimizes as PNG
- Samples the new edge color for the background
- Copies to `src/assets/img/` with the standardized output name
- Updates `.github/image-colors.json` with the new color
- **Preserves both the original and `_updated` files** in `raw_images/`

> **IMPORTANT: Never delete files from `.github/raw_images/`.** This folder is the archive of all original and updated images. The `_updated` suffix convention lets us track which images have been reworked while keeping the originals intact.

**After running**, update the `background` color in `config.json` for that feature's `imageAndTextBlock` to the new hex value printed by the script.

### 4. Update config.json

Open `src/content/config.json` and update the `imageAndTextBlock` entries.

**Template for each feature:**
```json
{
    "templateName": "imageAndTextBlock",
    "content": {
        "alignment": "right",  // Alternate: right, left, right, left...
        "background": "#5f655b",  // Use sampled color from image-colors.json
        "img": {
            "url": "assets/img/clusteredLighting.png",  // Matches output filename
            "alt": "Description of what the image shows",
            "width": "550px"
        },
        "height": "450px",  // Adjust based on text length (400-500px typical)
        "paddingTop": "40px",
        "paddingBottom": "40px",
        "marginLeft": "50px",
        "marginRight": "50px",
        "title": "Clustered Lighting",  // From blog post
        "desc": "Shortened description...",  // Condense blog description
        "moreInfoLink": "https://aka.ms/babylon9CLDoc",  // From blog post
        "moreInfoText": "Learn more about Clustered Lighting in Babylon.js",
        "target": "_blank"
    }
}
```

**Key points:**
- **Alignment**: Alternate `right` and `left` for visual variety
- **Background**: Use hex color from `image-colors.json` or manually sample
- **Height**: Estimate based on description length (compare to similar blocks)
- **Description**: Condense from blog post to ~2-3 sentences, keeping key points
- **Order**: Features should appear in the same order as the blog post

### 5. Update Welcome Text

Update the main welcome textBlock from version X.0 to Y.0:

```json
{
    "templateName": "textBlock",
    "content": {
        "marginLeft": "50px",
        "marginRight": "50px",
        "title": "Welcome to Babylon.js 9.0",  // Update version
        "desc": "Our mission is to build..."  // Usually stays the same
    }
}
```

### 6. Build and Test

After updating config.json:

```bash
npm start
```

This runs `gulp run` which:
1. Builds the site from templates
2. Starts a local server at http://localhost:8080  
3. Enables live reload for changes

Navigate to http://localhost:8080 to preview your changes.

## Directory Structure

```
.github/
├── scripts/
│   ├── process-images.js      # Batch image processing
│   └── update-image.js        # Single image update
├── raw_images/                # Source images (place new images here)
│   ├── clusteredLights.png
│   ├── texturedAreaLights.png
│   └── ...
├── blog_post/
│   └── BlogPost.md            # Blog post content (ground truth)
├── image-colors.json          # Generated color samples (after processing)
├── image-results.txt          # Processing log output
└── INSTRUCTIONS.md            # This file

src/
└── content/
    └── config.json            # Homepage configuration

src/assets/img/                # Processed images (output)
```

## Troubleshooting

**"Cannot find module 'sharp'"**
- Run `npm install` to install all dependencies including sharp

**Images not processing**
- Verify images are in `.github/raw_images/`
- Check the filename mapping in `process-images.js`
- Ensure sharp is installed: `npm list sharp`

**Colors look wrong**
- The script samples from the right edge, middle height
- You can manually adjust colors in config.json
- Use a color picker tool from the image if needed

**Build errors**
- Validate config.json syntax (proper commas, brackets)
- Check that all image URLs match processed filenames
- Ensure all required fields are present in each block

## Quick Reference: Image Filename Mapping

| Source Filename | Output Filename | Feature |
|----------------|-----------------|---------|
| clusteredLights.png | clusteredLighting.png | Clustered Lighting |
| texturedAreaLights.png | texturedAreaLights.png | Textured Area Lights |
| NPE.png | nodeParticleEditor.png | Node Particle Editor |
| particleFMAT.png | particleFlowMaps.png | Particle Flow Maps |
| volumetricLighting.png | volumetricLighting.png | Volumetric Lighting |
| frameGraph.png | frameGraph.png | Frame Graph |
| animationRetargeting.png | animationRetargeting.png | Animation Retargeting |
| GaussianSplat.png | gaussianSplat.png | Advanced Gaussian Splat |
| editor.png | babylonEditor.png | Babylon.js Editor |
| inspectorV2.png | inspectorV2.png | Inspector v2 |
| viewer.png | viewerUpdates.png | Babylon Viewer Updates |
| playground.png | playgroundUpdates.png | Playground Updates |
| largeWorld.png | largeWorldRendering.png | Large World Rendering |
| geoSpatialCamera.png | geospatialCamera.png | Geospatial Camera |
| 3DTiles.png | 3dTiles.png | 3D Tiles Support |
| atmospheric.png | physicallyBasedAtmosphere.png | Physically Based Atmosphere |
| openPBR.png | openPBR.png | OpenPBR Support |
| IBLShadows.png | dynamicIBLShadows.png | Dynamic IBL Shadows |
| sdf.png | sdfText.png | SDF Text |
| outlineRenderer.png | outlineRenderer.png | Outline Renderer |
| navMesh.png | navMesh.png | Nav Mesh Updates |
| audio.png | audioEngine.png | Audio Engine Updates |
| 3mf.png | 3mfExporter.png | 3MF Exporter |

## Example Workflow

**Full release update:**
1. Marketing publishes Babylon.js 10.0 blog post
2. Copy blog content to `.github/blog_post/BlogPost.md`
3. Save feature images to `.github/raw_images/` (update mapping if needed)
4. Run `npm run process-images`
5. Open `src/content/config.json`
6. Update version number in welcome text
7. Replace imageAndTextBlock entries with new features:
   - Use `.github/image-colors.json` for background colors
   - Alternate alignments (right/left)
   - Shorten descriptions from blog
   - Add demo/doc links from blog
   - Write descriptive alt text
8. Run `npm start` to test locally
9. Commit changes to repository

**Single image update:**
1. Place updated image as `<baseName>_updated.png` in `.github/raw_images/`
2. Run `npm run update-image -- <baseName>`
3. Update the `background` color in `config.json` for that feature
4. Run `npm start` to verify

---

## Updating the Specifications Page

The specifications page at `src/content/specifications/config.json` lists all Babylon.js engine features organized by category. When a new release ships, new features from the blog post need to be added to this page.

### How to Invoke

Ask the agent to update specifications using prompts like:

- "Update the specifications page with the new features from the blog post"
- "Add the new blog post features to the specifications config"
- "Update specs from the blog post"

The agent will use the **specifications-update** skill (`.github/skills/specifications-update.prompt.md`) to handle this automatically.

### What the Skill Does

1. **Reads** `.github/blog_post/BlogPost.md` and extracts feature headings and documentation links.
2. **Reads** `src/content/specifications/config.json` and parses the ENGINE SPECIFICATIONS `twoColumns` block.
3. **Maps each feature** to the appropriate section (MAIN FEATURES, SHADERS / RENDERING, GEOMETRY, OPTIMIZATIONS, SPECIAL FX, CAMERAS, or EXPORTERS AND TOOLING).
4. **Checks for duplicates** — if an existing entry looks like it covers the same feature, the agent will show both entries and ask how to handle it before making changes.
5. **Reports the plan** — lists all proposed additions with target sections and placements, then waits for confirmation.
6. **Applies changes** to the config after user approval.
7. **Checks column balance** — if left and right columns become significantly uneven, suggests moving a whole section to rebalance.

### Key Rules

- **Additive only.** The skill never removes existing specification entries.
- **Duplicate detection.** Potential duplicates are flagged and the user decides how to resolve them.
- **Feature text comes from the blog heading.** No content is invented.
- **Links are used as-is from the blog post.** No URL modification.
- **Sections are never split between columns.** Only whole sections may move for rebalancing.

---

## Updating the Feature Demos Page

The feature demos page at `src/content/featureDemos/config.json` showcases interactive Babylon.js Playground demos. When a new release ships, demos from the blog post need to be added to this page with captured screenshots.

### How to Invoke

Ask the agent to update feature demos using prompts like:

- "Update the feature demos from the blog post"
- "Add the new demos to the feature demos page"
- "Add blog post demos to feature demos"

The agent will use the **feature-demos-update** skill (`.github/skills/feature-demos-update.prompt.md`) to handle this automatically.

### What the Skill Does

1. **Reads** `.github/blog_post/BlogPost.md` and extracts feature headings and "Check out a demo:" links.
2. **Reads** `src/content/featureDemos/config.json` to understand existing entries and check for duplicates.
3. **For each Playground demo**, uses Playwright to:
   - Navigate to the aka.ms demo link (which redirects to the Playground).
   - Modify the URL to insert `full.html` for preview-only mode (no code editor).
   - Resize the browser and capture a screenshot of the rendered scene.
   - Save the screenshot to `src/content/featureDemos/assets/img/`.
4. **Generates alt text** for each screenshot based on what the image actually shows.
5. **Reports the plan** to the user with all proposed entries, then waits for confirmation.
6. **Inserts new items** at the top of the `items` array in blog post order.

### Key Rules

- **Additive only.** Existing entries are never removed or reordered.
- **New entries go at the top** of the items array, in blog post order.
- **Short descriptions** — just a couple of words from the feature heading.
- **Demo links are used as-is** from the blog post (aka.ms links).
- **Screenshots are captured automatically** via Playwright for Playground demos.
- **Non-Playground demos** (editors, external tools) are flagged for the user to decide how to handle.

---

*This workflow was established for Babylon.js 9.0 release (March 2026)*
