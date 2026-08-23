import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    
    // Day/Night state
    this.isNight = true; // Assume night or dark mode for now

    // Ambient fill (very subtle)
    this.ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.5);
    this.scene.add(this.ambientLight);
    
    // Distant exterior cool light (moonlight/street light entering from the exit)
    this.exteriorLight = new THREE.PointLight(0x4466aa, 15, 40);
    this.exteriorLight.position.set(0, 4, -80); // Positioned outside
    this.exteriorLight.castShadow = true;
    this.scene.add(this.exteriorLight);

    // Directional (Moon/Sun)
    this.directionalLight = new THREE.DirectionalLight(
        this.isNight ? 0x446688 : 0xffeedd, 
        this.isNight ? 0.5 : 1.5
    );
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.bias = -0.001;
    this.scene.add(this.directionalLight);

    // Tungsten physical lights in the corridor
    this.tungstens = [];
    for (let i = 1; i <= 8; i++) {
        const zPos = -(i * 12);
        
        // Physical fixture
        const fixture = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 })
        );
        fixture.position.set(0, 5.5, zPos);
        this.scene.add(fixture);

        // Point light
        const light = new THREE.PointLight(0xd97706, 0, 15, 2); // Physical decay (intensity, distance, decay=2)
        light.position.set(0, 5.2, zPos);
        light.castShadow = true;
        this.scene.add(light);
        
        // Emissive bulb
        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x222222 })
        );
        bulb.position.copy(light.position);
        this.scene.add(bulb);

        this.tungstens.push({ light, bulb, z: zPos });
    }
  }

  update(cameraPosition) {
    // Proximity lighting: Tungstens turn on as camera approaches (Sequential reveal)
    const activationDistance = 18;
    
    this.tungstens.forEach(t => {
        const dist = Math.abs(cameraPosition.z - t.z);
        if (dist < activationDistance && cameraPosition.z > t.z - 5) {
            // Fade in if approaching or just past
            const targetIntensity = this.isNight ? 50 : 30; // Using physical light intensity values
            
            if (!t.active) {
                t.active = true;
                window.dispatchEvent(new CustomEvent('lightActivated'));
            }
            
            t.light.intensity += (targetIntensity - t.light.intensity) * 0.05;
            t.bulb.material.color.setHex(0xffaa44); // Warm active
        } else {
            // Fade out
            if (t.active) {
                t.active = false;
            }
            t.light.intensity += (0 - t.light.intensity) * 0.02;
            if (t.light.intensity < 0.5) {
                t.bulb.material.color.setHex(0x222222); // Off
            }
        }
    });
  }
}
