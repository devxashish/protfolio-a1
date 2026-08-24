import fs from 'fs';
let content = fs.readFileSync('src/3d/entry.js', 'utf8');

const regex = /this\.camera\.position\.z = 16 - \(ease \* 1\);.*?this\.cameraController\.targetZ = this\.camera\.position\.z;/s;
content = content.replace(regex, '// Camera handled by CameraController');

fs.writeFileSync('src/3d/entry.js', content);
