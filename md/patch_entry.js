import fs from 'fs';

let content = fs.readFileSync('src/3d/entry.js', 'utf8');

// Modify update function to interpolate spotlight Y as well
const oldUpdate = `        this.spotlight.position.x = -8 + (ease * 8); // -8 to 0
        this.spotlight.position.z = 8 - (ease * 4);  // 8 to 4`;

const newUpdate = `        this.spotlight.position.x = -8 + (ease * 8); // -8 to 0
        this.spotlight.position.y = 2 + (ease * 6);  // 2 to 8
        this.spotlight.position.z = 8 - (ease * 4);  // 8 to 4`;

content = content.replace(oldUpdate, newUpdate);
fs.writeFileSync('src/3d/entry.js', content);
