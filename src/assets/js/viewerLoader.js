/**
 * Loads exactly one Babylon Viewer bundle for the page.
 *
 * The full and Lite bundles both call customElements.define("babylon-viewer"),
 * so they can never coexist: whichever loads second throws NotSupportedError.
 * Bundle choice is therefore a per-page, load-time decision rather than
 * something an individual <babylon-viewer> element can opt into.
 *
 * Selection order:
 *   1. ?viewer=lite / ?viewer=full query override (manual testing)
 *   2. LITE_ENABLED kill switch
 *   3. window.babylonViewerConfig.forceFull (set per page by base.njk)
 *   4. WebGPU adapter probe -> Lite when WebGPU is usable, full otherwise
 */

// Both bundles come from one release so the two flavors can never drift apart.
// 9.22.2 bundles Babylon Lite 1.24.0, which adds offscreen render suspension to
// Lite (BabylonJS/Babylon.js#18820) on top of the two blocking fixes that landed
// in Lite 1.23.0 (see LITE_ENABLED). When bumping, confirm the embedded Lite
// version from the release's package.json dependencies -- the minified CDN
// bundle does not carry a readable version stamp.
const VIEWER_VERSION = "9.22.2";

const CDN_ROOT = `https://cdn.jsdelivr.net/npm/@babylonjs/viewer@${VIEWER_VERSION}/dist/`;
const FULL_URL = `${CDN_ROOT}babylon-viewer.esm.min.js`;
const LITE_URL = `${CDN_ROOT}babylon-viewer-lite.esm.min.js`;

/**
 * Both defects that kept Lite disabled are fixed as of 9.22.1, which is the first
 * viewer release to bundle Babylon Lite 1.23.0:
 *
 * 1. Rendering: from 9.18.1 onward Lite loaded models but drew no geometry
 *    (BabylonJS/Babylon-Lite#572). Meshes whose material group was created after
 *    the scene was registered were queued and then silently discarded. Lite 1.23.0
 *    routes them to a runtime build instead, and reports failures rather than
 *    dropping them.
 * 2. Material variants: switching a KHR_materials_variants variant bound a texture
 *    from one viewer's GPUDevice onto another's, permanently blanking the canvas.
 *    Fixed by Lite 1.16.0.
 *
 * Reproducing 2 needs several viewers on the page, more than one of them using
 * material variants, and the switch on a viewer that is not the first. Two
 * viewers alone can miss it, which is why this looked version-specific at first.
 */
const LITE_ENABLED = true;

/**
 * Lite has no WebGL fallback of its own, and its engine calls
 * navigator.gpu.requestAdapter() without guarding navigator.gpu, so an
 * unsupported browser throws instead of degrading. Probe for a real adapter
 * before committing to Lite.
 */
async function supportsWebGPU() {
    if (!navigator.gpu) {
        return false;
    }

    try {
        return !!(await navigator.gpu.requestAdapter());
    } catch {
        return false;
    }
}

function getFlavorOverride() {
    const requested = new URLSearchParams(window.location.search).get("viewer");
    return requested === "lite" || requested === "full" ? requested : null;
}

async function chooseFlavor() {
    const override = getFlavorOverride();
    if (override) {
        return override;
    }

    if (!LITE_ENABLED) {
        return "full";
    }

    // Escape hatch for pages that depend on full-viewer-only behaviour. No page
    // currently sets it: /viewer/ needed it until Lite gained offscreen render
    // suspension, so stacked viewers no longer pay for the ones scrolled away.
    // Lite still ignores render-when-idle, which only matters for a page whose
    // visible viewers are genuinely static (no auto-orbit, no playing animation).
    if (window.babylonViewerConfig && window.babylonViewerConfig.forceFull) {
        return "full";
    }

    return (await supportsWebGPU()) ? "lite" : "full";
}

(async function loadViewer() {
    const flavor = await chooseFlavor();

    try {
        await import(flavor === "lite" ? LITE_URL : FULL_URL);
        window.__babylonViewerFlavor = flavor;
    } catch (error) {
        if (flavor !== "lite") {
            throw error;
        }

        // A rejected import means the Lite module never ran, so nothing was
        // registered yet and the full bundle can still claim the element.
        console.warn("Babylon Viewer: Lite bundle failed to load, falling back to the full viewer.", error);
        await import(FULL_URL);
        window.__babylonViewerFlavor = "full";
    }
})();
