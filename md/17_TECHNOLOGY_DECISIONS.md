# TECHNOLOGY DECISIONS (POST-ARCHITECTURE RE-EVALUATION)

After mapping the spatial and interactive experience, the technology stack must be strictly evaluated. Do NOT add technologies just because they are impressive.

## REQUIREMENTS EVALUATION

**1. Do we need Three.js?**
*Decision: YES.* The requirement for physical lighting, spring-physics camera, and 3D artifacts (glass stacks, robotic arms) cannot be achieved via CSS 3D transforms.

**2. Do we need custom GLSL shaders?**
*Decision: YES (for Materials).* External textures are banned (to keep the repo size near 0 and maintain the single-file mindset). Procedural canvas textures look like "AI slop". To achieve raw, believable concrete and machined metal, we MUST use custom fragment shaders with GPU-calculated Perlin noise and physical lighting overrides.

**3. Do we need a physics engine (Cannon.js/Ammo)?**
*Decision: NO.* The interactions defined (Grab/Focus, Heavy Scroll Door) require *physics-based animation* (springs, inertia, friction), NOT full rigid-body collision simulation. A lightweight custom spring dampener in Vanilla JS is sufficient and vastly cheaper on performance.

**4. Do we need GSAP/Framer Motion?**
*Decision: NO.* Vanilla JS `requestAnimationFrame` with exponential decay (`current += (target - current) * friction`) creates the exact heavy, tactile feel required without the 80kb overhead.

**5. Do we need Post-Processing (EffectComposer)?**
*Decision: YES, but conditional.* The "WOW" factor requires bloom on the tungsten lights and emissive screens, and potentially subtle depth of field. This will be implemented, but strictly disabled on mobile devices to protect battery and thermal limits.

## PERFORMANCE RISKS
1. **Custom Shaders:** High-frequency procedural noise in fragment shaders can kill mobile GPUs. Must optimize the noise functions.
2. **Post-Processing:** Bloom requires multiple render passes. Destroys fill-rate on low-end phones.
3. **Geometry Complexity:** Artifact models (e.g., robotic arm, desk) must be procedurally generated via code. High segment counts will explode vertices. Must use low-poly with smooth shading.
