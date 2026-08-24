import fs from 'fs';

let content = fs.readFileSync('src/3d/entry.js', 'utf8');

// Remove UI overlay requirement, start sand immediately
content = content.replace('this.sandFalling = false;', 'this.sandFalling = true;');

// Remove Tap prompt
content = content.replace(/this\.overlay = document\.createElement.*?document\.body\.appendChild\(this\.skipBtn\);/s, `
        // No overlay, sand starts automatically
        this.overlay = null;
`);

// Adjust event listeners so interaction just updates mouse, no click needed to start sand
content = content.replace(/const trigger = \(e\) => \{.*?\};/s, ``);
content = content.replace(/this\.overlay\.addEventListener.*?this\.skipBtn\.addEventListener.*?\}\);/s, ``);

fs.writeFileSync('src/3d/entry.js', content);
