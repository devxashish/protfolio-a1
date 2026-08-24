import fs from 'fs';

let content = fs.readFileSync('src/3d/camera.js', 'utf8');

// Replace the touchmove logic
const oldTouch = `      this.targetAngle -= deltaX * 0.01;
      this.targetY += deltaY * 0.05;
      this.clampY();`;

const newTouch = `      this.targetAngle -= deltaX * 0.01;
      // Map vertical swipe to zoom (radius) so mobile users can enter the house!
      this.targetRadius += deltaY * 0.1; 
      this.clampRadius();`;

content = content.replace(oldTouch, newTouch);

// Let's also check if mousemove is doing targetY.
const oldMouse = `      this.targetAngle -= deltaX * 0.01;
      this.targetY += deltaY * 0.05;
      this.clampY();`;

const newMouse = `      this.targetAngle -= deltaX * 0.01;
      // Keep desktop left-click drag as rotation, but maybe also map vertical drag to Y height, 
      // since desktop has scroll wheel for radius.
      this.targetY += deltaY * 0.05;
      this.clampY();`;

// Wait, the strings are identical, so replace will replace the FIRST occurrence (touchmove), 
// and the second replace will replace the SECOND occurrence (mousemove).
// Let's be more precise.
