# WORLD DESIGN & EXPERIENCE ARCHITECTURE

## PHASE 6.7 ARCHITECTURE SPECIFICATION (STORY, BRANCHING & NARRATIVE)

This specification defines the physical environments, transitions, and narrative logic for the entire portfolio world, ensuring it remains a professional portfolio rather than a puzzle game. 

### 1. STORY ENVIRONMENT (The Archives)
- **Concept:** A warmer, more intimate space branching off the brutalist main spine, representing the human element, self-taught journey, and underlying ethos.
- **Visual Language:** A shift from raw concrete to warm, aged wood and soft, low-hanging pendant lighting. 

### 2. STORY ENTRY TRANSITION
- **Logic:** Located at `Z = -40` as a right-hand branching path. 
- **Transition:** As the user scrolls into the branch zone, a soft, curved concrete wall gently occludes the main spine, physically guiding the camera into the Archives. 
- **Discoverability:** The Story branch is immediately visible from the main spine via warm light spilling out and clear architectural sightlines. The user is never forced to enter, but the visual cues naturally invite exploration.

### 3. STORY PHYSICAL OBJECTS
- **The Drafting Table:** A massive, tilted wooden architectural drafting table.
- **The Blueprints:** Scattered, overlapping cyanotype blueprints pinned to walls and resting on the table.

### 4. STORY INFORMATION ARCHITECTURE
- **Delivery:** Information is not presented as standard HTML paragraphs. It is physically drafted onto the blueprints. 
- **Content:** The text explains the "self-taught, built alone, resilient" narrative. It answers *how* Ashish thinks, not just what he does. The text is highly legible, high-contrast, and baked into anisotropic `CanvasTexture` planes.

### 5. STORY INTERACTION MODEL
- **Friction:** Camera momentum is subjected to higher friction upon entering the Archives to encourage observation.
- **Focus:** Clicking the drafting table triggers the spring-physics camera to gently pull in over the blueprints. An easy, obvious "BACK/EXIT" action is provided to return to the walking path without disorientation.

### 6. BRANCHING/NAVIGATION LOGIC
- **The Main Spine:** The un-missable central artery. Moving purely forward via Z-scroll guarantees the user will see every core capability. 
- **Discoverability:** Critical portfolio information is never invisible. Signage, light pooling, and object silhouettes ensure the user understands what lies in an alcove even from the main spine. 

### 7. SKILLS ENVIRONMENT (The Armory/Server Room)
- **Concept:** Skills are tools of the trade, not arbitrary percentages or giant tech logos.
- **Location:** Integrated directly into the walls of the Main Spine at `Z = -50`.
- **Physical Representation:** Recessed industrial server racks, technical drawings, code fragments, and blueprint annotations. Technology names are subtly integrated into physical computing elements rather than plastered as giant billboard logos. 

### 8. PROJECTS ENVIRONMENT (The Physical Portfolio)
- **Location:** Left branching alcoves off the Main Spine (`X = -10, Z varying`).
- **Physical Representation:** Each project has a bespoke artifact reflecting its nature (GET UNZIP = Workstation Desk; MS Security = Mobile device on robotic arm).
- **Information Layer:** Every project artifact provides clear, discoverable business information (What it is, What I built, Technology/Role, Key Capability, Live Demo). Clarity is never sacrificed for cinematic visuals.
- **Interaction (Focus Mode):** Intentional hover (subtle physical response) and click/tap to enter Focus Mode. Focus mode provides a clear visual hierarchy, readable project info, and a frictionless exit/back action without violent camera movement. Mobile accidental touches are safely ignored.

### 9. CONTACT/EXIT ENVIRONMENT (The Threshold)
- **Location:** The absolute end of the Main Spine (`Z = -75`).
- **Physical Representation:** A massive, heavy steel door, cracked open by an inch. Intense, cool daylight spills through the crack. Next to the door rests a sleek, illuminated communications terminal.
- **Conversion Strategy:** The final terminal is the premium cinematic CTA. However, contacting the owner *never* requires traveling to Z=-75. An unobtrusive, persistent CONTACT access mechanism (HUD layer) is available at all times. Both routes provide immediate, frictionless access to WhatsApp, Email, and Booking. No puzzles, no waiting.

### 10. TRANSITIONS BETWEEN ENVIRONMENTS
- **Seamless Continuity:** No loading screens or teleports. Every transition is physical camera movement. 

### 11. DESKTOP BEHAVIOR
- **Movement:** Mouse wheel / trackpad strictly drives the Z-axis. 
- **Look:** Click and drag allows looking.
- **Micro-Parallax:** Passive mouse movement shifts the camera slightly.

### 12. MOBILE BEHAVIOR
- **Movement:** Vertical swipe translates the camera with high friction.
- **Look:** Horizontal swipe rotates the camera (with deadzone).
- **Parallax:** Disabled by default to prevent battery drain.

### 13. ACCESSIBILITY / FALLBACK BEHAVIOR
- **Reduced Motion / WebGL Failure:** The 3D canvas is completely unmounted. The visitor experiences the high-polish, performant 2D DOM portfolio.

### 14. PERFORMANCE BUDGET
- **Strategy:** Performance > Polygon Count. Measured using frame time, FPS stability, draw calls, texture/GPU memory, shader complexity, and mobile thermal behavior. 
- **Graceful Degradation:** Desktop receives higher visual fidelity (bloom, soft shadows). Mobile receives a strictly optimized equivalent to guarantee smooth interaction on modern devices. 

### 15. CONVERSION / BUSINESS PURPOSE
- **Objective:** The portfolio must immediately establish Ashish as a high-tier software engineer. The cinematic layer attracts attention, the environmental storytelling creates memory, the portfolio information creates trust, and the CTA creates conversion. These four goals must perfectly coexist.

---

## THE WORLD EXPERIENCE MAP
The world is a single continuous architectural environment. Navigation is a guided path with distinct choice points.

**1. ENTRY STATE (The Void)**
- **LOCATION:** Z = 15
- **PURPOSE:** Establish mystery and "presence" before the visual reveal.
- **VISUAL LANGUAGE:** Perceived visual darkness (not a literal black screen). Extremely subtle depth and faint, slow-drifting atmospheric layers confirm the site has loaded.

**2. USER INTERACTION & ATMOSPHERIC REVEAL**
- **VISUAL LANGUAGE:** Upon first touch, the environment responds with a restrained physical disturbance. The atmosphere settles naturally. A single, focused, optimized light beam cuts through the darkness.

**3. IDENTITY REVEAL (The Discovery)**
- **LOCATION:** Z = 0
- **VISUAL LANGUAGE:** The light beam strikes a massive concrete structure. As the camera drifts and the light rotates, shadows cast by extruded concrete blocks lengthen and perfectly align to spell "ASHISH". 

**4. WORLD REVEAL & CONTROL HANDOFF**
- **VISUAL LANGUAGE:** Tungsten lights hum to life sequentially, revealing the Main Spine. 
