import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class CameraController {
  constructor(app) {
    this.app = app;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Translation targets
    this.targetX = 0;
    this.currentX = 0;
    this.targetY = 1.5;
    this.currentY = 1.5;
    this.targetZ = 15;
    this.currentZ = 15;
    
    this.camera.position.set(this.currentX, this.currentY, this.currentZ);

    this.enabled = true;
    this.isFocused = false; // Are we in Focus Mode?
    
    // Rotation bases (where the camera should look, before parallax)
    this.baseRotationX = 0;
    this.baseRotationY = 0;

    // Parallax input offsets
    this.parallaxX = 0;
    this.parallaxY = 0;
    
    this.targetRotation = new THREE.Vector2(0, 0);
    this.currentRotation = new THREE.Vector2(0, 0);
    
    this.isDragging = false;
    this.previousTouch = { x: 0, y: 0 };

    this.bindEvents();
  }

  bindEvents() {
    // Desktop wheel (only moves Z if not focused)
    window.addEventListener('wheel', (e) => {
      if (!this.enabled || this.isFocused) return;
      this.targetZ -= e.deltaY * 0.02;
      this.clampZ();
    }, { passive: true });

    // Touch events
    document.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      if (!this.isFocused) {
          // Vertical swipe -> move Z
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            this.targetZ += deltaY * 0.05;
            this.clampZ();
          } 
          // Horizontal swipe -> look (parallax)
          else {
            this.parallaxX -= deltaX * 0.005;
            this.parallaxY -= deltaY * 0.005;
            this.parallaxY = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.parallaxY));
          }
      } else {
          // If focused, horizontal swipe rotates slightly around the object
          this.parallaxX -= deltaX * 0.002;
      }
      
      this.previousTouch = currentTouch;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!this.enabled) return;
      this.isDragging = false;
      this.parallaxX = 0;
      this.parallaxY = 0;
    });

    // Desktop mouse look
    document.addEventListener('mousemove', (e) => {
      if (!this.enabled || this.isDragging) return;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.parallaxX = -normalizedX * 0.05; // Reduced from 0.1 for elegance
      this.parallaxY = normalizedY * 0.05;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!this.enabled || this.isFocused) return;
        if (e.key === 'ArrowUp') {
            this.targetZ += 2;
            this.clampZ();
        } else if (e.key === 'ArrowDown') {
            this.targetZ -= 2;
            this.clampZ();
        }
    });
  }

  clampZ() {
    this.targetZ = Math.max(-75, Math.min(15, this.targetZ));
  }

  focusOn(position, rotation) {
    this.isFocused = true;
    this.targetX = position.x;
    this.targetY = position.y;
    this.targetZ = position.z;
    this.baseRotationX = rotation.x;
    this.baseRotationY = rotation.y;
  }

  exitFocus() {
    this.isFocused = false;
    this.targetX = 0;
    this.targetY = 1.5;
    // targetZ remains where it was before focusing (or slightly adjusted if we want)
    this.baseRotationX = 0;
    this.baseRotationY = 0;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    // 3D Spring Translation
    const speed = this.isFocused ? 2.5 : 4.0; // Slower, heavier move into focus
    
    this.currentX += (this.targetX - this.currentX) * speed * delta;
    this.currentY += (this.targetY - this.currentY) * speed * delta;
    this.currentZ += (this.targetZ - this.currentZ) * speed * delta;
    this.camera.position.set(this.currentX, this.currentY, this.currentZ);

    // Rotation calculation
    this.targetRotation.y = this.baseRotationY + this.parallaxX;
    this.targetRotation.x = this.baseRotationX + this.parallaxY;

    // Heavy spring rotation
    this.currentRotation.lerp(this.targetRotation, speed * delta);
    
    this.camera.rotation.set(0, 0, 0); // Reset
    this.camera.rotateY(this.currentRotation.y);
    this.camera.rotateX(this.currentRotation.x);
  }
}
