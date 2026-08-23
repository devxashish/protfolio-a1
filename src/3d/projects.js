import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Projects {
  constructor(scene) {
    this.scene = scene;
    this.artifacts = [];
    
    const projectData = [
      { id: 'ms-security', name: 'MS Security', url: 'https://drive.google.com/file/d/1tf8zqLWN0mHaaUF2fFbYuzI1CDOv3uSf/view?usp=drive_link', z: -36, type: 'phone', color: 0x2244aa },
      { id: 'get-unzip', name: 'GET UNZIP', url: 'https://unzip-web.netlify.app', z: -48, type: 'monitor', color: 0xaa4422 },
      { id: 'atlas-ui', name: 'Atlas UI', url: 'https://atlas-ui-three.vercel.app', z: -60, type: 'stack', color: 0x22aa44 },
      { id: 'portfolio', name: 'This Portfolio', url: 'https://github.com/devxashish/protfolio-a1', z: -72, type: 'blueprint', color: 0x888888 }
    ];

    projectData.forEach((p, i) => {
        const artifact = this.createArtifact(p);
        
        const xOffset = i % 2 === 0 ? -3 : 3;
        artifact.position.set(xOffset, 1.5, p.z);
        
        // Orient towards center
        artifact.lookAt(0, 1.5, p.z);
        
        artifact.userData = { url: p.url, originalY: 1.5, name: p.name, isProject: true };
        this.scene.add(artifact);
        this.artifacts.push(artifact);
        
        // Add Signage
        const sign = this.createSignage(p.name);
        sign.position.set(0, 2, 0); // Relative to artifact
        artifact.add(sign);
    });

    this.setupInteraction();
  }

  createArtifact(data) {
    const group = new THREE.Group();
    let geo;
    const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.2, metalness: 0.8 });
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    
    if (data.type === 'phone') {
        // Phone on a pedestal
        geo = new THREE.BoxGeometry(0.8, 1.6, 0.1); 
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 1.2;
        mesh.castShadow = true;
        group.add(mesh);
        
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.2), deskMat);
        pedestal.position.y = 0.6;
        pedestal.castShadow = true;
        group.add(pedestal);
        group.userData.hitMesh = mesh;
    } else if (data.type === 'monitor') {
        // Monitor on a heavy workstation desk
        geo = new THREE.BoxGeometry(2.5, 1.5, 0.1); 
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 1.6;
        mesh.castShadow = true;
        
        const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), deskMat);
        desk.position.y = 0.5;
        desk.castShadow = true;
        
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.4), deskMat);
        stand.position.y = 1.2;
        
        group.add(mesh);
        group.add(stand);
        group.add(desk);
        group.userData.hitMesh = mesh;
    } else if (data.type === 'stack') {
        // 3 floating planes (cinematic display), tethered by wires/base
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 1.5), deskMat);
        base.position.y = 0.1;
        group.add(base);
        
        const meshGroup = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 1.2), mat);
            plane.position.y = 1.0 + (i * 0.4);
            plane.rotation.x = Math.PI / 8;
            plane.castShadow = true;
            meshGroup.add(plane);
        }
        group.add(meshGroup);
        group.userData.hitMesh = meshGroup;
    } else {
        // blueprint table
        geo = new THREE.BoxGeometry(2.5, 0.1, 1.5);
        const table = new THREE.Mesh(geo, deskMat);
        table.position.y = 1;
        table.rotation.x = Math.PI / 6;
        table.castShadow = true;
        group.add(table);
        
        const blueprint = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.3), new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0x112233 }));
        blueprint.rotation.x = -Math.PI / 2;
        blueprint.position.set(0, 0.06, 0);
        table.add(blueprint);
        
        const legs = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), deskMat);
        legs.position.y = 0.5;
        group.add(legs);
        group.userData.hitMesh = table;
    }
    
    // Transparent hitbox for raycasting encompassing the whole structure
    const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3), 
        new THREE.MeshBasicMaterial({visible: false})
    );
    hitBox.position.y = 1.5;
    group.add(hitBox);
    group.userData.hitBox = hitBox;

    return group;
  }

  createSignage(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Sleek physical glass/plastic signage look
    ctx.fillStyle = 'rgba(10, 10, 10, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width-4, canvas.height-4);
    
    ctx.font = 'bold 80px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '5px';
    ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    // Instead of a sprite which always faces camera, make it a physical board attached to the artifact
    const geo = new THREE.PlaneGeometry(2.5, 0.6);
    const material = new THREE.MeshStandardMaterial({ 
        map: texture, 
        roughness: 0.1, 
        metalness: 0.8,
        emissive: 0x111111 
    });
    const mesh = new THREE.Mesh(geo, material);
    
    return mesh;
  }

  setupInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    const onPointerMove = (e) => {
        if (!e.touches) {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
            // Handle hover
            window.dispatchEvent(new CustomEvent('projectHover', { detail: this.pointer }));
        }
    };

    const onPointerDown = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.pointer.x = (clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(clientY / window.innerHeight) * 2 + 1;
        window.dispatchEvent(new CustomEvent('projectInteraction', { detail: this.pointer }));
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown, {passive: true});
  }

  getHoveredArtifact(camera) {
    this.raycaster.setFromCamera(this.pointer, camera);
    // Intersect the hitboxes (children of artifacts)
    const hitBoxes = this.artifacts.map(a => a.userData.hitBox);
    const intersects = this.raycaster.intersectObjects(hitBoxes);
    if (intersects.length > 0) {
        return intersects[0].object.parent; // Return the group
    }
    return null;
  }

  checkIntersections(camera, app) {
    const artifact = this.getHoveredArtifact(camera);
    if (artifact) {
        // Cinematic Transition
        app.cameraController.transitionTo(artifact.position, artifact.userData.url);
    }
  }

  update(delta, camera) {
    const time = Date.now() * 0.001;
    
    // Hover logic
    const hovered = this.getHoveredArtifact(camera);

    this.artifacts.forEach((group, i) => {
        // Idle animation
        group.position.y = group.userData.originalY + Math.sin(time + i) * 0.1;
        
        // Highlight if hovered
        const scaleTarget = (group === hovered) ? 1.2 : 1.0;
        group.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 10);
    });
  }
}
