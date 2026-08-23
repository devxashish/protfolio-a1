# WORLD DESIGN
*(covers World, Physics, Materials, Motion, Camera, Lighting, and Sound
systems — grouped together as one interaction language; see 00_AUDIT.md)*

## World type — a living digital world
Not locked to a single literal room. The world is a **living digital
world**: a personal environment is the first space the visitor enters, but
the concept can expand into other environments or "dimensions" for
different sections (a project space, an about space, a skills space, a
contact space) — all part of one continuous world, not separate pages.

The foundation of that first (and likely recurring) environment is a
**physically real atmosphere** — a real-life day/night cycle, including
weather (rain confirmed as wanted); light, shadow, and mood shift the way
they would outdoors. On top of this realism sits one additional
symbolic/extra layer (still open — see Open Questions) that keeps the
world from reading as a plain simulation.

## Reference interactions (from the person's own taste)
Two references were given, both instructive:
1. **A site where any section can be physically grabbed and torn**, with
   real physics — not decorative animation, but a section that responds
   like an actual physical object would.
2. **A room-environment portfolio where the visitor walks in and turns the
   light on**, with realistic light behavior.

Both share a pattern: **physics and light are the interaction**, not a
layer on top of static content. This is the direction for this world —
interactions should feel like manipulating something real, not triggering
a pre-baked animation.

## Symbolic moment — the weight
The opening (and recurring motif) should carry the idea of someone bearing
weight alone and holding steady under it. Concretely, this suggests
**gravity, load-bearing, and balance** as the physics vocabulary — an
object (or the "camera-self") is under real weight, and the visitor
watches it stay upright, supported, in control. This should read as
quiet strength, not struggle. This motif is expressed purely
atmospherically — see 01_PORTFOLIO_VISION.md, "Symbolic core" — no text
anywhere states the underlying family story.

Rain (from the weather-cycle requirement) can be timed to reinforce this
moment rather than sit as generic ambiance — weather as emotional
punctuation, used sparingly.

## Physics system
Physics is used only where it serves storytelling, material realism,
navigation, or the symbolic weight-bearing motif — never decoratively.
Every physics interaction, once designed in Phase 3, should be documented
against this template:

- **What** — the interaction
- **Why** — the reason it exists (never "looks cool" alone)
- **Material** — what it's made of
- **User action** — what the visitor does
- **Physical response** — what happens, in physical terms
- **Cinematic purpose** — what it communicates emotionally/narratively
- **Performance cost** — rough weight of the interaction
- **Mobile behavior** — how it adapts on phones
- **Fallback behavior** — reduced-motion / low-power version

Two interactions are already implied by the owner's own reference sites
and should be the first candidates for this template in Phase 3:
1. A **grab/tear interaction** on sections — real physics response, not a
   canned animation.
2. A **light-on reveal** — walking into a space and having light behave
   realistically as it turns on, tied to the day/night system.

Anything not clearly serving story, navigation, or realism should default
to plain CSS/JS, not a physics engine.

## Material system
Given the resilience / self-built / no-shortcuts narrative:
- **Raw, unfinished wood or stone** — visibly shaped over time rather than
  factory-smooth. Fits "self-taught, built alone."
- **Weathered metal** (brushed, worn at the edges, not chrome-shiny) for
  precision-oriented moments (skills, security work).
- Glass and liquid used sparingly if at all — they read as fragile/soft,
  which works against the resilience theme; reserved only for a specific
  moment that calls for transparency or fluidity, not a default material.

This is a proposal (Claude's judgment, as requested) — to be confirmed in
Phase 3 against the finalized color and lighting systems.

## Motion & camera system
Motion should always read as **revealing something that already exists**,
not "playing an animation." Concretely:
- Camera position/depth is driven by real scroll or interaction input, not
  a fixed timeline — the visitor's own movement uncovers the 3D space.
- Transitions between environments (e.g. personal space → project space)
  should feel like moving through a world, not cutting between pages.
- No motion exists purely for spectacle — every camera or object movement
  should map to either navigation, storytelling, or physical realism.

## Lighting system
Lighting is a first-class system, not a cosmetic layer, given the
"walk in and turn the light on" reference:
- Day mode: natural, higher-contrast light, closer to real daylight
  behavior.
- Night mode: light sources read as deliberate — turning a light on is an
  event, not ambient fill.
- Weather (rain) should visibly affect lighting — diffused, moodier light
  during rain versus clear conditions.
- Lighting and the color system are linked (see 10_COLOR_TYPOGRAPHY_SYSTEM.md)
  — accent colors are expected to shift in how they read under day vs.
  night lighting rather than being flat, fixed values.

## Navigation model
A **guided path with choice points** — a linear throughline so no visitor
gets lost or has to hunt for the way forward, but with moments where the
visitor can branch off to explore (a project in more depth, a skill, an
easter egg) before rejoining the path. This matches the "intuitive but
surprising" requirement from the brief — never a maze, but never flatly
linear either.

## Sound
Atmospheric/ambient only — rain, wind, distant tone, room-tone shifts
between day and night. No interactive click/tap sounds. Sound must be
user-controllable (mute) and never autoplay aggressively.

## Easter eggs
Confirmed wanted. To be placed at branch points in the guided-path
navigation (see above) — rewarding curiosity without ever being required
to understand the core content.

## Performance & accessibility
See 15_DEVICE_BEHAVIOR.md for the full performance, desktop/mobile
mapping, and accessibility spec — not duplicated here to avoid drift.

## Scalability
Not a current priority for the *world's technical architecture* — build
the world to be right for the current public project set (GET UNZIP, MS
Security, Atlas UI, this portfolio itself) rather than over-engineering
for hypothetical future content. That said, the owner has ideas for 4–6+
future projects, so the project-presentation pattern (live demo +
narrative framing, see 18_PROJECT_CONTENT_PLAN.md) should stay easy to
repeat per-project even though the world itself isn't being built for
infinite scale right now.
