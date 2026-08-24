import fs from 'fs';

let content = fs.readFileSync('src/3d/world.js', 'utf8');

// Inside buildMainSpine, we want to add holographic signage at the alcove entrances
const oldCode = `        if (!isProjectAlcove) {
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
        }`;

const newCode = `        if (!isProjectAlcove) {
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

            // Add subtle holographic signage at the entrance
            let labelText = "ARCHIVE";
            if (zPos === -12) labelText = "PRJ_01: MOBILE_SEC";
            if (zPos === -24) labelText = "PRJ_02: UNZIP_WEB";
            if (zPos === -36) labelText = "PRJ_03: ATLAS_UI";

            const signTex = BlueprintGenerator.createHolographicSign(labelText);
            const signMat = new THREE.MeshBasicMaterial({ 
                map: signTex, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false 
            });
            const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), signMat);
            signMesh.position.set(-9, 5, zPos + 2); // Hovering at the entrance
            signMesh.rotation.y = Math.PI / 4; // Angled to be visible from the spine
            this.scene.add(signMesh);
        }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/3d/world.js', content);
