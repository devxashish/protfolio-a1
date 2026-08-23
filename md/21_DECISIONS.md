# DECISIONS — LOCKED SO FAR

| Decision | Reason | Alternatives considered | Owner approval needed? |
|---|---|---|---|
| Structure: Home/About/Projects/Skills/Contact as environments, not pages | Matches "living world, not website" brief | Traditional multi-page site (rejected — too conventional) | No — confirmed |
| World: real day/night cycle + weather (rain), as first environment in a larger living digital world | Owner-stated preference + master-prompt broadening | Locking to one static room (rejected — too limited) | No — confirmed |
| Symbolic core: bearing weight alone, staying upright | Owner's own answer to "what one moment represents you" | — | No — confirmed |
| Depth of that symbolic story shown publicly | Owner decided: private, tone-only, never written/spoken to visitors | Full 3-way reveal (previous default) — superseded | No — confirmed |
| Navigation: guided path with branch-off choice points | Owner's own choice (option C) | Free-roam hub, pure linear scroll | No — confirmed |
| Physics: real/tactile only (grab-tear, light-reveal), never decorative | Matches owner's reference sites + master-prompt rule | Physics-everywhere (rejected — no purpose without reason) | No — confirmed |
| Camera: reveals a pre-existing 3D world on scroll/interact | Owner's own description | Timeline-based cutscene camera (rejected) | No — confirmed |
| Materials: raw wood/stone + weathered metal proposed; glass/liquid sparing | Claude's proposal per owner's delegation | Full material list (glass/cloth/liquid) (deferred, not rejected) | Soft — confirm in Phase 3 |
| Color: black/white structural base + semantic multi-color accent system | Owner's own base preference + master-prompt correction (no longer locked to one accent) | Single fixed accent (superseded) | Soft — exact hues in Phase 3 |
| Typography: mix of 2–3 faces | Owner's own choice | Single typeface system (rejected) | Soft — exact faces in Phase 3 |
| Sound: atmospheric/ambient only, mutable, no click/tap sounds | Owner's own choice | Interactive per-click sound (rejected) | No — confirmed |
| Skills: mix of workshop-style physical presentation + story-driven reveal | Owner's own choice | Traditional bars/percentages (rejected) | No — confirmed |
| Contact: WhatsApp + book-a-call + email, always reachable | Owner's own choice | Single-channel contact (rejected) | No — confirmed |
| Projects: live artifacts (APK/URL/EXE), no screenshot galleries | Owner's own stated dislike of screenshots | Screenshot gallery (rejected) | No — confirmed |
| Project list: GET UNZIP, MS Security, Atlas UI, future projects (owner has 4–6+ ideas), portfolio itself | Master prompt update + owner confirmation | Previous list (MAXBOND + MS Security only) — superseded | No — confirmed |
| MAXBOND excluded from public portfolio | Master prompt explicit instruction | Including it as origin story (previous default) — superseded | No — confirmed, reversible only if owner asks |
| MS Security shown on technical merit only, no client/payment story | Owner's own instruction | Including the unpaid story for authenticity (rejected by owner) | No — confirmed |
| Easter eggs: yes, at guided-path branch points | Owner's own choice | No hidden content (rejected) | No — confirmed |
| Performance: mobile is the floor, scales up on capable devices | Owner's own priority, reflects his own mobile-only workflow | Fixed single-tier experience (rejected) | No — confirmed |
| Accessibility: reduced-motion fallback required | Owner's own choice | No fallback (rejected) | No — confirmed |
| Scalability: optimize for current project set, not future-proofed | Owner's own choice | Build for infinite scale now (rejected — premature) | No — confirmed |
| Technology stack | Not yet chosen — process locked (see 17_TECHNOLOGY_DECISIONS.md) | — | **YES — Phase 4** |
| Foundation Tech Stack | Plain HTML/CSS/Vanilla JS (No build step) | Fits mobile-only authoring constraint perfectly, avoids bundler container errors, maximizes maintainability. | No — established for Phase 1 |

| Phase 3 Color System | Base: Concrete/Stone (Grayscale), Accent: Tungsten/Amber (#b45309 day, #d97706 night) | Directly matches raw materials and real "light-on" room behavior. Avoids generic "tech orange" by keeping it muted and deeply integrated with shadows. | No — established |
| Phase 3 Materials | Pure CSS physical shapes, Stark borders, No textures | Decided against SVG noise filters as they risk feeling cheap/AI-generated. Selected stark, architectural borders and realistic cast shadows for weight. | No — established |
| Phase 3 Interactions | 1D Spring Grab/Drag on Projects, Intersection Light-on reveal | Fully vanilla JS pointer-events for physics. Lightweight, mobile-compatible, accessible via focus. | No — established |
| Phase 3 Accessibility | Semantic focus-visible, main.js focus-shifting | Solves screen-reader internal navigation gaps while maintaining the aesthetic without outline-soup. | No — established |

*(A single status column isn't used here since this is a living document
updated in place — every row above reflects the current state as of this
session.)*
