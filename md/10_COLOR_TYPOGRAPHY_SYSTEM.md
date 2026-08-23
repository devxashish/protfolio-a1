# COLOR & TYPOGRAPHY SYSTEM

## TYPOGRAPHY IN THE PHYSICAL WORLD

ASHISH must become part of the physical world. Generic neon signage is rejected. 

**Identity Signage:**
The name will be executed as **Architectural Lettering**. Specifically, massive cast concrete lettering recessed into the central load-bearing pillar at `Z=0`. 
- **Method:** Boolean subtraction from the pillar geometry, or deep bump/normal mapping via shader.
- **Lighting:** A single, sharp tungsten uplight grazing the letters to create dramatic architectural shadows, revealing the name through light and shadow rather than a flat color.

**Information Typography (Projects/Story):**
- **Method:** Engraved machined metal (for project specs) and printed blueprints (for problem/solution text). 
- **Font:** Bebas Neue for structural/monumental text. Inter for readable blueprint specs. Rendered via high-res `CanvasTexture` mapped to planes with anisotropic filtering.

## COLOR & LIGHTING SYSTEM
No gradients. No vibrant UI colors in the environment.

**The Palette:**
- **Base Environment:** `#111111` to `#2a2a2a` (Raw, dark concrete).
- **Metals:** `#1a1a1a` with high specular reflectance.
- **Warmth (Wood):** `#3d2817` (Used strictly in the Story branch to indicate human presence).
- **Key Light (Tungsten):** `#ffaa44` (Used to guide navigation and highlight the Identity).
- **Exterior Light:** `#4466aa` (Used to frame the Exit/Contact door).

The colors of the environment are derived *purely* from the lights interacting with material roughness and metalness. There is no diffuse color variation.
