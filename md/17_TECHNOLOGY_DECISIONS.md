# TECHNOLOGY DECISIONS

## Status: DEFERRED — Phase 4

No technology has been chosen. This document exists to lock the *process*
by which technology will be chosen, so no tool gets picked just because
it's popular or "expected" for this kind of site.

## Decision process (mandatory for every major technical choice)
For each system (world rendering, physics, camera, motion, sound):

1. **Experience requirement** — what the visitor needs to feel/do
2. **Technical requirement** — what that implies technically
3. **Possible solutions** — candidate technologies
4. **Comparison** — trade-offs (performance, mobile behavior, complexity,
   maintainability given the owner currently builds from mobile only)
5. **Final decision** — with reasoning recorded in 21_DECISIONS.md

## Explicitly rejected reasoning patterns
- "Use React because it's popular"
- "Use Three.js because it's a 3D portfolio"
- "Use Framer Motion because we need animation"

None of these are valid justifications on their own. A technology is only
selected once the experience requirement it serves is documented.

## Known constraint that affects this phase
The owner builds and will likely continue building/maintaining this site
from a mobile device, with no laptop/PC currently available. This is a
real technical constraint that Phase 4 must weigh — not just runtime
performance for visitors, but authorability and maintainability for the
owner himself. This should be raised explicitly with the owner before any
stack is proposed.
