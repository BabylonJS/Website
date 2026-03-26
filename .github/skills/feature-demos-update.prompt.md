---
description: >
  Update the Babylon.js feature demos page with new demos from a blog post.
  Extracts feature names and demo links from BlogPost.md, navigates to each
  Playground demo to capture a screenshot, generates alt text, and adds entries
  to the galleryBlock items in src/content/featureDemos/config.json.
  Triggers on: "update feature demos", "add demos to feature demos page",
  "add blog post demos", "feature demos from blog post".
---

# Feature Demos Update Skill

You are updating the Babylon.js feature demos page at `src/content/featureDemos/config.json` with demo entries extracted from `.github/blog_post/BlogPost.md`.

## When to Run

Run this skill when the user asks to add or update demos on the feature demos page from the blog post. Example prompts:

- "Update feature demos from the blog post"
- "Add the new demos to the feature demos page"
- "Add blog post demos to feature demos"
- "Update the feature demos config"

## Before Starting — Preflight Check

Check that the required files exist:

1. **Blog post**: `.github/blog_post/BlogPost.md` — source of feature names and demo links.
2. **Feature demos config**: `src/content/featureDemos/config.json` — the target file.
3. **Image output directory**: `src/content/featureDemos/assets/img/` — where captured screenshots are saved.

If the blog post is missing, say:
> "I need the blog post markdown at `.github/blog_post/BlogPost.md` before I can update the feature demos. Please place it there."

## How to Extract Demos from the Blog Post

Each feature in the blog post is a level-2 heading:

```
## **Feature Name**
```

Each feature section contains a demo link on a line formatted as:

```
Check out a demo: [url](url)
```

Use the heading (stripped of bold markers) as the source for the short description, and the demo URL as the `link` value.

### Features Without Playground Demos

Some features may link to external tools, editors, or non-Playground pages (e.g., the Babylon.js Editor, external websites). The screenshot capture workflow below only works for **Babylon.js Playground links** — URLs that, after following redirects, resolve to `playground.babylonjs.com`.

**How to detect non-Playground links:** After navigating to the aka.ms link, check if the final URL contains `playground.babylonjs.com`. If it does not, it is a non-Playground link.

**Before processing any demos**, collect all non-Playground links and present them to the user:

> The following demo links do not appear to be Babylon.js Playground links:
> - **Feature Name** → `https://aka.ms/...` → redirected to `https://example.com/...`
>
> These cannot be automatically screenshotted. Is it OK to skip them?

Almost all of the time the user will say yes. If the user says yes, skip those entries entirely.

If the user says **no** (they want the entry included), create the entry with a placeholder:
```json
{
    "desc": "Feature Name",
    "link": "https://aka.ms/...",
    "img": {
        "url": "/featureDemos/assets/img/PLACEHOLDER.jpg",
        "alt": "Placeholder — needs manual screenshot and alt text"
    }
}
```
Then instruct the user:
> Please provide a screenshot image for **Feature Name** and place it at `src/content/featureDemos/assets/img/<name>.jpg`. Once the image is in place, ask me to "add alt tags to the feature demos page" and I will generate proper alt text using the alt text skill.

## Target File and Structure

**Feature demos config**: `src/content/featureDemos/config.json`

The file has a `blocks` array containing a `galleryBlock` template. New items go in the `content.items` array.

### Entry Format

```json
{
    "desc": "Clustered Lighting",
    "link": "https://aka.ms/babylon9CLDemo",
    "img": {
        "url": "/featureDemos/assets/img/clusteredLighting.jpg",
        "alt": "A dark scene with dozens of glowing fireflies illuminating stone ruins"
    }
}
```

| Field | Description |
|-------|-------------|
| `desc` | A very short description — just a couple of words derived from the blog post feature heading. Keep it terse (e.g., "Clustered Lighting", "Frame Graph", "SDF Text"). |
| `link` | The demo URL from the "Check out a demo:" line in the blog post. Use the aka.ms link exactly as-is. |
| `img.url` | Path to the captured screenshot: `/featureDemos/assets/img/<camelCaseName>.jpg` |
| `img.alt` | Descriptive alt text based on what the captured screenshot actually shows. |

### Placement

New items are placed **at the top** of the `items` array, in the same order they appear in the blog post (first blog post feature = first item in the array).

## Screenshot Capture Workflow

For each Playground demo, capture a screenshot using the following steps. Use the Playwright browser tools for all browser interactions.

### Step 1: Navigate to the Demo Link

Use the Playwright navigate tool to go to the aka.ms demo URL. This will redirect to a Babylon.js Playground URL.

### Step 2: Modify the URL for Full Preview

Once redirected, the browser will be on a URL like:

```
https://playground.babylonjs.com/#XXXXXX#N
```

You need to insert `full.html` between the last `/` and the `#` to get:

```
https://playground.babylonjs.com/full.html#XXXXXX#N
```

Navigate to this modified URL. This shows just the 3D preview without the code editor.

### Step 3: Wait for the Scene to Load

Wait for the page to fully load and the 3D scene to render. Use the Playwright wait tool to wait for the canvas element to be present and stable. A few seconds of wait time after the page loads is recommended to ensure the scene is fully rendered.

### Step 4: Enter Full Screen and Capture

Resize the browser to a consistent resolution (e.g., 1280x720) to get a good aspect ratio for the gallery thumbnail. Then take a screenshot.

### Step 5: Save the Screenshot

Save the captured screenshot to:

```
src/content/featureDemos/assets/img/<camelCaseName>.jpg
```

Use a camelCase filename derived from the feature name (e.g., "Clustered Lighting" → `clusteredLighting.jpg`, "Frame Graph" → `frameGraph.jpg`, "SDF Text" → `sdfText.jpg`).

### Step 6: Generate Alt Text

View the captured screenshot and write descriptive alt text following these rules:
- Describe what the image shows, not what the feature does.
- Be specific: mention objects, colors, composition, and setting.
- Keep it to one or two sentences.
- Do not repeat the feature name as the alt text.

## Handling Failures

If a screenshot capture fails for any demo (page doesn't load, canvas doesn't render, redirect goes to the wrong place):

1. Report the failure to the user with the URL and error.
2. Ask if they want to:
   - Retry the capture.
   - Provide a manual screenshot.
   - Skip the demo.

## Manual Screenshot Fallback

**Important:** Automated screenshot capture using Playwright is very resource-intensive because it launches headless Chromium to render full WebGL 3D scenes. If the user prefers, or if automated capture is taking too long or causing performance issues, offer a **manual capture** workflow instead:

1. Create all config entries with placeholder image URLs and temporary alt text (`"Placeholder — needs alt text"`).
2. Use camelCase filenames derived from feature names for the `img.url` values.
3. Present the user with the list of filenames they need to provide screenshots for.
4. Once the user saves screenshots with the correct filenames, use the **alt text skill** ("add alt tags to the feature demos page") to generate proper alt text for all images.

This manual approach is typically much faster overall and avoids heavy GPU/CPU usage.

## Step-by-Step Workflow

1. **Read** `.github/blog_post/BlogPost.md` and extract all feature headings and "Check out a demo:" links.
2. **Read** `src/content/featureDemos/config.json` to understand existing entries.
3. **Do not check for or worry about duplicates.** Existing entries stay as-is. All new demos from the blog post are added to the top of the list regardless of whether similar entries already exist. This is intentional — we want links to all featured demos for reference.
4. **Identify non-Playground links** — navigate to each aka.ms link and check if the redirect lands on `playground.babylonjs.com`. Collect all non-Playground links and present them to the user before proceeding with captures. Wait for confirmation to skip them (or create placeholder entries if the user requests it).
5. **Ask the user** whether they want automated screenshot capture or the manual fallback workflow.
6. **If automated**, for each Playground demo (in blog post order):
   a. Navigate to the demo URL using Playwright.
   b. Modify the URL to use `full.html` for the preview-only view.
   c. Wait for the scene to render.
   d. Resize the browser and capture a screenshot.
   e. Save the screenshot to the image directory.
   f. View the screenshot and generate alt text.
7. **If manual**, create all entries with placeholder alt text and present the filename list.
8. **Build the new items array** with all demos.
9. **Report to the user** — show the list of demos with their descriptions, links, image paths, and alt text. Flag any non-Playground demos or failures.
10. **After user confirmation**, insert the new items at the top of the `items` array in the config file.

## What You MUST NOT Do

- **Do NOT remove existing entries.** This is additive only.
- **Do NOT invent demo links.** Use exactly the URL from the blog post.
- **Do NOT reorder existing entries.** Only prepend new ones at the top.
- **Do NOT modify the structure of the JSON** — only add items to the existing `items` array.
