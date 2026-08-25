import fs from 'fs';
let content = fs.readFileSync('src/3d/entry.js', 'utf8');

const lockOld = `        this.cameraController.enabled = false;
        this.cameraController.orbitRadius = 40;
        this.cameraController.targetRadius = 40;`;

const lockNew = `        this.cameraController.enabled = false;
        this.cameraController.orbitRadius = 40;
        this.cameraController.targetRadius = 40;
        
        // Lock body scrolling during sequence
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';`;

const unlockOld = `        this.cameraController.targetRadius = 30;
        this.cameraController.enabled = true;`;

const unlockNew = `        this.cameraController.enabled = true;
        
        // Unlock native scrolling for "Into The Storm" feel
        document.body.style.overflow = 'auto';
        document.body.style.height = '500vh'; // 5 screens of scrolling to reach inside the house
        
        // Ensure camera canvas stays fixed
        this.app.renderer.domElement.style.position = 'fixed';
        this.app.renderer.domElement.style.top = '0';
        this.app.renderer.domElement.style.left = '0';
        this.app.renderer.domElement.style.zIndex = '-1';`;

content = content.replace(lockOld, lockNew);
content = content.replace(unlockOld, unlockNew);

fs.writeFileSync('src/3d/entry.js', content);
