import fs from 'fs';

let content = fs.readFileSync('src/3d/camera.js', 'utf8');

const regexTouch = /document\.addEventListener\('touchmove'[\s\S]*?this\.clampY\(\);/g;

content = content.replace(regexTouch, `document.addEventListener('touchmove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      this.targetAngle -= deltaX * 0.01;
      this.targetRadius += deltaY * 0.1; // Mobile: Vertical drag zooms in/out
      this.clampRadius();`);

fs.writeFileSync('src/3d/camera.js', content);
