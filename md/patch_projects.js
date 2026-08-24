import fs from 'fs';
let content = fs.readFileSync('src/3d/projects.js', 'utf8');

// Change project positions to be inside the samurai house (radius < 5)
content = content.replace("z: -12", "x: -2, z: 0"); // MS Security
content = content.replace("z: -24", "x: 0, z: -2"); // Unzip
content = content.replace("z: -36", "x: 2, z: 0");  // Atlas UI

// We also need to fix how they are positioned since the old loop just used z.
// The old code did: group.position.set(-16, 2, p.z);
content = content.replace("group.position.set(-16, 2, p.z);", "group.position.set(p.x, 2, p.z);");
content = content.replace("group.userData.originalY = 2;", "group.userData.originalY = 2;"); // just finding anchor
content = content.replace("new THREE.Vector3(-14, 2.5, p.z)", "new THREE.Vector3(p.x, 2.5, p.z + 2)"); // focusPos

fs.writeFileSync('src/3d/projects.js', content);
