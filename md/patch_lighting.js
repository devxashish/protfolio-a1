import fs from 'fs';

let content = fs.readFileSync('src/3d/lighting.js', 'utf8');

// Inside constructor, at the end of the tungstens loop or after
const insertion = `
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

  update(cameraPosition) {`;

content = content.replace('  }\n\n  update(cameraPosition) {', insertion);
fs.writeFileSync('src/3d/lighting.js', content);
