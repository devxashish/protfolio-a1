import fs from 'fs';
let content = fs.readFileSync('src/3d/app.js', 'utf8');

const oldAudio = `        if (this.audio && this.audio.enabled) {
            const camVel = Math.abs(this.cameraController.targetZ - this.cameraController.currentZ);
            this.audio.updateFootsteps(delta, camVel);
            this.audio.update(delta, this.cameraController.currentZ, this.cameraController.isTransitioning);
        }`;

const newAudio = `        if (this.audio && this.audio.enabled) {
            // Footstep velocity mapped to orbit/scroll changes instead of Z
            const camVel = Math.abs((this.cameraController.targetRadius || 0) - (this.cameraController.orbitRadius || 0));
            this.audio.updateFootsteps(delta, camVel);
            this.audio.update(delta, this.cameraController.orbitRadius, this.cameraController.isFocused);
        }`;

content = content.replace(oldAudio, newAudio);
fs.writeFileSync('src/3d/app.js', content);
