import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { TextureGenerator } from './textures.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.buildArchitecture();
  }

  buildArchitecture() {
    // Procedural Maps (Lightweight)
    const concreteNoise = TextureGenerator.createNoiseTexture(512, 512, 4, 0.1);
    const stoneNoise = TextureGenerator.createNoiseTexture(256, 256, 10, 0.3);
    const metalNoise = TextureGenerator.createNoiseTexture(128, 128, 2, 0.2);
    
    // Architectural Materials
    const concreteMat = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a, roughness: 0.9, metalness: 0.1, bumpMap: concreteNoise, bumpScale: 0.05 
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, roughness: 0.95, metalness: 0.2, bumpMap: stoneNoise, bumpScale: 0.1 
    });
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, roughness: 0.4, metalness: 0.8, roughnessMap: metalNoise 
    });
    const woodMat = new THREE.MeshStandardMaterial({ 
        map: TextureGenerator.createWoodTexture(), roughness: 0.8, metalness: 0.05 
    });
    
    // Main Floor (Adding subtle floor seams via geometry or mapping, let's keep it simple)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 120, 10, 60), concreteMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -50);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceiling (with skylight gaps)
    const ceilingL = new THREE.Mesh(new THREE.PlaneGeometry(8, 120), darkStoneMat);
    ceilingL.rotation.x = Math.PI / 2;
    ceilingL.position.set(-6, 6, -50);
    ceilingL.receiveShadow = true;
    this.scene.add(ceilingL);

    const ceilingR = new THREE.Mesh(new THREE.PlaneGeometry(8, 120), darkStoneMat);
    ceilingR.rotation.x = Math.PI / 2;
    ceilingR.position.set(6, 6, -50);
    ceilingR.receiveShadow = true;
    this.scene.add(ceilingR);

    // Skylight glass (central gap)
    const skylightGeo = new THREE.PlaneGeometry(4, 120);
    const skylightMat = new THREE.MeshStandardMaterial({ color: 0x050510, transparent: true, opacity: 0.3, roughness: 0.1, metalness: 0.9 });
    const skylight = new THREE.Mesh(skylightGeo, skylightMat);
    skylight.rotation.x = Math.PI / 2;
    skylight.position.set(0, 6.1, -50); // Slightly above ceiling
    this.scene.add(skylight);

    // Walls
    const wallGeo = new THREE.PlaneGeometry(120, 6);
    const leftWall = new THREE.Mesh(wallGeo, concreteMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 3, -50);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, concreteMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(10, 3, -50);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // "BEARING WEIGHT" CORE STRUCTURE (Z = 0, entry focal point)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    
    // Massive concrete base
    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const base = new THREE.Mesh(baseGeo, concreteMat);
    base.position.set(0, 0.5, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    coreGroup.add(base);

    // Central stressed pillar
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1, 5, 8);
    const pillar = new THREE.Mesh(pillarGeo, darkStoneMat);
    pillar.position.set(0, 3, 0);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    coreGroup.add(pillar);

    // Heavy steel brackets clamping the pillar
    const bracketGeo = new THREE.BoxGeometry(2.5, 0.5, 2.5);
    const bracketTop = new THREE.Mesh(bracketGeo, metalMat);
    bracketTop.position.set(0, 5.25, 0);
    bracketTop.castShadow = true;
    coreGroup.add(bracketTop);
    
    const bracketMid = new THREE.Mesh(bracketGeo, metalMat);
    bracketMid.position.set(0, 3, 0);
    bracketMid.castShadow = true;
    coreGroup.add(bracketMid);

    // Ceiling cross-beam transferring load
    const loadBeam = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 3), metalMat);
    loadBeam.position.set(0, 5.5, 0);
    loadBeam.castShadow = true;
    loadBeam.receiveShadow = true;
    coreGroup.add(loadBeam);

    this.scene.add(coreGroup);

    // CORRIDOR ARCHES & BRANCHING
    for (let i = 1; i <= 8; i++) {
        const zPos = -(i * 12);
        
        // Is this a branch intersection? (Z = -24)
        const isBranch = (i === 2);
        
        if (isBranch) {
            // Create intersection opening
            const branchFloor = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), concreteMat);
            branchFloor.rotation.x = -Math.PI / 2;
            branchFloor.position.set(0, 0.01, zPos);
            branchFloor.receiveShadow = true;
            this.scene.add(branchFloor);
            
            // Signage on the floor or beam
            const branchBeam = new THREE.Mesh(new THREE.BoxGeometry(40, 1, 2), metalMat);
            branchBeam.position.set(0, 5.5, zPos);
            branchBeam.castShadow = true;
            branchBeam.receiveShadow = true;
            this.scene.add(branchBeam);
            
            // Physical directional plaques
            const plaqueMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x444444});
            
            // Left: PROJECTS
            const leftPlaque = this.createPhysicalTextPlaque("← PROJECTS");
            leftPlaque.position.set(-5, 4.5, zPos + 1.1);
            this.scene.add(leftPlaque);
            
            // Right: STORY
            const rightPlaque = this.createPhysicalTextPlaque("STORY / ABOUT →");
            rightPlaque.position.set(5, 4.5, zPos + 1.1);
            this.scene.add(rightPlaque);
            
            continue; // Skip standard walls here to leave it open
        }

        // Standard Corridor Frame
        const sidePillarL = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), darkStoneMat);
        sidePillarL.position.set(-9, 3, zPos);
        sidePillarL.castShadow = true;
        sidePillarL.receiveShadow = true;
        this.scene.add(sidePillarL);

        const sidePillarR = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), darkStoneMat);
        sidePillarR.position.set(9, 3, zPos);
        sidePillarR.castShadow = true;
        sidePillarR.receiveShadow = true;
        this.scene.add(sidePillarR);
        
        const topBeam = new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 2), metalMat);
        topBeam.position.set(0, 5.75, zPos);
        topBeam.castShadow = true;
        topBeam.receiveShadow = true;
        this.scene.add(topBeam);
        
        // Wood accent panels on walls between pillars
        const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 10), woodMat);
        panelL.position.set(-9.8, 3, zPos + 6);
        this.scene.add(panelL);
        
        const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 10), woodMat);
        panelR.position.set(9.8, 3, zPos + 6);
        this.scene.add(panelR);
    }
  }

  createPhysicalTextPlaque(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Transparent background for painted text on steel
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 90px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '10px';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    
    const geo = new THREE.PlaneGeometry(4, 1);
    const mat = new THREE.MeshStandardMaterial({ 
        map: texture, 
        transparent: true, 
        emissive: 0xffffff, 
        emissiveMap: texture,
        emissiveIntensity: 0.5 
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }
}
