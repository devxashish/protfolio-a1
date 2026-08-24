import fs from 'fs';

let content = fs.readFileSync('src/3d/entry.js', 'utf8');

const lockOld = `        this.cameraController.enabled = false;
        this.cameraController.currentZ = 16;
        this.cameraController.targetZ = 16;
        this.camera.position.z = 16;
        this.camera.position.y = 1.7;`;

const lockNew = `        this.cameraController.enabled = false;
        this.cameraController.orbitRadius = 40;
        this.cameraController.targetRadius = 40;`;

const unlockOld = `        this.camera.position.z = 15;
        this.camera.position.y = 1.5;
        this.cameraController.currentZ = 15;
        this.cameraController.targetZ = 15;
        this.cameraController.enabled = true;`;

const unlockNew = `        this.cameraController.targetRadius = 30;
        this.cameraController.enabled = true;`;

content = content.replace(lockOld, lockNew);
content = content.replace(unlockOld, unlockNew);

fs.writeFileSync('src/3d/entry.js', content);
