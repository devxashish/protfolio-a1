import fs from 'fs';

let content = fs.readFileSync('src/3d/camera.js', 'utf8');

const oldLook = `    // Look at house center
    this.camera.lookAt(0, 3, 0);`;

const newLook = `    // Look through the center to prevent gimbal lock when inside the house
    const lookX = Math.cos(this.orbitAngle + Math.PI);
    const lookZ = Math.sin(this.orbitAngle + Math.PI);
    this.camera.lookAt(lookX, 3, lookZ);`;

content = content.replace(oldLook, newLook);
fs.writeFileSync('src/3d/camera.js', content);
