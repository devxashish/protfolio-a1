# OPEN QUESTIONS & REQUIRED APPROVALS

Before Phase 6.7 begins, the owner must approve the following architectural decisions:

**1. Shadow Typographic Reveal**
*Proposal:* The identity reveal relies on a dynamic spotlight casting shadows from abstract concrete blocks that align to spell "ASHISH". 
*Requires Approval:* Does this meet the "Wait—that's ASHISH" moment of discovery, or is it too abstract?

**2. Story / About Branch**
*Proposal:* The right branch (`Z=-40`) leads to the "Archives", a warmer, wood-paneled space with drafting tables and blueprints containing the textual bio.
*Requires Approval:* What specific text should exist here?

**3. Performance Limits vs. Visual "WOW"**
*Proposal:* We implement custom GLSL shaders for materials and Post-Processing (Bloom) on Desktop to achieve the "premium agency" look, but disable Bloom on Mobile.
*Requires Approval:* Is the owner okay with Desktop looking significantly more cinematic than Mobile to preserve battery/FPS, or must they be 1:1 identical?
