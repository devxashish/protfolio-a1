import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

// Remove touch-action: none so native scrolling works when we enable overflow
content = content.replace("touch-action: none;", "");

fs.writeFileSync('index.html', content);
