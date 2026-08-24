import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    
    this.isNight = true; 

    this.ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.5);
    this.scene.add(this.ambientLight);
    
    this.exteriorLight = new THREE.PointLight(0x4466aa, 15, 40);
    this.exteriorLight.position.set(0, 4, -80); 
    this.exteriorLight.castShadow = true;
    this.scene.add(this.exteriorLight);

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

    this.tungstens = [];
    
    // Memory Optimization: Reuse geometry and materials for fixtures
    const fixtureGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    const bulbGeo = new THREE.SphereGeometry(0.1, 8, 8);

    for (let i = 1; i <= 8; i++) {
        const zPos = -(i * 12);
        
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.set(0, 5.5, zPos);
        this.scene.add(fixture);

        const light = new THREE.PointLight(0xd97706, 0, 15, 2); 
        light.position.set(0, 5.2, zPos);
        light.castShadow = true;
        this.scene.add(light);
        
        // Material cannot be shared if we want to change color independently, 
        // but bulb logic says it's based on distance. If they fade independently, they need unique materials.
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.copy(light.position);
        this.scene.add(bulb);

        this.tungstens.push({ light, bulb, z: zPos, active: false });
    }

    // Alcove Lights (Spill colors into the spine to indicate discoverable content)
    this.alcoveLights = [
        { z: -12, color: 0x4466aa }, // MS Security (Blue)
        { z: -24, color: 0xaa4444 }, // Get Unzip (Red/Pink)
        { z: -36, color: 0x22aa66 }  // Atlas UI (Green)
    ];

    this.alcoveLights.forEach(al => {
        const light = new THREE.PointLight(al.color, 15, 20);
        light.position.set(-18, 2, al.z); // Deep inside the alcove
        light.castShadow = true;
        this.scene.add(light);
    });
  }

  update(cameraPosition) {
    const activationDistance = 18;
    
    this.tungstens.forEach(t => {
        const dist = Math.abs(cameraPosition.z - t.z);
        if (dist < activationDistance && cameraPosition.z > t.z - 5) {
            const targetIntensity = this.isNight ? 50 : 30; 
            
            if (!t.active) {
                t.active = true;
                window.dispatchEvent(new CustomEvent('lightActivated'));
            }
            
            t.light.intensity += (targetIntensity - t.light.intensity) * 0.05;
            t.bulb.material.color.setHex(0xffaa44); 
        } else {
            if (t.active) {
                t.active = false;
            }
            t.light.intensity += (0 - t.light.intensity) * 0.02;
            if (t.light.intensity < 0.5) {
                t.bulb.material.color.setHex(0x222222); 
            }
        }
    });
  }
}
