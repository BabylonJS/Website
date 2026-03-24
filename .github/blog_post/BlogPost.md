![Babylon.js 9.0 Hero Image](9.0HeroImageBright.png)

# Introducing Babylon.js 9.0

Our mission is to build one of the most powerful, beautiful, simple, and open web rendering engines in the world. Today, we are thrilled to announce that mission takes a monumental leap forward with the release of Babylon.js 9.0.

Babylon.js 9.0 represents our biggest and most feature-rich update yet — a celebration of an incredible year of new features, optimizations, and performance improvements that push the boundaries of what's possible on the web. From groundbreaking lighting and particle systems to geospatial rendering, animation retargeting, and an all-new inspector — Babylon.js 9.0 empowers web developers everywhere to create richer, more immersive experiences than ever before.

Before we dive in, we want to take a moment to humbly thank the incredible community of developers, contributors, and advocates who pour their knowledge, expertise, and passion into this platform. Babylon.js would not be here without you.

So, let's dive in and see what's new!

---

## **Clustered Lighting**

When a scene has a *lot* of lights, per-pixel lighting calculations can get incredibly slow. Every single pixel has to compute the lighting contribution from every single light — even if those lights aren't actually affecting that pixel. Clustered Lighting changes all of that.

Babylon.js 9.0 introduces a powerful new Clustered Lighting system that dramatically speeds up lighting calculations by intelligently grouping lights into screen-space tiles and depth slices. At render time, each pixel only calculates lighting from the lights that actually affect it. The result? Scenes with *hundreds* or even *thousands* of lights running at buttery smooth frame rates! This system works on both WebGPU and WebGL 2, bringing next-generation lighting performance to the broadest possible audience.

![Clustered Lighting](clusteredLights.png)

Check out a demo: [https://aka.ms/babylon9CLDemo](https://aka.ms/babylon9CLDemo)

Learn more: [https://aka.ms/babylon9CLDoc](https://aka.ms/babylon9CLDoc)

---

## **Textured Area Lights**

Building on the Area Lights introduced in Babylon.js 8.0, we're excited to announce that area lights in Babylon.js 9.0 now support emission textures! This means you can use any image as a light source for your rectangular area light, enabling effects like stained glass projections, LED panel displays, or cinematic lighting setups — all with physically accurate light emission. An offline texture processing tool is also available for production workflows, and a runtime processing option is provided for quick prototyping and experimentation.

![Textured Area Lights](texturedAreaLights.png)

Check out a demo: [https://aka.ms/babylon9TALDemo](https://aka.ms/babylon9TALDemo)

Learn more: [https://aka.ms/babylon9TALDoc](https://aka.ms/babylon9TALDoc)

---

## **Node Particle Editor**

We are absolutely thrilled to introduce the Node Particle Editor (NPE) — a brand-new visual tool that lets you create complex particle systems using a powerful, non-destructive node graph. If you're familiar with Babylon's Node Material Editor, you'll feel right at home! The NPE gives you complete control over every aspect of your particle systems — from emission shapes and sprite sheets to update behaviors and sub-emitters — all through an intuitive drag-and-connect interface. Whether you're creating simple smoke effects or elaborate procedural fireworks, the Node Particle Editor makes it easy, visual, and fun.

![Node Particle Editor](NPE.png)

Check out a demo: [https://aka.ms/babylon9NPEDemo](https://aka.ms/babylon9NPEDemo)

Learn more: [https://aka.ms/babylon9NPEDoc](https://aka.ms/babylon9NPEDoc)

---

## **Particle Flow Maps**

Want even more control over how your particles behave? Babylon.js 9.0 introduces Flow Maps — a screen-aligned texture that controls the direction and intensity of forces applied to particles based on their position on the screen. Each pixel in the flow map encodes a 3D direction vector and strength, giving you fine-grained, artistic control over particle movement. Flow maps work with both CPU and GPU particle systems, and integrate seamlessly with the new Node Particle Editor.

![Particle Flow Maps](particleFMAT.png)

Check out a demo: [https://aka.ms/babylon9PartFMDemo](https://aka.ms/babylon9PartFMDemo)

Learn more: [https://aka.ms/babylon9PartFMDoc](https://aka.ms/babylon9PartFMDoc)

---

## **Particle Attractors**

Babylon.js 9.0 adds gravity attractors to the particle system toolkit. An attractor is a simple but powerful concept: define a position and a strength, and watch as particles are pulled (or pushed!) toward that point in space. Set a negative strength to create a repulsor. Attractors can be repositioned and adjusted in real time, making it easy to create dynamic, interactive particle effects like swirling vortexes, magnetic fields, or explosion shockwaves.

![Particle Attractors](particleFMAT.png)

Check out a demo: [https://aka.ms/babylon9PartAttDemo](https://aka.ms/babylon9PartAttDemo)

Learn more: [https://aka.ms/babylon9PartAttDoc](https://aka.ms/babylon9PartAttDoc)

---

## **Volumetric Lighting**

Realistic light shafts streaming through fog, dust, or haze can transform a scene from flat to cinematic — and Babylon.js 9.0 makes this easier than ever with a powerful new Volumetric Lighting system. Built on a technique using extruded light volumes, the system generates position, normal, and flux textures from the light's perspective, where each texel acts as a Virtual Point Light that illuminates participating media in the scene.

The result is stunningly realistic light scattering with configurable extinction and phase parameters that give you artistic control over how light interacts with the atmosphere. The system supports both directional and spot light sources, and takes full advantage of WebGPU compute shaders for optimal performance. WebGL 2 is also supported with graceful fallbacks. Whether you're building a moody dungeon crawler, a foggy forest, or an atmospheric architectural visualization, Volumetric Lighting brings your scenes to life.

![Volumetric Lighting](volumetricLighting.png)

Check out a demo: [https://aka.ms/babylon9vlDemo](https://aka.ms/babylon9vlDemo)

Learn more: [https://aka.ms/babylon9vlDoc](https://aka.ms/babylon9vlDoc)

---

## **Frame Graph**

One of the most transformative features in Babylon.js 9.0 is the Frame Graph system. Introduced as an alpha feature in 8.0 under the name "Node Render Graph," the Frame Graph is now a fully realized v1 feature that gives you complete, fine-grained control over the entire rendering pipeline.

A Frame Graph is a Directed Acyclic Graph (DAG) where each node represents a rendering task — from object culling to post-processing. You declare what resources each task needs and produces, and the system intelligently manages texture allocation, reuse, and optimization. This means substantial GPU memory savings (we've seen 40% or more in some cases!) and a level of rendering flexibility that was simply not possible before. You can customize and compose your own rendering pipeline visually using the Node Render Graph Editor, or programmatically through the class framework — no more opaque render black boxes!

![Frame Graph](frameGraph.png)

Check out a demo: [https://aka.ms/babylon9FGDemo](https://aka.ms/babylon9FGDemo)

Learn more: [https://aka.ms/babylon9FGDoc](https://aka.ms/babylon9FGDoc)

---

## **Animation Retargeting**

Animation retargeting is a game-changer for anyone working with character animations. New in Babylon.js 9.0, the retargeting system allows you to take an animation created for one character and apply it to a completely different character — even if they have different skeleton structures, bone proportions, or naming conventions. The system mathematically remaps each animated bone transform from the source skeleton to the target, compensating for differences in reference pose, bone length, and hierarchy. This means you can share an entire library of locomotion, combat, or facial animations across many characters. An interactive Animation Retargeting Tool is also available for experimentation without writing any code!

![Animation Retargeting](animationRetargeting.png)

Check out a demo: [https://aka.ms/babylon9ARDemo](https://aka.ms/babylon9ARDemo)

Learn more: [https://aka.ms/babylon9ARDoc](https://aka.ms/babylon9ARDoc)

---

## **Advanced Gaussian Splat Support**

Babylon.js 7.0 introduced Gaussian Splatting, and Babylon.js 9.0 takes it to the next level. This release brings a host of advanced capabilities including support for multiple file formats (.PLY, .splat, .SPZ, and Self-Organizing Gaussians .SOG/.SOGS), Triangular Splatting for opaque mesh-like rendering, shadow casting support, and the ability to combine multiple Gaussian Splat assets into a single scene with global splat sorting. You can now programmatically create, modify, and download Gaussian Splat data, and each part of a composite splat scene can be independently transformed and animated. The result? Unprecedented flexibility for working with photorealistic volumetric captures on the web.

![Advanced Gaussian Splat Support](GaussianSplat.png)

Check out a demo: [https://aka.ms/babylon9GSDemo](https://aka.ms/babylon9GSDemo)

Learn more: [https://aka.ms/babylon9GSDoc](https://aka.ms/babylon9GSDoc)

---

## **Babylon.js Editor**

The Babylon.js Editor continues to evolve as a powerful desktop application for building Babylon.js experiences. Available on Windows, macOS, and Linux, the Editor provides a full scene editing environment with support for scripting, physics, asset management, and project building — all wrapped in a familiar, intuitive interface. With Babylon.js 9.0, the Editor receives updates and improvements to keep pace with the latest engine features.

![Babylon.js Editor](editor.png)

Check out a demo: [https://aka.ms/babylon9EditorDemo](https://aka.ms/babylon9EditorDemo)

Learn more: [https://aka.ms/babylon9EditorDoc](https://aka.ms/babylon9EditorDoc)

---

## **Inspector v2**

We are excited to introduce Inspector v2 — a ground-up rebuild of Babylon's beloved debugging and inspection tool. The new Inspector features a modern, extensible architecture built on a service-oriented model with full React-based UI components. It supports overlay and inline layout modes, light and dark themes, and is fully extensible through static and dynamic extensions. Developers can now add custom panes, toolbar items, property editors, and debug views — all through a clean, well-documented API. Inspector v2 is a massive step forward for developer experience and tooling in Babylon.js.

![Inspector v2](inspectorV2.png)

Check out a demo: [https://aka.ms/babylon9iv2Demo](https://aka.ms/babylon9iv2Demo)

Learn more: [https://aka.ms/babylon9iv2Doc](https://aka.ms/babylon9iv2Doc)

---

## **Babylon Viewer Updates**

The Babylon.js Lightweight Viewer, introduced in 8.0, continues to receive enhancements in 9.0. The Viewer makes it easy to embed stunning 3D content on any web page with just a few lines of HTML. This update brings expanded attribute support, new rendering options including SSAO and tone mapping controls, improved environment and skybox configuration, and enhanced animation and interaction controls. Whether you need a quick product showcase or a fully interactive 3D embed, the Viewer has you covered.

![Babylon Viewer Updates](imageOfShame.png)

Check out a demo: [https://aka.ms/babylon9VDemo](https://aka.ms/babylon9VDemo)

Learn more: [https://aka.ms/babylon9VDoc](https://aka.ms/babylon9VDoc)

---

## **Playground Updates**

The Babylon.js Playground — the beloved online sandbox for experimenting with Babylon.js — receives quality-of-life updates in 9.0. With features like `CTRL+Space` code templates for quickly inserting common code patterns, the ability to host your own snippet server for private and authenticated content, and improved support for external asset loading, the Playground continues to be the fastest way to prototype, share, and learn Babylon.js.

![Playground Updates](playground.png)

Check out a demo: [https://aka.ms/babylon9PGDemo](https://aka.ms/babylon9PGDemo)

Learn more: [https://aka.ms/babylon9PGDoc](https://aka.ms/babylon9PGDoc)

---

## **Geospatial Camera**

Babylon.js 9.0 introduces the all-new Geospatial Camera — a purpose-built camera designed for orbiting a spherical planet. It provides map-like interactions right out of the box: drag to pan the globe, scroll to zoom toward the cursor, and right-click to tilt. The camera uses an ECEF (Earth-Centered, Earth-Fixed) coordinate system and is not tied to Earth specifically — you can supply any planet radius to orbit any spherical body! It comes with configurable limits, smooth animated flights via `flyToAsync`, collision detection, and automatic clip plane adjustment based on altitude. This camera is the foundation for a whole new class of geospatial web experiences.

![Geospatial Camera](geoSpatialCamera.png)

Check out a demo: [https://aka.ms/babylon9GSCDemo](https://aka.ms/babylon9GSCDemo)

Learn more: [https://aka.ms/babylon9GSCDoc](https://aka.ms/babylon9GSCDoc)

---

## **3D Tiles Support**

3D Tiles is an open standard created by Cesium and adopted by the Open Geospatial Consortium (OGC) for streaming massive, heterogeneous 3D geospatial datasets. Babylon.js 9.0 brings 3D Tiles support through integration with the NASA/AMMOS 3DTilesRendererJS library, which handles tile set traversal, level-of-detail selection, and tile loading. This enables efficient visualization of enormous datasets — photogrammetry, 3D buildings, terrain, and point clouds — loaded on demand based on the camera's position. Paired with the new Geospatial Camera, this opens the door to stunning geospatial web applications.

![3D Tiles Support](3DTiles.png)

Check out a demo: [https://aka.ms/babylon93DTDemo](https://aka.ms/babylon93DTDemo)

Learn more: [https://aka.ms/babylon93DTDoc](https://aka.ms/babylon93DTDoc)

---

## **Large World Rendering**

When working with very large world coordinates, 32-bit floating point numbers lose precision, causing visible jittering — meshes wobble, shadows flicker, and animations stutter. Babylon.js 9.0 solves this with a comprehensive Large World Rendering / Floating Origin system. By keeping the active camera conceptually at the world origin and offsetting all geometry and shader uniforms, no matter how far you travel, the values sent to the GPU are always small and precise. The system also integrates with Havok physics through a multi-region architecture that distributes physics bodies across multiple simulation regions, each with its own floating origin. From flight simulators to space games to geospatial applications — large world rendering is now a first-class citizen in Babylon.js.

![Large World Rendering](largeWorld.png)

Check out a demo: [https://aka.ms/babylon9LWDemo](https://aka.ms/babylon9LWDemo)

Learn more: [https://aka.ms/babylon9LWDoc](https://aka.ms/babylon9LWDoc)

---

## **Physically Based Atmosphere**

Babylon.js 9.0 introduces a stunning Physically Based Atmosphere addon that provides realistic sky and aerial perspective rendering, supporting views from ground to space. Using physically accurate Rayleigh and Mie scattering models, along with ozone absorption and multiple scattering, the atmosphere produces breathtaking sunrises, sunsets, and day-night cycles. It integrates seamlessly with PBR materials and directional lights, and supports customizable scattering parameters to create atmospheres for any planet — from Earth to entirely alien worlds. The addon is available as a lightweight, opt-in package.

![Physically Based Atmosphere](atmospheric.png)

Check out a demo: [https://aka.ms/babylon9ATMDemo](https://aka.ms/babylon9ATMDemo)

Learn more: [https://aka.ms/babylon9ATMDoc](https://aka.ms/babylon9ATMDoc)

---

## **OpenPBR Support**

Babylon.js 9.0 begins implementation of OpenPBR — an open standard developed by Autodesk and Adobe that defines an artist-friendly, interoperable material model. OpenPBR is designed so that materials authored with it look consistent across any platform that supports the standard. Babylon.js now maps many of the OpenPBR parameter groups — including Base, Specular, Coat, Thin-film, and more — to the existing PBR material system. This is a significant step toward industry-wide material interoperability and ensures that Babylon.js stays at the forefront of rendering standards.

![OpenPBR Support](openPBR.png)

Check out a demo: [https://aka.ms/babylon9OPBRDemo](https://aka.ms/babylon9OPBRDemo)

Learn more: [https://aka.ms/babylon9OPBRDoc](https://aka.ms/babylon9OPBRDoc)

---

## **Dynamic IBL Shadows**

Image-Based Lighting (IBL) has been a cornerstone of Babylon.js rendering for years, and in version 9.0, IBL gets even better with Dynamic IBL Shadows. Building on the IBL Shadow feature first introduced in 8.0 by our friends at Adobe, this update brings enhanced, dynamic environment shadows that respond to changes in lighting conditions in real time. Both light and shadow for the scene environment can now be approximated from a source image with greater fidelity and flexibility than ever before.

![Dynamic IBL Shadows](IBLShadows.png)

Check out a demo: [https://aka.ms/babylon9IBLSDemo](https://aka.ms/babylon9IBLSDemo)

Learn more: [https://aka.ms/babylon9IBLSDoc](https://aka.ms/babylon9IBLSDoc)

---

## **Signed Distance Field Text**

Rendering crisp, scalable text in 3D environments has always been a challenge. Babylon.js 9.0 introduces Signed Distance Field (SDF) text rendering — a technique that produces resolution-independent, beautifully smooth text at any size or zoom level. Unlike traditional bitmap fonts that become blurry or pixelated when scaled, SDF text maintains sharp edges and clean outlines no matter how close you get. This is perfect for in-world UI, labels, signage, HUD elements, and any scenario where readable text needs to exist in 3D space.

![Signed Distance Field Text](sdf.png)

Check out a demo: [https://aka.ms/babylon9sdfDemo](https://aka.ms/babylon9sdfDemo)

Learn more: [https://aka.ms/babylon9sdfDoc](https://aka.ms/babylon9sdfDoc)

---

## **Outline Renderer**

Babylon.js 9.0 introduces a new Outline Renderer that makes it easy to add stylized outlines to meshes in your scene. Whether you're building a cartoon-shaded world, highlighting selected objects, or creating a technical visualization, the Outline Renderer provides clean, customizable outlines that integrate seamlessly with the rest of the rendering pipeline.

![Outline Renderer](imageOfShame.png)

Check out a demo: [https://aka.ms/babylon9OLDemo](https://aka.ms/babylon9OLDemo)

Learn more: [https://aka.ms/babylon9OLDoc](https://aka.ms/babylon9OLDoc)

---

## **Nav Mesh Updates**

Navigation meshes are essential for pathfinding and AI movement in games and simulations. Babylon.js 9.0 brings updates to the Nav Mesh system, improving the accuracy, performance, and ease of use of navigation mesh generation and agent pathfinding. Whether you're building an RTS, an open-world exploration game, or an architectural walkthrough, updated nav mesh capabilities make it easier than ever to get your characters and agents moving intelligently through your scenes.

![Nav Mesh Updates](navMesh.png)

Check out a demo: [https://aka.ms/babylon9NMDemo](https://aka.ms/babylon9NMDemo)

Learn more: [https://aka.ms/babylon9NMDoc](https://aka.ms/babylon9NMDoc)

---

## **Audio Engine Updates**

Sound is a critical part of any immersive experience, and Babylon.js 9.0 continues the evolution of the audio engine that was overhauled in 8.0. This release brings further refinements, expanded features, and improved API ergonomics aligned with modern web-audio standards. The modular audio engine makes it easier than ever to add spatial audio, ambient soundscapes, and interactive sound effects to your Babylon.js experiences.

![Audio Engine Updates](audio.png)

Check out a demo: [https://aka.ms/babylon9AudioDemo](https://aka.ms/babylon9AudioDemo)

Learn more: [https://aka.ms/babylon9AudioDoc](https://aka.ms/babylon9AudioDoc)

---

## **What's Next?**

Babylon.js 9.0 is our most ambitious release yet, and we couldn't be more excited to put it in your hands. Every feature, optimization, and tool in this release was built with one goal in mind: empowering you to create the most beautiful, performant, and interactive web experiences imaginable.

As always, Babylon.js is completely free and open source. We invite you to dive in, explore the new features, and share what you create with the community.

Welcome to Babylon.js 9.0. Let's build something amazing together.

🚀 [Babylon.js](https://www.babylonjs.com) | [Documentation](https://doc.babylonjs.com) | [GitHub](https://github.com/BabylonJS/Babylon.js) | [Forum](https://forum.babylonjs.com)
