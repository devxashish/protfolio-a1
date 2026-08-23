# DEVICE BEHAVIOR SYSTEM
*(covers Performance, Accessibility, and Responsive strategy together —
grouped as one "how the experience adapts to the device" concern)*

## Performance
Mobile is the floor, not the ceiling — fitting, since the owner himself
builds entirely from a mobile phone. The experience must never break or
stutter on an average phone; it should scale UP in fidelity (richer
physics detail, more elaborate lighting) on devices that can handle it,
never scale down into breakage.

## Desktop ↔ mobile interaction mapping
Same core experience on both, different input methods:

| Desktop action | Mobile equivalent |
|---|---|
| Mouse hover | Tap / long-press reveal |
| Scroll (wheel) | Scroll (touch drag) |
| Click-drag (grab/tear) | Touch-drag |
| Keyboard shortcuts (if any) | On-screen equivalent controls |

Desktop and mobile are not "full version vs. lite version" — they are the
same world experienced through different hands. Implementation strategy
can differ (e.g. simplified physics calculation on mobile), but the
visitor should never feel like they got a lesser experience just because
they're on a phone.

## Accessibility
A **reduced-motion fallback** is required — for motion-sensitive visitors
and screen readers. This is not a stripped-down experience; it's an
equally complete but calmer path through the same content:
- Physics-driven reveals replaced with simple, immediate state changes
- Camera-driven depth replaced with straightforward scroll-based layout
- All content (story, projects, skills, contact) remains fully reachable
- Respects the OS-level `prefers-reduced-motion` setting as the trigger

Exact implementation is a Phase 3/4 decision once the primary motion
system is finalized — but the requirement itself is locked.
