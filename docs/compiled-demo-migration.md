# Compiled Demo Migration Inventory

This tracks the move from legacy static demos under `static/Demos/` to compiled demos under `src/compiledDemos/`. Each migration should keep the public URL stable at `/Demos/<Demo>/`, expose source with `/Demos/<Demo>/source/`, and pass the compiled demo CI checks.

## Status Key

- `done`: Ported to `src/compiledDemos`, registered in `manifest.json`, and covered by render checks.
- `unusable`: The legacy/online demo no longer renders correctly and should not be ported until the source demo is repaired or replaced.
- `wave-1`: Simple single-canvas demo selected for the current migration wave.
- `candidate`: Not migrated yet, likely suitable for a later wave after inspection.
- `special`: Needs extra handling such as workers, vendored bundles, service workers, generated app bundles, WebGPU, physics, GUI, or complex external assets.

## Current Status

| Demo | Status | Notes |
| --- | --- | --- |
| AssetsManager | done | AssetsManager mesh, text, and binary tasks using local legacy demo assets. |
| Boom | done | First compiled demo; includes click interaction render check. |
| Lines | done | Thin animated line rendering; custom low colored-sample threshold. |
| Heightmap | done | Texture and heightmap asset loading. |
| Offscreen | done | Custom worker bootstrap; render check validates both canvases. |
| Fog | done | Animated simple geometry and exponential fog. |
| Bump | done | Simple texture material using an existing shared normal map asset. |
| FlightHelmet | done | Remote glTF asset, default environment, shadows, and scene optimizer coverage. |
| GLTF | done | glTF binary asset loading from the deployed legacy `/assets/` path. |
| GLTF1CesiumMan | unusable | Legacy and online demo do not render; excluded from the compiled registry until the source demo is repaired or replaced. |
| GLTFMeshPrimitiveAttributeTest | done | Multiple remote glTF assets plus generated normal attribute coverage. |
| GLTFNormals | done | Multiple remote glTF assets covering normals/tangents variants. |
| Lights | done | Multiple dynamic lights and shared skybox assets. |
| Particles | done | CPU particle systems plus mirror render target texture. |
| Fresnel | done | Fresnel material parameters, shared skybox assets, and lens flares. |
| Shadows | done | Directional lights, shadow generators, and legacy grass texture. |
| PointLightShadowMap | done | Point light shadow generator with torus knot scene. |
| Refraction | done | Reflection probe refraction with built-in bump/fresnel/IOR controls. |
| Yeti | done | Remote animated glTF asset with loader animation options, default environment, and textured snow particles. |

## Next Waves

| Wave | Demos | Main Risk To Prove |
| --- | --- | --- |
| Asset and loader follow-up | Mansion, Sponza, TheCar | Larger model load times, local scene payloads, animation/UI dependencies, service workers, shadows, and optimizer behavior. |
| Render/effects follow-up | Ribbons, Polygon | Ribbons needs procedural texture and volumetric-light-scattering post-process coverage. Polygon needs an explicit `earcut` dependency decision before porting. |
| Materials and render pipeline demos | CellShading, FireMaterial, Fur, GlowLayer, PBR, PBRGlossy, PBRGlossyBloom, PBRRough, WaterMaterial, DOF, DefaultRenderingPipeline, MotionBlur, PPBloom, PPConvolution, PPRef, SSAO, SSAO2, StandardRenderingPipeline, VolumetricLightScattering | Extra Babylon packages, shader/material side effects, post-process scene components. |
| Interaction and tooling demos | ActionBuilder, Actions, Charting, CustomShader, Decals, DragNDrop, Facets, Highlights, Lens, LookAt, Octree, Procedural, Simplification, VertexData, Views | Picking, pointer events, custom shaders, scene tools, and user interaction checks. |
| Animation, skeleton, and morph demos | Bones, Dancers, Dancing CSG, HillValley, HillValleyVR, InstancedBones, Instances, Instances2, LOD, MorphTargets, V8 | Skeletons, animation loops, instancing, LOD behavior, and render-check stability. |
| Physics and advanced systems | AdvancedShadows, CSG, Cloth, CustomRenderTarget, DisplacementMap, ExtrudePolygon, Multimaterial, Particles2, Physics, Planet, Ribbons, Ruins, SelfShadowing, SoftShadows, SPS, SPSCollisions, Starfield, Tunnel, Viper | Physics engines, generated geometry, custom render targets, particles, and advanced scene components. |
| Special app-style demos | Amp360Video, AnimatedGif, AudioAnalyser, AudioAnalyzer, ChibiRex, Distraction, Espilit, FatObjects, Flat2009, GlowingEspilit, Heart, Ink, MansionVR, ProductPage, RefProbe, Retail, SpaceDeK, Spaceship, SponzaDynamicShadows, Train, UTD, VideoProcessing, WCafe, WebGPU | Vendored bundles, multi-page apps, workers/service workers, audio/video, VR, WebGPU, or nonstandard build/runtime flows. |

## Per-Demo Checklist

1. Inspect the legacy `index.html`, `demo.js`, scene file, and local assets.
2. Create `src/compiledDemos/<Demo>/index.html`, `main.ts`, and `scene.ts` unless the demo needs a custom bootstrap.
3. Prefer `shared/demoRunner.ts` for single-canvas demos.
4. Replace `BABYLON.*` globals with named ESM imports and add side-effect imports for prototype-augmented APIs.
5. Keep asset URLs rooted at stable public paths such as `/Scenes/...` when possible.
6. Register the demo in `src/compiledDemos/manifest.json` with source files and render-check thresholds.
7. Run `npm run demos:format:write`, `npm run build`, and `npm run demos:ci`.
8. Commit one demo or small coherent batch at a time.