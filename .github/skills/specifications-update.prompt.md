---
description: >
  Update the Babylon.js specifications page with new features from a blog post.
  Extracts feature names and doc links from BlogPost.md and adds them as list
  entries in the ENGINE SPECIFICATIONS section of the specifications config.json.
  Additive only — never removes existing entries. Detects potential duplicates
  and asks the user before proceeding.
---

# Specifications Feature Update Skill

You are updating the Babylon.js specifications page at `src/content/specifications/config.json` with feature entries extracted from `.github/blog_post/BlogPost.md`.

## Before Starting — Preflight Check

Check that the required files exist. If anything is missing, tell the user exactly what's needed:

1. **Blog post**: `.github/blog_post/BlogPost.md` — the source of truth for feature names and documentation links.
2. **Specifications config**: `src/content/specifications/config.json` — the target file to update.

If the blog post file is missing, say:
> "I need the blog post markdown at `.github/blog_post/BlogPost.md` before I can update the specifications. Please place it there."

## How to Extract Features from the Blog Post

Each feature in the blog post is a level-2 heading in the format:

```
## **Feature Name**
```

Strip the bold markers (`**`) to get the plain feature name. This is the text you will use for the specification entry.

Each feature section contains a documentation link on a line formatted as:

```
Learn more: [url](url)
```

Use this URL as the `link` value for the specification entry. Use the URL exactly as it appears in the blog post — do not modify or shorten it.

If a feature section contains **more than one** documentation link (excluding demo links which start with "Check out a demo:"), ask the user which link to use. Most features will have exactly one doc link.

## Target File and Structure

**Specifications config**: `src/content/specifications/config.json`

The target is the `twoColumns` block within the `blocks` array. This block has a `content` object with `left` and `right` properties. Each side contains a `sections` array. Each section has a `title` and a `list` array.

### Section Layout

**Left column sections:**
- MAIN FEATURES
- SHADERS / RENDERING
- GEOMETRY

**Right column sections:**
- OPTIMIZATIONS
- SPECIAL FX
- CAMERAS
- EXPORTERS AND TOOLING

All sections are eligible targets for new features. Choose the section that best matches the nature of each feature by grouping it with similar existing entries.

## JSON Entry Format

Each specification entry is an array within the section's `list` array. The simplest and most common form is a single object with a `link` and `text` property:

```json
[
    {
        "link": "https://aka.ms/babylon9CLDoc",
        "text": "Clustered Lighting"
    }
]
```

This is the format you should use for the vast majority of new entries — one link with a short feature name as the text.

### When a list item has no link

If a feature has no documentation link, use a text-only object:

```json
[
    {
        "text": "Feature Name"
    }
]
```

### When a list item needs multiple segments

Occasionally, a list item needs a word or phrase to be a link while the surrounding text is plain. This happens when a single list item references more than one link, or when only part of the text should be a link. In this case, the entry array contains multiple objects — some with just `text`, some with `link` and `text`:

```json
[
    {
        "link": "https://doc.babylonjs.com/features/featuresDeepDive/particles",
        "text": "Particles "
    },
    {
        "text": "(both CPU and GPU)"
    },
    {
        "text": "and "
    },
    {
        "link": "https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system",
        "text": "Solid particles "
    },
    {
        "text": "Systems"
    }
]
```

You will rarely need this multi-segment format. Only use it when you genuinely need multiple links in a single list item or when the feature name is only part of a larger descriptive phrase that needs plain-text segments around it.

## Feature Text

Use the feature heading from the blog post as the text. Feature names from the blog are typically terse and work well as-is. It's acceptable to be slightly wordier if the heading needs a little context to make sense as a standalone specification line — use your judgment.

## Section Placement Rules

Place each feature in the section where it fits best alongside similar existing entries. Here is guidance for each section:

- **MAIN FEATURES**: Core engine capabilities, platform support, scene management, physics, picking, input, XR, native support, GUI, behaviors, controls, general-purpose systems.
- **SHADERS / RENDERING**: Materials, shaders (WGSL, GLSL), PBR, lighting models, textures (all types), image-based lighting, global illumination, shadows, skybox, reflections, procedural textures, material libraries.
- **GEOMETRY**: Meshes, mesh operations, skeletons/bones, morph targets, parametric shapes, CSG, node geometry, Gaussian splatting, greased line, decals related to geometry.
- **OPTIMIZATIONS**: Performance features, LOD, instancing, occlusion, caching, mesh merging, offscreen canvas, multi-canvas, scene optimizer.
- **SPECIAL FX**: Post-processes, fog, alpha blending, billboarding, shadow maps (visual effect category), bloom, grain, anti-aliasing, sharpening, lens flares, reflection probes, highlights, glow, edges, crowd/navigation, screen-space reflections, texture decals, depth of field, motion blur, rendering layers.
- **CAMERAS**: Camera types (universal, arc rotate, free, touch, gamepad, follow, anaglyph, VR, etc.).
- **EXPORTERS AND TOOLING**: Editors (NME, NGE, GUI Editor, etc.), exporters, importers, inspector, asset management tools, sandbox, drag-and-drop support.

### Ordering Within a Section

Features within a section are loosely ordered by importance/impact. Place new features at a position that reflects their significance relative to existing entries. Major new systems go higher; incremental improvements or updates go lower. The user can ask you to reorder after placement — order does not need to be perfect.

## Duplicate Detection — CRITICAL

**This process is additive. You MUST NOT remove any existing specification entries.**

Before adding a new feature, scan all existing entries across all sections for potential duplicates. A duplicate might be:

- An exact text match.
- A very similar name (e.g., existing "Gaussian Splat Rendering" vs. new "Advanced Gaussian Splat Support").
- An entry that covers the same capability (e.g., existing "IBL Shadows" vs. new "Dynamic IBL Shadows").

If you find any potential duplicates:

1. **Do NOT remove or replace the existing entry.**
2. **Do NOT silently skip the new feature.**
3. **Ask the user**, showing both the existing entry and the new feature, for example:

> I found a potential duplicate:
> - **Existing** (SHADERS / RENDERING): "IBL Shadows" → `https://aka.ms/babylon8IBLShadowsDoc`
> - **New from blog post**: "Dynamic IBL Shadows" → `https://aka.ms/babylon9IBLSDoc`
>
> How would you like to handle this? Options:
> 1. Add the new entry alongside the existing one.
> 2. Update the existing entry's text and/or link to the new values.
> 3. Skip the new entry — the existing one is sufficient.

Wait for the user's response before proceeding with that feature.

## Column Balancing

The left and right columns should be roughly the same visual height. Since each section has a title and a list of items, estimate relative height by counting total list items per column (plus a small weight for each section title).

After adding all new features, check if the columns are significantly imbalanced. If one column has substantially more entries than the other, consider suggesting to the user that an entire section be moved from the longer column to the shorter one. **Do not split a section between columns.** Only move whole sections.

If the imbalance is minor (within ~10-15 items), leave it as-is.

## Step-by-Step Workflow

1. **Read** `.github/blog_post/BlogPost.md` and extract all feature headings and their "Learn more:" documentation links.
2. **Read** `src/content/specifications/config.json` and parse the `twoColumns` block to understand existing sections and entries.
3. **For each blog post feature**, determine:
   - The short text for the specification entry (from the heading).
   - The documentation link.
   - Which section it belongs in.
   - Where in the section's order it should be placed.
4. **Check for duplicates** against all existing entries. Collect any potential duplicates.
5. **Report to the user** before making changes:
   - List each new feature, its target section, and approximate placement.
   - List any potential duplicates with the options above.
   - Ask the user to confirm or adjust before proceeding.
6. **After user confirmation**, apply the changes to `src/content/specifications/config.json`.
7. **Check column balance** and suggest section moves if needed.

## What You MUST NOT Do

- **Do NOT remove any existing specification entries.** This process is strictly additive.
- **Do NOT modify the text or links of existing entries** unless the user explicitly asks you to as part of duplicate resolution.
- **Do NOT invent feature names.** Use the blog post heading as the text.
- **Do NOT invent or modify links.** Use the exact URL from the blog post.
- **Do NOT add features that are not in the blog post.**
- **Do NOT change the structure of the JSON** (template names, section titles, etc.) — only add entries to existing section `list` arrays.
- **Do NOT split sections between columns.**
