import * as THREE from 'three';

export class Weather {
  constructor(scene) {
    this.scene = scene;
    
    // Configurable
    this.isRaining = true;
    this.dropCount = 1000; // Low count for mobile performance

    if (this.isRaining) {
        this.createRain();
    }
  }

  createRain() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dropCount * 3);

    for (let i = 0; i < this.dropCount * 3; i += 3) {
      // Place rain far outside the corridor (e.g. exit area Z < -75)
      positions[i] = (Math.random() - 0.5) * 40;     // x (-20 to 20)
      positions[i + 1] = Math.random() * 20;         // y (0 to 20)
      positions[i + 2] = -75 - (Math.random() * 20); // z (-75 to -95)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update(delta, time) {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array;
    
    // Move drops down
    for (let i = 1; i < this.dropCount * 3; i += 3) {
      positions[i] -= 10 * delta; // Fall speed
      
      // Reset if below floor
      if (positions[i] < 0) {
        positions[i] = 20;
      }
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
