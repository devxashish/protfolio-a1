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
    this.isFocused = false; 
    this.isTransitioning = false;
    
    // Rotation bases
    this.baseRotationX = 0;
    this.baseRotationY = 0;

    // Parallax input offsets
    this.parallaxX = 0;
    this.parallaxY = 0;
    
    this.targetRotation = new THREE.Vector2(0, 0);
    this.currentRotation = new THREE.Vector2(0, 0);
    
    this.isDragging = false;
    this.previousTouch = { x: 0, y: 0 };
    
    // Physics momentum for swipe
    this.velocityZ = 0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('wheel', (e) => {
      if (!this.enabled || this.isFocused) return;
      // Add velocity instead of raw setting for smoother momentum
      this.velocityZ -= e.deltaY * 0.005; 
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.velocityZ = 0; // Stop momentum on touch
      this.previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      if (!this.isFocused) {
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // Direct drag + inject velocity
            this.targetZ += deltaY * 0.03;
            this.velocityZ = deltaY * 0.05; 
            this.clampZ();
          } else {
            this.parallaxX -= deltaX * 0.005;
            this.parallaxY -= deltaY * 0.005;
            this.parallaxY = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.parallaxY));
          }
      } else {
          this.parallaxX -= deltaX * 0.002;
      }
      
      this.previousTouch = currentTouch;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!this.enabled) return;
      this.isDragging = false;
      
      // Auto-center parallax slowly on touch release
      this.parallaxX = 0;
      this.parallaxY = 0;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.enabled || this.isDragging) return;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.parallaxX = -normalizedX * 0.05; 
      this.parallaxY = normalizedY * 0.05;
    });
    
    document.addEventListener('keydown', (e) => {
        if (!this.enabled || this.isFocused) return;
        if (e.key === 'ArrowUp' || e.key === 'w') {
            this.velocityZ = -0.5;
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            this.velocityZ = 0.5;
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
    this.velocityZ = 0;
  }

  exitFocus() {
    this.isFocused = false;
    this.targetX = 0;
    this.targetY = 1.5;
    this.baseRotationX = 0;
    this.baseRotationY = 0;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    // 1. Momentum Physics
    if (!this.isDragging && !this.isFocused) {
        this.targetZ += this.velocityZ;
        this.clampZ();
        this.velocityZ *= 0.9; // Friction
        if (Math.abs(this.velocityZ) < 0.001) this.velocityZ = 0;
    }

    // 2. Heavy Spring Translation
    const speed = this.isFocused ? 2.5 : 5.0; 
    this.currentX += (this.targetX - this.currentX) * speed * delta;
    this.currentY += (this.targetY - this.currentY) * speed * delta;
    this.currentZ += (this.targetZ - this.currentZ) * speed * delta;

    // 3. Physical Head Bobbing (Cinematic)
    if (!this.isFocused && Math.abs(this.targetZ - this.currentZ) > 0.1) {
        const walkCycle = this.currentZ * 1.5; // Frequency based on distance traveled
        const bobY = Math.sin(walkCycle) * 0.05;
        const bobX = Math.cos(walkCycle / 2) * 0.02;
        this.camera.position.set(this.currentX + bobX, this.currentY + bobY, this.currentZ);
    } else {
        this.camera.position.set(this.currentX, this.currentY, this.currentZ);
    }

    // 4. Heavy Spring Rotation
    this.targetRotation.y = this.baseRotationY + this.parallaxX;
    this.targetRotation.x = this.baseRotationX + this.parallaxY;
    this.currentRotation.lerp(this.targetRotation, speed * delta);
    
    this.camera.rotation.set(0, 0, 0); 
    this.camera.rotateY(this.currentRotation.y);
    this.camera.rotateX(this.currentRotation.x);
    
    // Check transition for audio muting
    this.isTransitioning = this.isFocused && Math.abs(this.targetZ - this.currentZ) > 1.0;
  }
}
