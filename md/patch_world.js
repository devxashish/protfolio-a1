import fs from 'fs';

let content = fs.readFileSync('src/3d/world.js', 'utf8');

const replacement = `  buildIdentityAnchor() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    
    // Abstract physical blocks that just look like concrete architecture
    const base = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 4), this.mats.concrete);
    base.position.set(0, 1, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    coreGroup.add(base);

    const pillar1 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), this.mats.darkStone);
    pillar1.position.set(-3, 5, 0);
    pillar1.castShadow = true;
    coreGroup.add(pillar1);
    
    const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), this.mats.darkStone);
    pillar2.position.set(3, 5, 0);
    pillar2.castShadow = true;
    coreGroup.add(pillar2);

    const loadBeam = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 3), this.mats.steel);
    loadBeam.position.set(0, 8.5, 0);
    loadBeam.castShadow = true;
    coreGroup.add(loadBeam);

    // The Cinematic Trick: Invisible shadow caster plane
    const alphaMap = BlueprintGenerator.createIdentityAlphaMap();
    const shadowMat = new THREE.MeshBasicMaterial({
        alphaMap: alphaMap,
        alphaTest: 0.5,
        colorWrite: false, // Don't render the plane itself
        depthWrite: true   // Do render it to the depth buffer for shadows
    });
    
    const shadowCaster = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), shadowMat);
    // Position it hovering between the spotlight and the architecture
    shadowCaster.position.set(0, 4, 4); 
    shadowCaster.castShadow = true;
    // Don't let it receive shadows, only cast them
    shadowCaster.receiveShadow = false; 
    coreGroup.add(shadowCaster);

    this.scene.add(coreGroup);
  }`;

// Replace the old method. It spans from "buildIdentityAnchor() {" to the next method "buildMainSpine() {"
const regex = /buildIdentityAnchor\(\) \{[\s\S]*?buildMainSpine\(\) \{/;
content = content.replace(regex, replacement + '\n\n  buildMainSpine() {');

fs.writeFileSync('src/3d/world.js', content);
