# ENTRY SEQUENCE IMPLEMENTATION (STEP 1)

## 1. ENTRY IMPLEMENTATION DECISIONS
- **Shadow Typographic Reveal:** Implemented using a highly performant `THREE.PlaneGeometry` serving as an invisible shadow-mask (`colorWrite: false`, `depthWrite: true`). The mask has an alpha map spelling "ASHISH" generated dynamically via a 2D HTML Canvas. This avoids massive external font files or heavy 3D text geometry.
- **Modularity:** The entry logic is fully encapsulated in `src/3d/entry.js` (`EntrySequence` class) which hooks cleanly into the `app.js` render loop, ensuring the main architecture remains untouched.

## 2. CAMERA TIMELINE
- **T=0:** Locked at `Z=16, Y=1.7`. Controller explicitly disabled.
- **T=Interaction:** The sequence begins.
- **T=Progress (0 to 1):** The camera smoothly drifts forward to `Z=15` and slightly down to `Y=1.5` over exactly 4.0 seconds.
- **T=Completion:** Camera is unlocked, target Z is fixed at 15. Control is handed back seamlessly.

## 3. LIGHTING STATES
- **Initial:** Ambient, Directional, Exterior, and Tungsten lights are overridden to `0` intensity. Scene relies entirely on `FogExp2(0x020202)` for perceived darkness.
- **Reveal:** A single `THREE.SpotLight` sweeps from `X=-8, Z=8` to `X=0, Z=4`, its intensity blooming from `0` to `150`.
- **Handoff:** Original global lighting intensities are restored. Tungsten corridor lights are permitted to naturally fade in based on proximity logic.

## 4. REVEAL TIMING
- Total duration is mapped to a `4.0` second continuous easing function (`easeInOutQuad`), representing "natural visual timing".
- The subtitle ("SOFTWARE ENGINEER") fades in late (at 70% progress) so it doesn't distract from the physical shadow discovery.

## 5. PERFORMANCE DECISIONS
- **No Volumetric Raymarching:** The light beam uses standard Three.js shadow mapping (PCFSoftShadowMap) interacting with a simple alpha plane. It achieves the cinematic shadow effect at a fraction of the GPU cost.
- **Lightweight Dust:** The dust uses a simple `THREE.Points` geometry with only 200 vertices, manipulated directly in a Float32Array during the render loop. No heavy particle engine was imported.

## 6. MOBILE FALLBACK
- Interaction is triggered uniformly by listening to `touchstart` alongside `click` and `wheel`. 
- The overlay effectively disables native DOM scrolling/pull-to-refresh during the intro.
- Skip behaviour instantly snaps values without relying on animation frame interpolation, guaranteeing a 0-frame delay on weak mobile devices.

## 7. KNOWN LIMITATIONS
- **Shadow Resolution:** The shadow map is hardcoded to 1024x1024. On very low-end devices, the shadow edges spelling "ASHISH" might appear slightly aliased. 
- **Font Availability:** The 2D canvas relies on the system `sans-serif` font to generate the shadow mask. If a system has a bizarre default sans-serif font, the shadow typography might look unexpectedly stylized. (Can be mitigated in the future by pre-loading a standard woff2 font).
