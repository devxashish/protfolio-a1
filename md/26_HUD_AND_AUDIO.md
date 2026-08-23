# PERSISTENT HUD & AUDIO ENGINE (STEP 5)

## 1. THE PERSISTENT HUD
- **Replacement:** The legacy HTML overlay (with text, grid, and navigation) was completely removed.
- **Implementation:** A minimal, lightweight HUD (`#hud-container`) was built inside `index.html`. It sits permanently on top of the WebGL canvas, providing subtle contextual branding and technical system status ("SYS_ONLINE") at the absolute edges of the screen, preserving maximum visual space for the 3D cinematic.
- **Audio Control:** Embedded in the HUD is a stark, terminal-like button (`[ SOUND: OFF ]`). It relies entirely on native browser user-interaction rules (No Autoplay), explicitly waiting for user intent before allocating an `AudioContext`.

## 2. THE AUDIO ENGINE (WEB AUDIO API)
- **Room Tone:** Uses a 55Hz sine wave oscillator to simulate the heavy low-end acoustic resonance of a concrete/steel brutalist space.
- **Rain Spatialization:** Uses a continuous noise buffer passed through a bandpass filter. By tracking the `camera.position.z`, the volume dynamically ramps up as the visitor approaches the cracked exit door (`Z=-75`), physically grounding them in the space.
- **Foley & Feedback:**
  - **Light Activation:** As physical tungsten bulbs turn on during proximity approach, a sharp square-wave chirp provides mechanical feedback.
  - **Footsteps:** A dynamic calculation measures the camera's translation velocity (`targetZ - currentZ`). If moving continuously, a low-frequency thump triggers rhythmically to simulate physical footsteps on concrete.
  - **Project Hover/Click:** Hovering over interactive objects generates a subtle sine sweep; clicking triggers a heavier triangle drop.
- **Performance:** Relies entirely on the native Web Audio API (`OscillatorNode`, `GainNode`, `BiquadFilterNode`). Zero external MP3/WAV files were loaded, ensuring a 0kb network footprint for audio assets.
