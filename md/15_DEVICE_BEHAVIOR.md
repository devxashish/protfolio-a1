# DEVICE BEHAVIOR & INTERACTION MODEL

Mobile is NOT a reduced desktop version. The experience should feel physical on touch.

## CAMERA LANGUAGE & THE ENTRY SEQUENCE
- **Initial Framing:** Absolute darkness.
- **Trigger:** On desktop, any mouse click or scroll. On mobile, the first tap or swipe.
- **Cinematic Movement:** Natural visual timing (approx. 2-4 seconds) while light reveals the Identity shadows.
- **Skip Behavior:** Immediately jumps the camera to the exact final post-reveal coordinates and snaps all lighting to 100% active. The environment state is absolutely identical to naturally watching the intro.
- **Look-At Behavior:** "Soft Magnetism" smoothly rotates the camera toward projects when approaching Z bounds.

---

## INTERACTION MAPPING (DESKTOP -> MOBILE)

| INTERACTION | DESKTOP BEHAVIOR | MOBILE BEHAVIOR | NOTES |
| :--- | :--- | :--- | :--- |
| **Intro Trigger** | Mouse click / Scroll | Screen Tap / Swipe | First input wakes the environment. |
| **Move Forward/Back** | Mouse Wheel / Trackpad Scroll | Vertical Swipe (Drag up/down) | Maps to Z-axis translation. Heavy friction on mobile. |
| **Look Around** | Mouse Click & Drag (Horizontal) | Horizontal Swipe (Left/Right) | Deadzone prevents accidental rotation during vertical walking. |
| **Micro-Parallax** | Mouse Move | Unmapped (Static) | Gyroscope requires permissions and is often janky. Disabled by default. |
| **Artifact Focus** | Click / Pointer | Tap | Triggers the spring-physics camera zoom. |
| **Contact Action** | Standard Click on Terminal | Standard Tap on Terminal | Completely effortless conversion. No physics puzzles to contact the owner. |

## ACCESSIBILITY & FALLBACK
- **Reduced Motion:** If `(prefers-reduced-motion: reduce)` is detected, the entire 3D world is disabled. The site gracefully falls back to the high-polish 2D DOM portfolio implemented in Phase 5.
- **WebGL Failure:** Identical fallback to the 2D DOM portfolio.
- **Performance:** Excessive effects (bloom, intense particles, camera shake) are explicitly banned to guarantee flawless mobile rendering and battery preservation.
