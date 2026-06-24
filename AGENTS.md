# AGENTS.md — Contributing demos to the Babylon.js website

This file tells automated agents (and humans) how to add or change demos on the
Babylon.js website. Read it before touching anything under `src/compiledDemos/`,
`src/pureCompiledDemos/`, or `static/Demos/`.

## The one hard rule: no UMD demos

**Every demo on the website MUST use the ES6 `@babylonjs/*` packages. UMD is not
allowed.**

- ❌ Do **not** add a demo that loads Babylon from a UMD/CDN script tag, e.g.
  `<script src="//preview.babylonjs.com/babylon.js"></script>` or any
  `BABYLON.*` global usage.
- ❌ Do **not** add a demo to `static/Demos/`. That folder is the legacy UMD tree
  and is being removed. Nothing new goes there.
- ✅ Add demos as ES6 TypeScript that imports named symbols from
  `@babylonjs/core` (and sibling packages), bundled by Vite.

If you are porting a legacy `static/Demos/<Name>/` demo, you replace every
`BABYLON.*` global with an explicit ES6 import and delete the legacy folder once
the port is verified.

## Two flavors, add BOTH

Every demo exists in two forms. When you add or port a demo, add it in **both**:

1. **Compiled demo** — `src/compiledDemos/<Slug>/`. Imports from the standard
   deep ESM paths such as `@babylonjs/core/Engines/engine`. Built to
   `build/Demos/<Slug>/` and served at `/Demos/<Slug>/`.
2. **Pure demo** — `src/pureCompiledDemos/<Slug>/`. Imports from the tree-shaken
   `@babylonjs/core/pure` barrel and calls the explicit `Register*()` side-effect
   functions it needs. Built to `build/PureDemos/<Slug>/` and served at
   `/PureDemos/<Slug>/`.

The pure flavor exists to prove the demo works against the side-effect-free
barrel. If a feature cannot be expressed in pure form, say so explicitly in the
PR/commit rather than silently skipping it.

## File layout per demo

```text
src/compiledDemos/<Slug>/
  index.html   # canvas shell; copy an existing demo's index.html, change <title>
  main.ts      # 5-line wrapper that calls runDemo({ createScene })
  scene.ts     # the actual scene factory — the only file with real logic

src/pureCompiledDemos/<Slug>/
  index.html   # same shell
  main.ts      # same wrapper, imports ../shared/demoRunner (the pure one)
  scene.ts     # same scene, but imports from @babylonjs/core/pure
```

`main.ts` is always:

```ts
import { runDemo } from "../shared/demoRunner";
import { createMyScene } from "./scene";

runDemo({ createScene: createMyScene });
```

`scene.ts` exports a factory. It may return `Scene` or `Promise<Scene>` (use the
Promise form for demos that load assets):

```ts
export function createMyScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    // ...build the scene...
    return scene;
}
```

`index.html` is identical across demos except the `<title>`. Copy it from a
neighboring demo (for example `src/compiledDemos/Fog/index.html`). It must keep
the `#renderCanvas` element, the `#enableDebug`/`#fullscreen` buttons, the
`<a id="sourceLink" href="./source/">Source</a>` link, and
`<script type="module" src="./main.ts"></script>`.

## Imports: compiled vs pure

Compiled (`src/compiledDemos`) — deep named imports plus side-effect imports for
prototype-augmented APIs:

```ts
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader"; // side effect: .babylon loader
```

Pure (`src/pureCompiledDemos`) — import everything from the `pure` barrel and
register side effects with the matching `Register*()` call. Shared registrations
(StandardMaterial, dynamic/read texture, cube texture, depth renderer, outline)
already live in `src/pureCompiledDemos/shared/demoRunner.ts`; only add
registrations specific to your demo in your `scene.ts`.

```ts
import type { Engine, Scene } from "@babylonjs/core/pure";
import { StandardMaterial, RegisterBabylonFileLoader } from "@babylonjs/core/pure";

RegisterBabylonFileLoader(); // pure equivalent of the side-effect import above
```

> **Critical (pure only):** if `Engine`/`Scene` (or any symbol) are used **only as
> types**, import them with `import type`. Importing them as values and silencing
> the unused-var lint with `void Engine;` makes the bundler emit
> `init_engine_pure()` / `init_scene_pure()` calls **without importing them**,
> which fails at runtime with `ReferenceError: init_engine_pure is not defined`.
> Keep genuine value imports (e.g. `ShadowGenerator` used with `instanceof`) in a
> separate, non-`type` import statement.

Common compiled side-effect → pure registration pairs:

| Feature | Compiled side-effect import | Pure registration |
| --- | --- | --- |
| `.babylon` file loading | `@babylonjs/core/Loading/Plugins/babylonFileLoader` | `RegisterBabylonFileLoader()` |
| StandardMaterial | `@babylonjs/core/Materials/standardMaterial` | `RegisterStandardMaterial()` |
| MultiMaterial | `@babylonjs/core/Materials/multiMaterial` | `RegisterMultiMaterial()` |
| Fresnel parameters | `@babylonjs/core/Materials/fresnelParameters` | `RegisterFresnelParameters()` |
| Loading screen | `@babylonjs/core/Loading/loadingScreen` | `RegisterLoadingScreen()` |
| Universal/Arc cameras | `@babylonjs/core/Cameras/universalCamera` (etc.) | `RegisterUniversalCamera()` / `RegisterArcRotateCamera()` |
| Lights (dir/point/spot/hemi) | imported transitively | `RegisterDirectionalLight()` / `RegisterPointLight()` / `RegisterSpotLight()` / `RegisterHemisphericLight()` |
| Dynamic texture | `@babylonjs/core/Engines/Extensions/engine.dynamicTexture` | `RegisterEnginesExtensionsEngineDynamicTexture()` |
| Cube texture / skybox | `@babylonjs/core/Engines/Extensions/engine.cubeTexture` | `RegisterAbstractEngineCubeTexture()` + `RegisterEnginesExtensionsEngineCubeTexture()` |
| Render target / shadow map | `@babylonjs/core/Engines/Extensions/engine.renderTarget` | `RegisterEnginesExtensionsEngineRenderTarget()` + `RegisterEnginesExtensionsEngineRenderTargetTexture()` + `RegisterRenderTargetTexture()` |
| Shadow generator | `@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent` + `import { ShadowGenerator }` | `RegisterShadowGeneratorSceneComponent(ShadowGenerator)` (also needs render-target + light regs above) |
| Mesh actions | `@babylonjs/core/Actions/directActions` + `directAudioActions` + `interpolateValueAction` | `RegisterDirectActions()` + `RegisterDirectAudioActions()` + `RegisterInterpolateValueAction()` |
| Depth renderer | `@babylonjs/core/Rendering/depthRendererSceneComponent` | `RegisterDepthRendererSceneComponent(DepthRenderer)` |
| Outline renderer | `@babylonjs/core/Rendering/outlineRenderer` | `RegisterOutlineRenderer()` |

The shared `demoRunner.ts` (compiled and pure) already registers the common ones:
loading screen, standard/multi-material, fresnel, dynamic/read/cube texture, depth
renderer, outline, universal/arc cameras, and the four common light types. Only add
registrations specific to your demo (e.g. shadow-map render targets, actions) in
your own `scene.ts`.

If a registration is missing in pure mode the symptom is usually a silent no-op
(textures never become ready, a scene component is a stub). When in doubt, search
`node_modules/@babylonjs/core/**/pure.d.ts` for the matching `Register*` export.

## Assets

- Keep asset URLs rooted at stable public paths. Legacy `.babylon` scenes and
  textures live under `static/Scenes/<Name>/` and are served from `/Scenes/...`.
- Do not enable `engine.enableOfflineSupport`; it triggers `.manifest` requests
  that fail the smoke test. The shared `demoRunner` already creates the engine
  for you, so just don't turn offline support on.

## Manifests

Register the compiled demo in `src/compiledDemos/manifest.json` and the pure demo
in `src/pureCompiledDemos/manifest.json`:

```json
{
    "slug": "<Slug>",
    "title": "Babylon.js - <Name> demo",
    "legacyPath": "static/Demos/<Slug>",
    "sourceFiles": ["main.ts", "scene.ts"],
    "renderCheck": { "timeoutMs": 20000, "minimumColoredSamples": 120 }
}
```

- `sourceFiles` are the files shown on the generated `/Demos/<Slug>/source/` page.
- `renderCheck.timeoutMs` should be generous for asset-loading demos (30–60s).
- `minimumColoredSamples` is the blank-canvas guard; lower it for sparse scenes
  (for example `Lines` uses 10).

## Removing the legacy UMD demo

Once the ES6 compiled + pure versions are verified, delete the legacy folder
`static/Demos/<Slug>/`. Do not leave a UMD copy behind — the website must not
ship any UMD demos.

## Validate before you are done

From the repo root:

```bash
npm run demos:format:write     # apply prettier
npm run build                  # site + compiled demos + pure demos
npm run demos:smoke            # browser smoke: console/page/request errors
npm run demos:pure:smoke       # same for /PureDemos/
```

For full validation (typecheck + render/pixel checks) run `npm run demos:ci` and
`npm run demos:pure:ci`. The smoke test loads each demo in headless Chromium,
waits for `window.__babylonDemoReady`, and fails on any console error, page
error, or failed network request. A demo is not "done" until both smoke tests
pass with no scene-related console errors.

## Checklist

- [ ] No `BABYLON.*` globals, no UMD/CDN script tags anywhere.
- [ ] `src/compiledDemos/<Slug>/` added (index.html, main.ts, scene.ts).
- [ ] `src/pureCompiledDemos/<Slug>/` added, importing from `@babylonjs/core/pure`.
- [ ] Both manifests updated.
- [ ] Legacy `static/Demos/<Slug>/` deleted.
- [ ] `npm run build` succeeds.
- [ ] `npm run demos:smoke` and `npm run demos:pure:smoke` pass with no errors.
