---
description: >
  Rules for converting blog post feature descriptions into config.json website text.
  The blog post is the single source of truth. No content may be invented or added.
---

# Blog Text to Website Text Conversion Rules

The blog post at `.github/blog_post/BlogPost.md` is the **single source of truth** for all feature descriptions on the homepage. Every word in `config.json` must trace back to the blog post.

## What You MUST Do

1. **Start from the exact blog post text.** Copy the relevant paragraph(s) for each feature.
2. **Strip markdown formatting** — remove bold (`**`), italic (`*`), links (`[text](url)`), and other markdown syntax. Keep the plain text.
3. **Strip demo/doc link lines** — the "Check out a demo:" and "Learn more:" lines are handled by `moreInfoLink`/`moreInfoText` fields, not the description.

## What You MAY Do (Trimming Only)

These are the **only** permitted modifications to reduce length:

- **Delete entire sentences** that are less important (e.g., introductory fluff, historical context, or secondary details). Prefer deleting from the end or middle — keep the opening sentence intact when possible.
- **Delete clauses** within a sentence using punctuation boundaries (commas, em dashes, semicolons). The remaining sentence must still be grammatically correct.
- **Replace markdown punctuation** — e.g., em dashes (`—`) can become commas or be removed if the sentence reads fine without them.
- **Remove parenthetical asides** if they aren't essential.
- **Change "We are excited to introduce" / "We are thrilled"** → can shorten to "Introducing" or similar to save space, since these are just rhetorical flourishes.

## What You MUST NOT Do

- **Do NOT rephrase or rewrite sentences.** If the blog says "intelligently grouping lights into screen-space tiles and depth slices", you cannot change it to "grouping lights into tiles and slices" or any other rewording.
- **Do NOT add content** that isn't in the blog post. No new technical claims, no new attributions, no new feature descriptions. If it's not in the blog, it doesn't go in config.json.
- **Do NOT change technical claims.** If the blog says "supports both directional and spot light sources", you cannot drop "spot" or change the meaning. Either keep the full claim or delete the entire sentence.
- **Do NOT invent attributions or credits.** If the blog doesn't credit a specific person or company for a feature, you cannot add one. If the blog says "developed by Autodesk and Adobe", you cannot change it to "hosted by the Academy Software Foundation".
- **Do NOT substitute synonyms** for technical terms. "Screen-space tiles" stays "screen-space tiles", not "screen tiles" or "spatial groups."
- **Do NOT merge content from different features.** Each config.json description must only contain text from its corresponding blog section.
- **Do NOT hallucinate.** This is the most important rule. Every factual claim in the description must exist verbatim (or as a direct substring) in the blog post.

## Verification

After writing each description, verify it by checking: **can every phrase in my output be found in the corresponding blog section?** If any phrase cannot be traced back to the blog, it must be removed.

## Length Guidelines

- Target 2-4 sentences per description.
- If the blog section is already short (1-2 paragraphs), you may only need to delete 1-2 sentences.
- If the blog section is long (3+ paragraphs), pick the most impactful sentences from across the paragraphs. But each sentence you include must be from the blog — not synthesized.

## Title Rules

- Use the exact `## **Feature Name**` heading from the blog post, stripped of bold markers.
- You may append a short suffix like "— Alpha" only if the blog post explicitly describes the feature as alpha/preview/experimental.
- Do NOT rename features.

## Example

**Blog text:**
> Babylon.js 9.0 introduces a powerful new Clustered Lighting system that dramatically speeds up lighting calculations by intelligently grouping lights into screen-space tiles and depth slices. At render time, each pixel only calculates lighting from the lights that actually affect it. The result? Scenes with hundreds or even thousands of lights running at buttery smooth frame rates! This system works on both WebGPU and WebGL 2, bringing next-generation lighting performance to the broadest possible audience.

**Acceptable output (deleted last sentence):**
> Babylon.js 9.0 introduces a powerful new Clustered Lighting system that dramatically speeds up lighting calculations by intelligently grouping lights into screen-space tiles and depth slices. At render time, each pixel only calculates lighting from the lights that actually affect it. The result? Scenes with hundreds or even thousands of lights running at buttery smooth frame rates!

**Unacceptable output (rewritten):**
> Babylon.js 9.0 brings a new lighting system that groups lights into tiles for faster rendering. Only relevant lights are calculated per pixel, enabling scenes with thousands of lights at smooth frame rates.

The second version says the same thing but uses different words — this is NOT allowed.
