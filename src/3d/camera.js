import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class CameraController {
  constructor(app) {
    this.app = app;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.7, 15); // Start further back

    this.targetZ = 5;
    this.currentZ = 15;
    
    this.targetRotation = new THREE.Vector2(0, 0);
    this.currentRotation = new THREE.Vector2(0, 0);
    
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.maxScroll = 1;
    this.bindEvents();
    this.calculateScrollScale();
  }

  calculateScrollScale() {
    const bodyHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    this.maxScroll = Math.max(1, bodyHeight - windowHeight);
  }

  bindEvents() {
    // Desktop wheel
    window.addEventListener('wheel', (e) => {
      this.targetZ -= e.deltaY * 0.02;
      this.clampZ();
    }, { passive: true });

    // Touch events for Z movement and Look
    document.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentTouch.x - this.previousTouch.x;
      const deltaY = currentTouch.y - this.previousTouch.y;
      
      // Vertical swipe -> move Z
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this.targetZ += deltaY * 0.05;
        this.clampZ();
      } 
      // Horizontal swipe -> look
      else {
        this.targetRotation.y -= deltaX * 0.005;
        this.targetRotation.x -= deltaY * 0.005;
        this.targetRotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.targetRotation.x));
      }
      
      this.previousTouch = currentTouch;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      this.isDragging = false;
      this.targetRotation.set(0, 0); // Auto center
    });

    // Desktop mouse look
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) return;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.targetRotation.y = -normalizedX * 0.1;
      this.targetRotation.x = normalizedY * 0.1;
    });
    
    // Keyboard navigation (up/down arrows)
    document.addEventListener('keydown', (e) => {
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

  transitionTo(position, url) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Animate Z to be just in front of the object
    this.targetZ = position.z + 2; 
    
    // Auto center
    this.targetRotation.set(0, 0);

    // Give the camera 1.5 seconds to move, then transition URL
    setTimeout(() => {
        window.location.href = url; // "then navigate to the verified live URL. Do NOT directly call window.open() on first click."
        
        // Reset after a delay in case user navigates back
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1000);
    }, 1500);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    // If transitioning, override Z spring to move directly in front of target
    // Lower lerp factor (2 for regular movement, 1.5 for transition) makes camera feel heavier and smoother
    const zFactor = this.isTransitioning ? 1.5 : 3.0; 
    this.currentZ += (this.targetZ - this.currentZ) * zFactor * delta;
    this.camera.position.z = this.currentZ;

    // Heavy spring rotation
    this.currentRotation.lerp(this.targetRotation, 3.5 * delta);
    
    this.camera.rotation.set(0, 0, 0); // Reset
    this.camera.rotateY(this.currentRotation.y);
    this.camera.rotateX(this.currentRotation.x);
  }
}
