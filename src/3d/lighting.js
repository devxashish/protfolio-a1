import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    
    // Ambient moonlight
    this.ambientLight = new THREE.AmbientLight(0x223344, 1.5);
    this.scene.add(this.ambientLight);
    
    // Moonlight direction
    this.directionalLight = new THREE.DirectionalLight(0xaaccff, 2.5);
    this.directionalLight.position.set(20, 30, -20);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.bottom = -30;
    this.directionalLight.shadow.bias = -0.001;
    this.scene.add(this.directionalLight);
    
    // Fireflies
    this.fireflies = [];
    for(let i = 0; i < 20; i++) {
        const light = new THREE.PointLight(0x88ff66, 2, 5);
        light.position.set(
            (Math.random() - 0.5) * 40,
            1 + Math.random() * 5,
            (Math.random() - 0.5) * 40
        );
        this.scene.add(light);
        this.fireflies.push({
            light,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random(),
            origin: light.position.clone()
        });
    }
  }

  update(cameraPosition) {
    const time = Date.now() * 0.001;
    this.fireflies.forEach(f => {
        f.light.intensity = 1.0 + Math.sin(time * f.speed + f.phase);
        f.light.position.y = f.origin.y + Math.sin(time * f.speed * 0.5) * 1.5;
        f.light.position.x = f.origin.x + Math.sin(time * f.speed * 0.2) * 2.0;
    });
  }
}
