import fs from 'fs';
let content = fs.readFileSync('src/3d/projects.js', 'utf8');

// The objects are created as "artifact" not "group".
// artifact.position.set(-16, 1.5, p.z + 6);
content = content.replace(/artifact\.position\.set\(-16, 1\.5, p\.z \+ 6\);/, "artifact.position.set(p.x, 1.5, p.z);");

// Ensure p.x exists in the data
content = content.replace("z: -12", "x: -2, z: 0"); // MS Security
content = content.replace("z: -24", "x: 0, z: -2"); // Unzip
content = content.replace("z: -36", "x: 2, z: 0");  // Atlas UI

// Update the focusPos logic so when clicked, camera looks at them properly
content = content.replace(/const focusPos = new THREE\.Vector3\(-14, 2\.5, p\.z\);/g, "const focusPos = new THREE.Vector3(p.x, 2.5, p.z + 2);");

// Wait, the new checkIntersections logic inside projects.js:
// const focusPos = new THREE.Vector3(artifact.position.x, 1.5, artifact.position.z + 2);
// This is already fine.

fs.writeFileSync('src/3d/projects.js', content);
