import * as THREE from 'three';

export class CameraController {
  constructor(app) {
    this.app = app;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.enabled = true;
    
    // Core parameters mapped to scroll
    this.orbitRadius = 40; 
    this.targetRadius = 40;
    this.orbitAngle = Math.PI / 4; 
    
    this.baseAngle = Math.PI / 4; 
    this.angleOffset = 0;
    this.targetAngleOffset = 0;
    
    this.orbitY = 3.5;
    this.targetY = 3.5;
    
    this.isDragging = false;
    this.previousTouch = { x: 0, y: 0 };
    
    // Smooth scroll interpolation
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    
    this.bindEvents();
  }

  bindEvents() {
    // 1. Map native window scroll to camera progression
    window.addEventListener('scroll', () => {
        if (!this.enabled) return;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
            this.targetScrollProgress = window.scrollY / maxScroll; // 0.0 to 1.0
        }
    }, { passive: true });

    // 2. Allow horizontal dragging to orbit the camera (Offset)
    document.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      
      this.targetAngleOffset -= deltaX * 0.005; // Drag to look around
      this.previousTouch = currentTouch;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!this.enabled) return;
      this.isDragging = false;
    });

    document.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.previousTouch = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.enabled || !this.isDragging) return;
      const currentTouch = { x: e.clientX, y: e.clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      
      this.targetAngleOffset -= deltaX * 0.005;
      this.previousTouch = currentTouch;
    });
    
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  focusOn(position, rotation) {
    this.isFocused = true;
    this.preFocusTargetRadius = this.targetRadius;
    this.preFocusTargetY = this.targetY;
    
    this.targetRadius = Math.sqrt(position.x*position.x + position.z*position.z);
    this.targetY = position.y;
  }

  exitFocus() {
    this.isFocused = false;
    this.targetRadius = this.preFocusTargetRadius || 30;
    this.targetY = this.preFocusTargetY || 3.5;
  }

  update(delta) {
    // Smoothly interpolate scroll
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 5.0 * delta;

    if (!this.isFocused) {
        // Map scroll to radius (35 outside -> 2 inside)
        this.targetRadius = 35 - (this.scrollProgress * 33);
        
        // Map scroll to base angle (auto-orbit as you scroll in)
        // 1 full rotation = Math.PI * 2
        this.baseAngle = (Math.PI / 4) + (this.scrollProgress * Math.PI * 1.5);
        
        // Map scroll to Y height (start high, drop low inside)
        this.targetY = 6.0 - (this.scrollProgress * 4.0); // 6.0 to 2.0
    }

    // Spring physics to targets
    this.orbitRadius += (this.targetRadius - this.orbitRadius) * 5.0 * delta;
    this.angleOffset += (this.targetAngleOffset - this.angleOffset) * 5.0 * delta;
    this.orbitY += (this.targetY - this.orbitY) * 5.0 * delta;

    this.orbitAngle = this.baseAngle + this.angleOffset;

    // Convert polar to cartesian
    const targetX = Math.cos(this.orbitAngle) * this.orbitRadius;
    const targetZ = Math.sin(this.orbitAngle) * this.orbitRadius;
    
    this.camera.position.set(targetX, this.orbitY, targetZ);
    
    // Look through the center to prevent gimbal lock when inside the house
    const lookX = Math.cos(this.orbitAngle + Math.PI);
    const lookZ = Math.sin(this.orbitAngle + Math.PI);
    
    // When far away, look slightly higher. When inside, look at project level
    const lookY = 3.0 - (this.scrollProgress * 1.5); 
    
    this.camera.lookAt(lookX, lookY, lookZ);
  }
}
