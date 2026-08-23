import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { MaterialSystem } from './materials.js';
import { BlueprintGenerator } from './blueprints.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    
    this.mats = {
        concrete: MaterialSystem.getConcreteMaterial(0x2a2a2a, 1.0),
        darkStone: MaterialSystem.getConcreteMaterial(0x111111, 2.0),
        steel: MaterialSystem.getSteelMaterial(),
        wood: MaterialSystem.getWoodMaterial(),
        doorGlow: new THREE.MeshBasicMaterial({ color: 0x4466aa, transparent: true, opacity: 0.5 })
    };

    this.geos = {
        rib: new THREE.BoxGeometry(1.5, 7, 1.5),
        beam: new THREE.BoxGeometry(24, 0.5, 1.5),
        wall: new THREE.BoxGeometry(1.5, 7, 10.5),
        alcoveFloor: new THREE.PlaneGeometry(10, 10),
        blade: new THREE.BoxGeometry(2.1, 0.15, 7.8),
        led: new THREE.BoxGeometry(0.05, 0.05, 0.05)
    };

    this.buildArchitecture();
  }

  buildArchitecture() {
    this.buildFloorAndCeiling();
    this.buildIdentityAnchor(); 
    this.buildMainSpine();      
    this.buildArchives();       
    this.buildArmory();         
    this.buildThreshold();      
  }

  buildFloorAndCeiling() {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 120, 20, 100), this.mats.concrete);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -40); 
    floor.receiveShadow = true;
    this.scene.add(floor);

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
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), this.mats.concrete);
    base.position.set(0, 0.5, 0);
    coreGroup.add(base);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 6, 8), this.mats.darkStone);
    pillar.position.set(0, 4, 0);
    coreGroup.add(pillar);

    const bracketTop = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), this.mats.steel);
    bracketTop.position.set(0, 6.5, 0);
    coreGroup.add(bracketTop);
    
    const bracketMid = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 3.5), this.mats.steel);
    bracketMid.position.set(0, 4, 0);
    coreGroup.add(bracketMid);

    const loadBeam = new THREE.Mesh(new THREE.BoxGeometry(24, 1, 4), this.mats.steel);
    loadBeam.position.set(0, 7, 0);
    coreGroup.add(loadBeam);

    this.scene.add(coreGroup);
  }

  buildMainSpine() {
    for (let i = 1; i <= 6; i++) {
        const zPos = -(i * 12); 
        const isProjectAlcove = (zPos === -12 || zPos === -24 || zPos === -36); 
        const isStoryBranch = (zPos === -48); 
        
        const ribL = new THREE.Mesh(this.geos.rib, this.mats.darkStone);
        ribL.position.set(-11, 3.5, zPos);
        ribL.castShadow = true;
        ribL.receiveShadow = true;
        this.scene.add(ribL);

        const ribR = new THREE.Mesh(this.geos.rib, this.mats.darkStone);
        ribR.position.set(11, 3.5, zPos);
        ribR.castShadow = true;
        ribR.receiveShadow = true;
        this.scene.add(ribR);

        const topBeam = new THREE.Mesh(this.geos.beam, this.mats.steel);
        topBeam.position.set(0, 6.75, zPos);
        topBeam.castShadow = true;
        topBeam.receiveShadow = true;
        this.scene.add(topBeam);

        if (!isProjectAlcove) {
            const wallL = new THREE.Mesh(this.geos.wall, this.mats.concrete);
            wallL.position.set(-11, 3.5, zPos + 6);
            wallL.receiveShadow = true;
            this.scene.add(wallL);
        } else {
            const alcoveFloor = new THREE.Mesh(this.geos.alcoveFloor, this.mats.concrete);
            alcoveFloor.rotation.x = -Math.PI / 2;
            alcoveFloor.position.set(-16, 0.01, zPos + 6);
            alcoveFloor.receiveShadow = true;
            this.scene.add(alcoveFloor);
            
            const alcoveWall = new THREE.Mesh(this.geos.wall, this.mats.darkStone);
            alcoveWall.position.set(-21, 3.5, zPos + 6);
            alcoveWall.receiveShadow = true;
            this.scene.add(alcoveWall);
        }

        if (!isStoryBranch) {
            const wallR = new THREE.Mesh(this.geos.wall, this.mats.concrete);
            wallR.position.set(11, 3.5, zPos + 6);
            wallR.receiveShadow = true;
            this.scene.add(wallR);
        }
    }
  }

  buildArchives() {
    const zBase = -40;
    const curveGeo = new THREE.CylinderGeometry(15, 15, 7, 16, 1, false, 0, Math.PI / 2);
    const curve = new THREE.Mesh(curveGeo, this.mats.concrete);
    curve.position.set(20, 3.5, zBase + 10);
    curve.receiveShadow = true;
    this.scene.add(curve);

    const archiveFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), this.mats.wood);
    archiveFloor.rotation.x = -Math.PI / 2;
    archiveFloor.position.set(21, 0.02, zBase);
    archiveFloor.receiveShadow = true;
    this.scene.add(archiveFloor);

    this.storyArtifact = new THREE.Group();
    this.storyArtifact.position.set(21, 0, zBase);
    
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4), this.mats.wood);
    tableTop.position.set(0, 2.5, 0);
    tableTop.rotation.x = 0.2; 
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.storyArtifact.add(tableTop);
    
    const blueprintTex = BlueprintGenerator.createStoryBlueprint();
    const blueprintMat = new THREE.MeshStandardMaterial({
        map: blueprintTex,
        roughness: 0.5,
        metalness: 0.1
    });
    const blueprint = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.5), blueprintMat);
    blueprint.rotation.x = -Math.PI / 2;
    blueprint.position.set(0, 0.11, 0); 
    tableTop.add(blueprint);

    const tableLegs = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.4, 3.8), this.mats.steel);
    tableLegs.position.set(0, 1.2, 0);
    tableLegs.castShadow = true;
    this.storyArtifact.add(tableLegs);
    
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 5), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 1.5, 0);
    this.storyArtifact.add(hitBox);
    
    this.storyArtifact.userData = {
        isStory: true,
        hitBox: hitBox,
        originalY: 0, 
        focusPos: new THREE.Vector3(21, 5.5, zBase + 2.5), 
        focusRot: new THREE.Vector2(-Math.PI / 4, 0)
    };
    
    this.scene.add(this.storyArtifact);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 1), this.mats.darkStone);
    backWall.position.set(31, 3.5, zBase);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
  }

  buildArmory() {
    const zBase = -50;
    
    const rackRecessGeo = new THREE.BoxGeometry(3, 6, 8);
    const rackRecess = new THREE.Mesh(rackRecessGeo, this.mats.steel);
    rackRecess.position.set(-11.5, 3, zBase);
    this.scene.add(rackRecess);
    
    const skills = [
        "SYSTEMS ARCHITECTURE", 
        "BACKEND ENGINEERING", 
        "FRONTEND DEV", 
        "C++ / RUST", 
        "MOBILE ARCHITECTURE",
        "CYBERSECURITY BASICS",
        "AI-ASSISTED BUILDING",
        "DATABASE DESIGN"
    ];

    skills.forEach((skill, j) => {
        const blade = new THREE.Group();
        blade.position.set(-11, 1.2 + (j * 0.5), zBase);
        
        const chassis = new THREE.Mesh(this.geos.blade, this.mats.darkStone);
        blade.add(chassis);
        
        // Label mapped to front face
        const labelTex = BlueprintGenerator.createServerLabel(skill, j + 1);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTex });
        const labelGeo = new THREE.PlaneGeometry(2, 0.12);
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.set(0, 0, 3.91); 
        blade.add(labelMesh);

        const ledMat = new THREE.MeshBasicMaterial({ color: j % 2 === 0 ? 0x00ffaa : 0xffaa00 });
        const led = new THREE.Mesh(this.geos.led, ledMat);
        led.position.set(0.8, 0, 3.95);
        blade.add(led);
        
        this.scene.add(blade);
    });
  }

  buildThreshold() {
    const zBase = -75;
    
    const endWall = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 2), this.mats.concrete);
    endWall.position.set(0, 3.5, zBase - 2);
    endWall.receiveShadow = true;
    this.scene.add(endWall);

    const door = new THREE.Mesh(new THREE.BoxGeometry(6, 6.5, 0.5), this.mats.steel);
    door.position.set(-1, 3.25, zBase - 1);
    door.rotation.y = 0.1; 
    door.castShadow = true;
    this.scene.add(door);

    const glowGeo = new THREE.PlaneGeometry(1, 7);
    const glow = new THREE.Mesh(glowGeo, this.mats.doorGlow);
    glow.position.set(2, 3.5, zBase - 0.9);
    this.scene.add(glow);

    // Terminal Interaction setup
    this.terminalArtifact = new THREE.Group();
    this.terminalArtifact.position.set(5, 1.5, zBase);
    
    const terminalGeo = new THREE.BoxGeometry(1.5, 3, 1);
    const terminal = new THREE.Mesh(terminalGeo, this.mats.steel);
    terminal.castShadow = true;
    terminal.receiveShadow = true;
    this.terminalArtifact.add(terminal);

    const screenTex = BlueprintGenerator.createTerminalScreen();
    const screenGeo = new THREE.PlaneGeometry(1.3, 1);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex }); 
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.0, 0.51);
    this.terminalArtifact.add(screen);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 2), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 1.0, 0.5);
    this.terminalArtifact.add(hitBox);

    this.terminalArtifact.userData = {
        isTerminal: true,
        hitBox: hitBox,
        originalY: 1.5,
        focusPos: new THREE.Vector3(5, 2.5, zBase + 2.0),
        focusRot: new THREE.Vector2(0, 0)
    };

    this.scene.add(this.terminalArtifact);
  }
}
