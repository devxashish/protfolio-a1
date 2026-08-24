import fs from 'fs';

let content = fs.readFileSync('src/3d/camera.js', 'utf8');

const insertion = `
  focusOn(position, rotation) {
    this.autoRotate = false;
    this.isFocused = true;
    this.preFocusTargetRadius = this.targetRadius;
    this.preFocusTargetY = this.targetY;
    
    // Convert target x,z back to radius/angle
    this.targetRadius = Math.sqrt(position.x*position.x + position.z*position.z);
    this.targetAngle = Math.atan2(position.z, position.x);
    this.targetY = position.y;
  }

  exitFocus() {
    this.isFocused = false;
    this.targetRadius = this.preFocusTargetRadius || 30;
    this.targetY = this.preFocusTargetY || 3.5;
  }
`;

content = content.replace('  resize() {', insertion + '\n  resize() {');
fs.writeFileSync('src/3d/camera.js', content);
