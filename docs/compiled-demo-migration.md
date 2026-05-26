# Compiled Demo Migration Inventory

This tracks the move from legacy static demos under `static/Demos/` to compiled demos under `src/compiledDemos/`. Each migration should keep the public URL stable at `/Demos/<Demo>/`, expose source with `/Demos/<Demo>/source/`, and pass the compiled demo CI checks.

## Status Key

- `done`: Ported to `src/compiledDemos`, registered in `manifest.json`, and covered by render checks.
- `covered`: Scenario is already exercised by another compiled demo and should not consume a current migration wave slot.
- `unusable`: The legacy/online demo no longer renders correctly and should not be ported until the source demo is repaired or replaced.
- `wave-1`: Simple single-canvas demo selected for the current migration wave.
- `candidate`: Not migrated yet, likely suitable for a later wave after inspection.
- `special`: Needs extra handling such as workers, vendored bundles, service workers, generated app bundles, WebGPU, physics, GUI, or complex external assets.

## Current Status

| Demo | Status | Notes |
| --- | --- | --- |
| AdvancedShadows | done | Directional shadow generator coverage with animated casters and soft shadows. |
| AssetsManager | done | AssetsManager mesh, text, and binary tasks using local legacy demo assets. |
| Boom | done | First compiled demo; includes click interaction render check. |
| Lines | done | Thin animated line rendering; custom low colored-sample threshold. |
| Heightmap | done | Texture and heightmap asset loading. |
| Offscreen | done | Custom worker bootstrap; render check validates both canvases. |
| Fog | done | Animated simple geometry and exponential fog. |
| Bump | done | Simple texture material using an existing shared normal map asset. |
| CellShading | done | Cell material coverage with textured toon ground and instanced torus knots. |
| CSG | done | Constructive solid geometry subtract/intersect coverage with multi-material output. |
| CustomShader | done | Inline ShaderMaterial cell-shading style effect with animated primitive meshes. |
| CustomRenderTarget | done | RenderTargetTexture coverage rendered onto scene geometry. |
| Decals | done | Decal builder coverage with alpha impact textures projected onto a mesh. |
| DefaultRenderingPipeline | done | Default rendering pipeline-style post-process coverage with FXAA and sharpening. |
| DisplacementMap | done | Procedural displacement-style vertex deformation with skybox coverage. |
| DOF | done | Stable depth-of-field-style blur post-process coverage with near/far subject layout. |
| FireMaterial | done | Fire material coverage with generated diffuse, distortion, and opacity textures. |
| FlightHelmet | covered | Flight Helmet asset loading is already exercised by the compiled Offscreen demo; standalone legacy page is left out of this wave. |
| Fur | done | Fur material coverage with generated fur texture and shell mesh layers. |
| GLTF | done | glTF binary asset loading from the deployed legacy `/assets/` path. |
| GLTF1CesiumMan | unusable | Legacy and online demo do not render; excluded from the compiled registry until the source demo is repaired or replaced. |
| GLTFMeshPrimitiveAttributeTest | done | Multiple remote glTF assets plus generated normal attribute coverage. |
| GLTFNormals | done | Multiple remote glTF assets covering normals/tangents variants. |
| GlowLayer | done | Glow layer coverage over emissive animated geometry. |
| GUI | done | GUI advanced dynamic texture, stack panel, text block, and button coverage. |
| Lights | done | Multiple dynamic lights and shared skybox assets. |
| LOD | done | Torus-knot LOD levels with instancing and fog. |
| LookAt | done | Large instanced cube field continuously looking at a moving target. |
| MotionBlur | done | Motion blur post-process coverage with animated meshes. |
| Multimaterial | done | MultiMaterial submesh assignment with bump texture coverage. |
| Octree | done | Selection octree creation with a deterministic cloned sphere field. |
| Particles | done | CPU particle systems plus mirror render target texture. |
| PBR | done | PBR material coverage with varied metallic/roughness settings. |
| PBRGlossy | done | Glossy PBR/clear-coat material coverage. |
| PBRGlossyBloom | done | Glossy PBR material coverage combined with glow/bloom-style output. |
| PBRRough | done | Roughness ramp PBR material coverage. |
| Fresnel | done | Fresnel material parameters, shared skybox assets, and lens flares. |
| PPBloom | done | Bloom-style glow layer over emissive animated primitives. |
| PPConvolution | done | Convolution post-process coverage over animated primitive geometry. |
| PPRef | done | Refraction post-process coverage with local refraction map texture. |
| Shadows | done | Directional lights, shadow generators, and legacy grass texture. |
| StandardRenderingPipeline | done | Standard rendering pipeline-style post-process coverage using sharpen output. |
| PointLightShadowMap | done | Point light shadow generator with torus knot scene. |
| Refraction | done | Reflection probe refraction with built-in bump/fresnel/IOR controls. |
| Ribbons | done | Dynamic ribbon geometry with volumetric light scattering post-process coverage. |
| VertexData | done | Custom VertexData mesh with indexed positions and vertex color coverage. |
| Highlights | done | HighlightLayer and HDR/PBR material coverage. |
| Lens | done | Lens flare system coverage with local flare textures and shared skybox assets. |
| VolumetricLightScattering | done | Local skull scene asset with volumetric light scattering billboard and texture coverage. |
| WaterMaterial | done | Water material coverage with generated bump texture and reflection render list. |
| Yeti | done | Remote animated glTF asset with loader animation options, default environment, and textured snow particles. |

## Pure Barrel Track

| Demo | Status | Notes |
| --- | --- | --- |
| 30 core-only demos | experimental | Isolated under `src/pureCompiledDemos/` and built to `/PureDemos/<Demo>/` with `@babylonjs/core/pure`. Not part of normal `demos:ci` yet; validate with `npm run demos:pure:ci`. |

## Next Waves

| Wave | Demos | Main Risk To Prove |
| --- | --- | --- |
| Asset and loader follow-up | Mansion, Sponza, TheCar | Larger model load times, local scene payloads, animation/UI dependencies, service workers, shadows, and optimizer behavior. TheCar currently needs investigation because its scene readiness can stall render validation. |
| Render/effects follow-up | Polygon | Polygon needs an explicit `earcut` dependency decision before porting. |
| Materials and render pipeline demos | SSAO, SSAO2 | Extra Babylon packages, shader/material side effects, post-process scene components. |
| Interaction and tooling demos | ActionBuilder, Actions, Charting, DragNDrop, Facets, Procedural, Simplification, Views | Picking, pointer events, custom shaders, scene tools, and user interaction checks. |
| Animation, skeleton, and morph demos | Bones, Dancers, Dancing CSG, HillValley, HillValleyVR, InstancedBones, Instances, Instances2, MorphTargets, V8 | Skeletons, animation loops, instancing, LOD behavior, and render-check stability. |
| Physics and advanced systems | Cloth, ExtrudePolygon, Particles2, Physics, Planet, Ruins, SelfShadowing, SoftShadows, SPS, SPSCollisions, Starfield, Tunnel, Viper | Physics engines, generated geometry, custom render targets, particles, and advanced scene components. |
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