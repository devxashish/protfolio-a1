import fs from 'fs';
let content = fs.readFileSync('src/3d/entry.js', 'utf8');

content = content.replace("document.body.style.overflow = 'auto';", 
"document.body.style.overflow = 'auto';\n        document.documentElement.style.overflow = 'auto';");

content = content.replace("document.body.style.overflow = 'hidden';", 
"document.body.style.overflow = 'hidden';\n        document.documentElement.style.overflow = 'hidden';");

fs.writeFileSync('src/3d/entry.js', content);
