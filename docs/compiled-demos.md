# Compiled Demos Architecture

The legacy demos under `static/Demos/` are copied directly into `build/` and load Babylon from the UMD CDN. Compiled demos live under `src/compiledDemos/`, import `@babylonjs/core` and sibling packages as ES modules, and are bundled with Vite.

## Goals

- Keep existing demo URLs stable, for example `/Demos/Boom/`.
- Migrate one demo at a time without disturbing demos that still live in `static/Demos/`.
- Make new demos easy to add with a small source folder and one manifest entry.
- Check that compiled demos typecheck, bundle, load in a browser, create a scene, and render a nonblank canvas.

## Build Flow

1. `npm run site:build` runs the existing Eleventy build and copies `static/` to `build/`.
2. `npm run demos:build` runs Vite with `vite.demos.config.mjs` and generates source pages.
3. `npm run build` runs both steps in order, producing the full deployable site output.
4. Vite writes compiled demo pages into `build/Demos/<slug>/`, overlaying only the migrated demos listed in `src/compiledDemos/manifest.json`.
5. Unmigrated demos continue to come from `static/Demos/`.

This keeps the site and demo build steps available separately while making the default `build` script produce the final combined output.

For local preview, run `npm run demos:serve`. This builds the site, overlays the compiled demos, and serves the final `build/` output with Vite preview.

## Source Layout

```text
src/compiledDemos/
  manifest.json
  shared/
    demoRunner.ts
  Boom/
    index.html
    main.ts
    scene.ts
  Lines/
    index.html
    main.ts
    scene.ts
```

Each demo folder owns its HTML shell and TypeScript entry. Shared browser bootstrapping lives in `shared/demoRunner.ts`, which creates the engine, starts the render loop, wires common controls, and exposes `window.__babylonDemoReady` for CI.

Each demo page should include a small source link at the bottom of the viewport:

```html
<a id="sourceLink" href="./source/">Source</a>
```

`npm run demos:build` generates `/Demos/<slug>/source/` from the files listed in `manifest.json`, so the site can show the exact TypeScript source for each compiled demo.

## Adding A Demo

1. Create `src/compiledDemos/<Slug>/index.html`, `main.ts`, and `scene.ts`.
2. Export a scene factory from `scene.ts`:

    ```ts
    export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
        // create and return a Babylon scene
    }
    ```

3. Call the shared runner from `main.ts`:

    ```ts
    import { runDemo } from "../shared/demoRunner";
    import { createScene } from "./scene";

    runDemo({ createScene });
    ```

4. Add the demo to `src/compiledDemos/manifest.json`.
5. Add `sourceFiles` for the files that should appear on the source page.
6. Run `npm run demos:format:write` if needed, then `npm run build && npm run demos:ci`.

## Render Checks

`npm run demos:check` serves the `build/` directory locally, opens each compiled demo with Playwright Chromium, waits for `window.__babylonDemoReady`, screenshots the canvas, samples pixels with Sharp, and fails if the canvas is blank or browser errors were reported.

The initial check is intentionally a health check. It proves the demo compiles and renders. Individual demos can add `renderCheck.interaction` entries for important first-screen behavior; Boom uses this to click the canvas and verify the rendered output changes after the sign explodes. Screenshot baselines can be added later once the migration has enough coverage to justify the extra maintenance.

## Linting And Formatting

Compiled demo source is linted with ESLint and formatted with Prettier. The checks are intentionally scoped to the new compiled demo pipeline, not the legacy `static/` demo tree.

- `npm run demos:lint` checks TypeScript demo source and demo build scripts.
- `npm run demos:format` verifies formatting for compiled demo source, config, and docs.
- `npm run demos:format:write` applies the configured formatting.

## CI

`azure-pipelines.compiled-demos.yml` is intentionally separate from the existing build CI. It runs `npm run build` first, which produces the site with compiled demos, and then runs `npm run demos:ci` to lint, format-check, typecheck, and render-check the compiled demos. If the main build pipeline can publish a build artifact later, this pipeline can be changed to consume that artifact instead of rebuilding the site.

## Migration Notes

- Custom scene-factory demos usually map cleanly from `BABYLON.*` globals to named ES module imports from `@babylonjs/core`.
- Demos that currently load `.babylon`, `.glb`, GUI, materials, loaders, or inspector packages should import the matching side-effect modules in their compiled entry.
- Keep asset URLs rooted at existing public paths such as `/Scenes/...` when assets are already served from `static/`.
- Once a compiled demo is stable, the old `static/Demos/<Slug>/` sources can be removed in a separate cleanup PR.
