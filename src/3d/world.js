import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scene = scene;
    
    // Core Materials for Samurai Theme
    this.mats = {
        grass: new THREE.MeshStandardMaterial({ color: 0x1a3311, roughness: 1.0, metalness: 0.0 }),
        woodDark: new THREE.MeshStandardMaterial({ color: 0x2b1c10, roughness: 0.9, metalness: 0.1 }),
        woodLight: new THREE.MeshStandardMaterial({ color: 0x4a3424, roughness: 0.8, metalness: 0.1 }),
        shojiPaper: new THREE.MeshStandardMaterial({ color: 0xfff3e0, roughness: 1.0, emissive: 0xfff3e0, emissiveIntensity: 0.1 }),
        roofTiles: new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.7, metalness: 0.2 }),
        toriiRed: new THREE.MeshStandardMaterial({ color: 0xaa2211, roughness: 0.6, metalness: 0.1 }),
        bamboo: new THREE.MeshStandardMaterial({ color: 0x2d4c1e, roughness: 0.7, metalness: 0.1 })
    };

    this.buildNature();
    this.buildSamuraiHouse();
    this.buildToriiGate();
  }

  buildNature() {
    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), this.mats.grass);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Bamboo Forest using InstancedMesh for performance
    const bambooCount = 1000;
    const bambooGeo = new THREE.CylinderGeometry(0.1, 0.15, 15, 5);
    const bambooMesh = new THREE.InstancedMesh(bambooGeo, this.mats.bamboo, bambooCount);
    
    const dummy = new THREE.Object3D();
    let index = 0;
    
    for (let i = 0; i < bambooCount; i++) {
        // Random position in a donut shape around the house
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.random() * 40; // House is at center, radius 15-55
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        dummy.position.set(x, 7.5, z);
        dummy.rotation.set((Math.random() - 0.5) * 0.1, Math.random() * Math.PI, (Math.random() - 0.5) * 0.1);
        dummy.scale.set(1, 0.8 + Math.random() * 0.5, 1);
        dummy.updateMatrix();
        
        bambooMesh.setMatrixAt(index++, dummy.matrix);
    }
    bambooMesh.castShadow = true;
    bambooMesh.receiveShadow = true;
    this.scene.add(bambooMesh);
  }

  buildSamuraiHouse() {
    this.houseGroup = new THREE.Group();
    this.houseGroup.position.set(0, 0, 0);

    // Stone Foundation
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 10), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    foundation.position.set(0, 0.5, 0);
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    this.houseGroup.add(foundation);

    // Main Wooden Deck (Engawa)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 11), this.mats.woodLight);
    deck.position.set(0, 1.1, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.houseGroup.add(deck);

    // Pillars
    const pillarPositions = [
        [-5.5, 5.5], [5.5, 5.5], [-5.5, -4.5], [5.5, -4.5], // outer corners
        [-4.5, 4.5], [4.5, 4.5], [-4.5, -3.5], [4.5, -3.5]  // inner room corners
    ];
    
    const pillarGeo = new THREE.BoxGeometry(0.3, 4, 0.3);
    pillarPositions.forEach(pos => {
        const p = new THREE.Mesh(pillarGeo, this.mats.woodDark);
        p.position.set(pos[0], 3.2, pos[1]);
        p.castShadow = true;
        this.houseGroup.add(p);
    });

    // Shoji Screens (Walls) - Inner Room
    const wallGeoFront = new THREE.BoxGeometry(9, 4, 0.1);
    const wallGeoSide = new THREE.BoxGeometry(0.1, 4, 8);
    
    const wallBack = new THREE.Mesh(wallGeoFront, this.mats.shojiPaper);
    wallBack.position.set(0, 3.2, -3.5);
    this.houseGroup.add(wallBack);
    
    const wallLeft = new THREE.Mesh(wallGeoSide, this.mats.shojiPaper);
    wallLeft.position.set(-4.5, 3.2, 0.5);
    this.houseGroup.add(wallLeft);
    
    const wallRight = new THREE.Mesh(wallGeoSide, this.mats.shojiPaper);
    wallRight.position.set(4.5, 3.2, 0.5);
    this.houseGroup.add(wallRight);

    // Front Doors (Half open)
    const doorGeo = new THREE.BoxGeometry(4.5, 4, 0.1);
    const door1 = new THREE.Mesh(doorGeo, this.mats.shojiPaper);
    door1.position.set(-2.25, 3.2, 4.5);
    this.houseGroup.add(door1);

    // The Curved Roof (Irimoya style approximation)
    // Using a cylinder with 4 segments rotated to look like a pyramid
    const roof1Geo = new THREE.CylinderGeometry(3, 8, 3, 4);
    const roof1 = new THREE.Mesh(roof1Geo, this.mats.roofTiles);
    roof1.rotation.y = Math.PI / 4;
    roof1.position.set(0, 6.7, 0.5);
    roof1.scale.set(1, 1, 0.8);
    roof1.castShadow = true;
    this.houseGroup.add(roof1);
    
    // Top Ridge
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 0.5), this.mats.woodDark);
    ridge.position.set(0, 8.3, 0.5);
    this.houseGroup.add(ridge);

    // Glowing Lanterns inside and outside
    const lanternGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xffaa55, emissive: 0xffaa55, emissiveIntensity: 2 });
    
    const l1 = new THREE.Mesh(lanternGeo, lanternMat);
    l1.position.set(-3, 3, 5);
    this.houseGroup.add(l1);
    const pl1 = new THREE.PointLight(0xffaa55, 20, 15);
    pl1.position.copy(l1.position);
    this.houseGroup.add(pl1);

    const l2 = new THREE.Mesh(lanternGeo, lanternMat);
    l2.position.set(3, 3, 5);
    this.houseGroup.add(l2);
    const pl2 = new THREE.PointLight(0xffaa55, 20, 15);
    pl2.position.copy(l2.position);
    this.houseGroup.add(pl2);
    
    // Interior Light
    const interiorLight = new THREE.PointLight(0xffddaa, 30, 20);
    interiorLight.position.set(0, 3, 0);
    this.houseGroup.add(interiorLight);

    this.scene.add(this.houseGroup);
  }

  buildToriiGate() {
    this.torii = new THREE.Group();
    
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
    const p1 = new THREE.Mesh(pillarGeo, this.mats.toriiRed);
    p1.position.set(-3, 3, 0);
    p1.castShadow = true;
    this.torii.add(p1);
    
    const p2 = new THREE.Mesh(pillarGeo, this.mats.toriiRed);
    p2.position.set(3, 3, 0);
    p2.castShadow = true;
    this.torii.add(p2);
    
    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 0.5), this.mats.toriiRed);
    beam1.position.set(0, 5, 0);
    beam1.castShadow = true;
    this.torii.add(beam1);
    
    const beam2 = new THREE.Mesh(new THREE.BoxGeometry(9, 0.6, 0.6), this.mats.toriiRed);
    beam2.position.set(0, 6, 0);
    beam2.castShadow = true;
    
    // Curve the top beam slightly
    const curveGeometry = new THREE.CylinderGeometry(15, 15, 0.6, 32, 1, false, Math.PI/2 - 0.3, 0.6);
    const curveBeam = new THREE.Mesh(curveGeometry, this.mats.toriiRed);
    curveBeam.rotation.z = Math.PI / 2;
    curveBeam.rotation.x = Math.PI / 2;
    curveBeam.position.set(0, -8.8, 0);
    curveBeam.castShadow = true;
    this.torii.add(curveBeam);
    
    this.torii.position.set(0, 0, 15);
    this.scene.add(this.torii);
  }
}
