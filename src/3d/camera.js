import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class CameraController {
  constructor(app) {
    this.app = app;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.enabled = true;
    
    // Orbit Mechanics
    this.orbitRadius = 30; // Start outside
    this.targetRadius = 30;
    this.orbitAngle = Math.PI / 4; 
    this.targetAngle = Math.PI / 4;
    this.orbitY = 3.5;
    this.targetY = 3.5;
    
    this.autoRotate = true;
    
    // For smooth lerping
    this.currentX = 0;
    this.currentY = this.orbitY;
    this.currentZ = this.orbitRadius;
    
    this.isDragging = false;
    this.previousTouch = { x: 0, y: 0 };
    
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      // Scroll to zoom in/out (go inside house)
      this.targetRadius += e.deltaY * 0.05;
      this.clampRadius();
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.autoRotate = false; // Stop auto-rotate when user interacts
      this.previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      this.targetAngle -= deltaX * 0.01;
      this.targetY += deltaY * 0.05;
      this.clampY();
      
      this.previousTouch = currentTouch;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!this.enabled) return;
      this.isDragging = false;
    });

    // Desktop Mouse Drag
    document.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.autoRotate = false;
      this.previousTouch = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.clientX, y: e.clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      this.targetAngle -= deltaX * 0.01;
      this.targetY += deltaY * 0.05;
      this.clampY();
      
      this.previousTouch = currentTouch;
    });
    
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  clampRadius() {
    this.targetRadius = Math.max(0.1, Math.min(40, this.targetRadius));
  }
  
  clampY() {
    this.targetY = Math.max(1.0, Math.min(15, this.targetY));
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    if (this.autoRotate) {
        this.targetAngle += 0.2 * delta; // slow cinematic orbit
    }

    // Spring physics to targets
    this.orbitRadius += (this.targetRadius - this.orbitRadius) * 5.0 * delta;
    this.orbitAngle += (this.targetAngle - this.orbitAngle) * 5.0 * delta;
    this.orbitY += (this.targetY - this.orbitY) * 5.0 * delta;

    // Convert polar to cartesian
    const targetX = Math.cos(this.orbitAngle) * this.orbitRadius;
    const targetZ = Math.sin(this.orbitAngle) * this.orbitRadius;
    
    this.camera.position.set(targetX, this.orbitY, targetZ);
    
    // Look at house center
    this.camera.lookAt(0, 3, 0);
  }
}
