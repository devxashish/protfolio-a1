import fs from 'fs';
let content = fs.readFileSync('src/3d/app.js', 'utf8');

content = content.replace(`        if (this.entry && this.entry.isActive) {
            this.entry.update(delta);
        } else {
            this.cameraController.update(delta);
        }`, 
`        if (this.entry && this.entry.isActive) {
            this.entry.update(delta);
        }
        this.cameraController.update(delta);`);

fs.writeFileSync('src/3d/app.js', content);
