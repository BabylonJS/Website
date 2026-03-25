---
description: >
  Generate descriptive alt text for images in any config JSON file on the
  Babylon.js website. Views each image referenced in the file and writes
  accurate, accessible alt text based on what the image actually shows.
  Triggers on: "add alt tags", "alt text", "alt tags" for any page.
---

# Image Alt Text Skill

You are adding descriptive alt text to images in Babylon.js website config JSON files.

## When to Run

Run this skill when the user asks to add, update, or fix alt tags/alt text on any page. Example prompts:

- "Add alt tags to the main page"
- "Update alt text on the homepage"
- "Fix alt tags on the features page"
- "Add alt text to the feature demos page"
- "Write alt tags for the community page images"

## Target File

The target file is whichever config JSON the user specifies (or the one currently open). Common targets:

- **Homepage**: `src/content/config.json` — images in `imageAndTextBlock` entries
- **Feature demos**: `src/content/featureDemos/config.json` — images in `galleryBlock` items
- **Community**: `src/content/community/config.json` — images in `galleryBlock` items
- **Any other config**: Any JSON file under `src/content/` that contains `img` objects with `url` and `alt` fields

The skill works on any file that has image references with `alt` fields. Look for `img` objects containing `url` and `alt` properties.

## Step-by-Step Workflow

1. **Read** the target config JSON and find all entries that contain `img` objects with `alt` fields.
2. **Identify** which entries have missing, empty, or placeholder alt text (e.g., `"Placeholder alt text"`, `"Placeholder image"`, `""`, or generic text that doesn't describe the image).
3. **For each image that needs alt text**, view the actual image file to see what it depicts. Resolve the `url` path relative to the project — paths starting with `/` are relative to `src/content/`, and paths starting with `../` are relative to the config file's directory.
4. **Write descriptive alt text** based on what you see in the image, following the rules below.
5. **Apply all changes** to the config file.
6. **Report** what was updated.

## Alt Text Rules

- **Describe what the image shows**, not what the feature does. The alt text is for accessibility — it should help someone who cannot see the image understand what is depicted.
- **Be specific and concrete.** Describe the visual content: objects, colors, composition, setting. "A dark industrial interior with visible light shafts streaming through openings" is better than "Volumetric lighting demo."
- **Keep it to one sentence**, roughly 10–25 words. Long enough to be descriptive, short enough to not be a paragraph.
- **Do not repeat the feature title.** The title is already displayed alongside the image. The alt text should describe the visual, not restate the heading.
- **Do not use phrases like "image of" or "screenshot of"** — screen readers already announce it as an image.
- **Use the feature context** (title, description) to inform your understanding of the image, but describe what you actually see, not what the feature specification says.

## What Counts as Placeholder

Replace alt text if it matches any of these patterns:
- `"Placeholder alt text"`
- `""` (empty string)
- Generic text like `"Feature image"` or `"Demo screenshot"` that doesn't describe the specific visual content

If an image already has specific, descriptive alt text that accurately describes what the image shows, leave it as-is.

## Example

**Image**: A processed PNG showing a dark corridor with a glowing neon sign casting orange and blue light on metallic walls.

**Good alt text**: `"A sci-fi corridor with a glowing electronic sign casting colored light onto surrounding metallic walls"`

**Bad alt text**: `"Textured Area Lights feature demo"` (describes the feature, not the image)

**Bad alt text**: `"Screenshot of a demo"` (too generic)
