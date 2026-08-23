import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { MaterialSystem } from './materials.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    
    // Load GLSL Procedural Materials
    this.mats = {
        concrete: MaterialSystem.getConcreteMaterial(0x2a2a2a, 1.0),
        darkStone: MaterialSystem.getConcreteMaterial(0x111111, 2.0),
        steel: MaterialSystem.getSteelMaterial(),
        wood: MaterialSystem.getWoodMaterial(),
        doorGlow: new THREE.MeshBasicMaterial({ color: 0x4466aa })
    };

    this.buildArchitecture();
  }

  buildArchitecture() {
    this.buildFloorAndCeiling();
    this.buildIdentityAnchor(); // Z = 0
    this.buildMainSpine();      // Z = 0 to -75
    this.buildArchives();       // Z = -40 (Right Branch)
    this.buildArmory();         // Z = -50 (Skills)
    this.buildThreshold();      // Z = -75 (Exit)
  }

  buildFloorAndCeiling() {
    // Main Spine Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 120, 20, 100), this.mats.concrete);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -40); // Spans Z=20 to Z=-100
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceilings (With central skylight gap)
    const ceilingL = new THREE.Mesh(new THREE.PlaneGeometry(10, 120), this.mats.darkStone);
    ceilingL.rotation.x = Math.PI / 2;
    ceilingL.position.set(-7, 7, -40);
    ceilingL.receiveShadow = true;
    this.scene.add(ceilingL);

    const ceilingR = new THREE.Mesh(new THREE.PlaneGeometry(10, 120), this.mats.darkStone);
    ceilingR.rotation.x = Math.PI / 2;
    ceilingR.position.set(7, 7, -40);
    ceilingR.receiveShadow = true;
    this.scene.add(ceilingR);

    // Glass Skylight
    const skylightGeo = new THREE.PlaneGeometry(4, 120);
    const skylightMat = new THREE.MeshStandardMaterial({ 
        color: 0x050510, transparent: true, opacity: 0.3, roughness: 0.1, metalness: 0.9 
    });
    const skylight = new THREE.Mesh(skylightGeo, skylightMat);
    skylight.rotation.x = Math.PI / 2;
    skylight.position.set(0, 7.1, -40);
    this.scene.add(skylight);
  }

  buildIdentityAnchor() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    
    // Abstract Brutalist structure that holds the identity shadow
    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), this.mats.concrete);
    base.position.set(0, 0.5, 0);
    coreGroup.add(base);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 6, 8), this.mats.darkStone);
    pillar.position.set(0, 4, 0);
    coreGroup.add(pillar);

    // Clamps
    const bracketTop = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), this.mats.steel);
    bracketTop.position.set(0, 6.5, 0);
    coreGroup.add(bracketTop);
    
    const bracketMid = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 3.5), this.mats.steel);
    bracketMid.position.set(0, 4, 0);
    coreGroup.add(bracketMid);

    // Load beam connecting to ceiling
    const loadBeam = new THREE.Mesh(new THREE.BoxGeometry(24, 1, 4), this.mats.steel);
    loadBeam.position.set(0, 7, 0);
    coreGroup.add(loadBeam);

    // Add to scene (Shadow casting disabled globally in EntrySequence for these specific meshes)
    this.scene.add(coreGroup);
  }

  buildMainSpine() {
    // Generate structural ribs and walls along the spine
    for (let i = 1; i <= 6; i++) {
        const zPos = -(i * 12); // -12, -24, -36, -48, -60, -72
        
        // Define gaps for architectural branches
        const isProjectAlcove = (zPos === -12 || zPos === -24 || zPos === -36); // Left branches
        const isStoryBranch = (zPos === -48); // Right branch, offset to match Z=-40 zone
        
        // Structural Ribs
        const ribL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 1.5), this.mats.darkStone);
        ribL.position.set(-11, 3.5, zPos);
        ribL.castShadow = true;
        ribL.receiveShadow = true;
        this.scene.add(ribL);

        const ribR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 1.5), this.mats.darkStone);
        ribR.position.set(11, 3.5, zPos);
        ribR.castShadow = true;
        ribR.receiveShadow = true;
        this.scene.add(ribR);

        const topBeam = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 1.5), this.mats.steel);
        topBeam.position.set(0, 6.75, zPos);
        topBeam.castShadow = true;
        topBeam.receiveShadow = true;
        this.scene.add(topBeam);

        // Solid Walls (where there are no alcoves)
        if (!isProjectAlcove) {
            const wallL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 10.5), this.mats.concrete);
            wallL.position.set(-11, 3.5, zPos + 6);
            wallL.receiveShadow = true;
            this.scene.add(wallL);
        } else {
            // Project Alcove Floor & Back Wall
            const alcoveFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), this.mats.concrete);
            alcoveFloor.rotation.x = -Math.PI / 2;
            alcoveFloor.position.set(-16, 0.01, zPos + 6);
            alcoveFloor.receiveShadow = true;
            this.scene.add(alcoveFloor);
            
            const alcoveWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 10.5), this.mats.darkStone);
            alcoveWall.position.set(-21, 3.5, zPos + 6);
            alcoveWall.receiveShadow = true;
            this.scene.add(alcoveWall);
        }

        if (!isStoryBranch) {
            const wallR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 10.5), this.mats.concrete);
            wallR.position.set(11, 3.5, zPos + 6);
            wallR.receiveShadow = true;
            this.scene.add(wallR);
        }
    }
  }

  buildArchives() {
    // The Story Branch at Z=-40 (Right side)
    const zBase = -40;
    
    // Curved concrete wall guiding into the branch
    const curveGeo = new THREE.CylinderGeometry(15, 15, 7, 16, 1, false, 0, Math.PI / 2);
    const curve = new THREE.Mesh(curveGeo, this.mats.concrete);
    curve.position.set(20, 3.5, zBase + 10);
    curve.receiveShadow = true;
    this.scene.add(curve);

    // Warm wood flooring for the Archives
    const archiveFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), this.mats.wood);
    archiveFloor.rotation.x = -Math.PI / 2;
    archiveFloor.position.set(21, 0.02, zBase);
    archiveFloor.receiveShadow = true;
    this.scene.add(archiveFloor);

    // The Drafting Table
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4), this.mats.wood);
    tableTop.position.set(21, 2.5, zBase);
    tableTop.rotation.x = 0.2; // Tilted
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.scene.add(tableTop);
    
    const tableLegs = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.4, 3.8), this.mats.steel);
    tableLegs.position.set(21, 1.2, zBase);
    tableLegs.castShadow = true;
    this.scene.add(tableLegs);

    // Archive Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 1), this.mats.darkStone);
    backWall.position.set(31, 3.5, zBase);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
  }

  buildArmory() {
    // Skills integrated into the walls at Z=-50
    const zBase = -50;
    
    // Server Rack Recess (Left Wall)
    const rackRecessGeo = new THREE.BoxGeometry(2, 6, 8);
    const rackRecess = new THREE.Mesh(rackRecessGeo, this.mats.steel);
    rackRecess.position.set(-11, 3, zBase);
    this.scene.add(rackRecess);
    
    // Server blades (Horizontal lines)
    for (let j = 0; j < 10; j++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 7.8), this.mats.darkStone);
        blade.position.set(-11, 1 + (j * 0.4), zBase);
        this.scene.add(blade);
        
        // Tiny LED lights
        const ledMat = new THREE.MeshBasicMaterial({ color: j % 3 === 0 ? 0xffaa00 : 0x00ffaa });
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), ledMat);
        led.position.set(-10.4, 1 + (j * 0.4), zBase + 3 - Math.random());
        this.scene.add(led);
    }
  }

  buildThreshold() {
    // The Exit at Z=-75
    const zBase = -75;
    
    // End wall
    const endWall = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 2), this.mats.concrete);
    endWall.position.set(0, 3.5, zBase - 2);
    endWall.receiveShadow = true;
    this.scene.add(endWall);

    // The Heavy Steel Door (cracked open)
    const door = new THREE.Mesh(new THREE.BoxGeometry(6, 6.5, 0.5), this.mats.steel);
    door.position.set(-1, 3.25, zBase - 1);
    door.rotation.y = 0.1; // Cracked open slightly
    door.castShadow = true;
    this.scene.add(door);

    // Daylight spilling through the crack
    const glowGeo = new THREE.PlaneGeometry(1, 7);
    const glow = new THREE.Mesh(glowGeo, this.mats.doorGlow);
    glow.position.set(2, 3.5, zBase - 0.9);
    this.scene.add(glow);

    // The Communications Terminal
    const terminalGeo = new THREE.BoxGeometry(1.5, 3, 1);
    const terminal = new THREE.Mesh(terminalGeo, this.mats.steel);
    terminal.position.set(5, 1.5, zBase);
    terminal.castShadow = true;
    terminal.receiveShadow = true;
    this.scene.add(terminal);

    const screenGeo = new THREE.PlaneGeometry(1.3, 1);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x2244aa }); // Glowing terminal screen
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(5, 2.5, zBase + 0.51);
    this.scene.add(screen);
  }
}
