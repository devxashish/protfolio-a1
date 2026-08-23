# STORY & SKILLS ENVIRONMENTS (STEP 4)

## 1. STORY (THE ARCHIVES)
- **Location:** `Z = -40` (Right branch).
- **Physical Integration:** Transition from cold concrete to warm wood flooring signals a shift from technical engineering to personal ethos.
- **The Artifact:** A massive, tilted wooden architectural drafting table. 
- **The Blueprint:** Instead of placing the "About Me" text in a standard DOM overlay, it is physically drafted onto a cyanotype blueprint baked directly into a `THREE.CanvasTexture` (`src/3d/blueprints.js`). This creates an immersive, diegetic storytelling experience.
- **Interaction:** The table is registered to the `Projects` interaction manager. Clicking it triggers the camera to swoop into Focus Mode, hovering tightly over the blueprint at a 45-degree angle. A minimal `[ BACK TO SPINE ]` DOM button appears to exit.

## 2. SKILLS (THE ARMORY)
- **Location:** `Z = -50` (Left wall recess).
- **Physical Integration:** Recessed into the concrete wall to avoid cluttering the primary corridor. 
- **The Artifact:** Industrial server racks with pulsing LED indicators.
- **Narrative Purpose:** Reinforces the engineering narrative. Skills are portrayed as physical tools of the trade, not arbitrary percentage bars. They are ingested passively as the visitor walks toward the exit.
