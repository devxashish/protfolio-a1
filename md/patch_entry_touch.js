import fs from 'fs';
let content = fs.readFileSync('src/3d/entry.js', 'utf8');

content = content.replace("document.addEventListener('touchmove', updateMouse, {passive: true});", 
"document.addEventListener('touchmove', updateMouse, {passive: true});\n        document.addEventListener('touchstart', updateMouse, {passive: true});");

fs.writeFileSync('src/3d/entry.js', content);
