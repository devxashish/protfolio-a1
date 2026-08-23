import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Projects {
  constructor(scene) {
    this.scene = scene;
    this.artifacts = [];
    
    const projectData = [
      { 
        id: 'ms-security', 
        name: 'MS Security', 
        url: 'https://drive.google.com/file/d/1tf8zqLWN0mHaaUF2fFbYuzI1CDOv3uSf/view?usp=drive_link', 
        z: -12, 
        type: 'phone', 
        color: 0x2244aa,
        info: {
            what: "High-security mobile environment for restricted data.",
            built: "End-to-end encrypted local storage & secure comms.",
            role: "Lead Mobile Architect / C++ / Java",
            capability: "Zero-knowledge architecture implementation."
        }
      },
      { 
        id: 'get-unzip', 
        name: 'GET UNZIP', 
        url: 'https://unzip-web.netlify.app', 
        z: -24, 
        type: 'monitor', 
        color: 0xaa4422,
        info: {
            what: "Desktop-class web application for archive extraction.",
            built: "WASM-powered high-speed decompression engine.",
            role: "Fullstack Engineer / React / Rust",
            capability: "Client-side processing bypassing server limits."
        }
      },
      { 
        id: 'atlas-ui', 
        name: 'Atlas UI', 
        url: 'https://atlas-ui-three.vercel.app', 
        z: -36, 
        type: 'stack', 
        color: 0x22aa44,
        info: {
            what: "A comprehensive enterprise design system.",
            built: "30+ complex accessible React components.",
            role: "Frontend Engineer / TypeScript / CSS",
            capability: "Flawless accessibility and keyboard navigation."
        }
      }
    ];

    projectData.forEach((p, i) => {
        const artifact = this.createArtifact(p);
        
        artifact.position.set(-16, 1.5, p.z + 6);
        artifact.rotation.y = Math.PI / 2;
        
        artifact.userData = { ...p, originalY: 1.5, isProject: true };
        this.scene.add(artifact);
        this.artifacts.push(artifact);
        
        const sign = this.createSignage(p.name);
        sign.position.set(0, 2.5, 0); 
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
    } 
    
    const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(4, 4, 4), 
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
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
    const hitBoxes = this.artifacts.map(a => a.userData.hitBox);
    const intersects = this.raycaster.intersectObjects(hitBoxes);
    if (intersects.length > 0) {
        return intersects[0].object.parent; 
    }
    return null;
  }

  checkIntersections(camera, app) {
    const artifact = this.getHoveredArtifact(camera);
    if (artifact) {
        if (app.cameraController.isFocused) return;
        
        // 1. Enter Focus Mode
        const focusPos = new THREE.Vector3(-12, 1.5, artifact.position.z);
        const focusRot = new THREE.Vector2(0, Math.PI / 2);
        app.cameraController.focusOn(focusPos, focusRot);
        
        // 2. Show UI
        this.showProjectInfo(artifact.userData, app);
    }
  }

  showProjectInfo(data, app) {
    const overlay = document.createElement('div');
    overlay.id = 'project-focus-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.width = '100%';
    overlay.style.maxWidth = '400px';
    overlay.style.height = '100%';
    overlay.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(10,10,10,0.95) 20%, rgba(10,10,10,1) 100%)';
    overlay.style.color = '#fff';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.padding = '40px';
    overlay.style.boxSizing = 'border-box';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9000';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateX(20px)';
    overlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    const title = document.createElement('h2');
    title.textContent = data.name;
    title.style.margin = '0 0 30px 0';
    title.style.fontSize = '32px';
    title.style.letterSpacing = '2px';
    title.style.borderBottom = '1px solid #333';
    title.style.paddingBottom = '20px';

    const buildSection = (label, text) => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '20px';
        const h3 = document.createElement('h3');
        h3.textContent = label;
        h3.style.fontSize = '10px';
        h3.style.color = '#888';
        h3.style.letterSpacing = '1px';
        h3.style.textTransform = 'uppercase';
        h3.style.margin = '0 0 5px 0';
        const p = document.createElement('p');
        p.textContent = text;
        p.style.fontSize = '14px';
        p.style.lineHeight = '1.6';
        p.style.margin = '0';
        p.style.color = '#ddd';
        wrapper.appendChild(h3);
        wrapper.appendChild(p);
        return wrapper;
    };

    overlay.appendChild(title);
    overlay.appendChild(buildSection("What It Is", data.info.what));
    overlay.appendChild(buildSection("What I Built", data.info.built));
    overlay.appendChild(buildSection("Technology / Role", data.info.role));
    overlay.appendChild(buildSection("Key Capability", data.info.capability));

    const btnWrapper = document.createElement('div');
    btnWrapper.style.marginTop = '40px';
    btnWrapper.style.display = 'flex';
    btnWrapper.style.gap = '20px';

    const launchBtn = document.createElement('a');
    launchBtn.textContent = 'LAUNCH DEMO';
    launchBtn.href = data.url;
    launchBtn.target = '_blank';
    launchBtn.style.padding = '10px 20px';
    launchBtn.style.background = '#fff';
    launchBtn.style.color = '#000';
    launchBtn.style.textDecoration = 'none';
    launchBtn.style.fontWeight = 'bold';
    launchBtn.style.fontSize = '12px';
    launchBtn.style.letterSpacing = '1px';
    launchBtn.style.borderRadius = '2px';

    const backBtn = document.createElement('button');
    backBtn.textContent = 'BACK TO SPINE';
    backBtn.style.padding = '10px 20px';
    backBtn.style.background = 'transparent';
    backBtn.style.color = '#888';
    backBtn.style.border = '1px solid #333';
    backBtn.style.cursor = 'pointer';
    backBtn.style.fontWeight = 'bold';
    backBtn.style.fontSize = '12px';
    backBtn.style.letterSpacing = '1px';
    
    backBtn.onmouseover = () => { backBtn.style.color = '#fff'; backBtn.style.borderColor = '#888'; };
    backBtn.onmouseout = () => { backBtn.style.color = '#888'; backBtn.style.borderColor = '#333'; };

    backBtn.onclick = () => {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateX(20px)';
        setTimeout(() => overlay.remove(), 500);
        app.cameraController.exitFocus();
    };

    btnWrapper.appendChild(launchBtn);
    btnWrapper.appendChild(backBtn);
    overlay.appendChild(btnWrapper);
    
    document.body.appendChild(overlay);

    // Trigger reflow for animation
    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateX(0)';
  }

  update(delta, camera) {
    const time = Date.now() * 0.001;
    const hovered = this.getHoveredArtifact(camera);

    this.artifacts.forEach((group, i) => {
        // Idle hover animation
        group.position.y = group.userData.originalY + Math.sin(time + i) * 0.1;
        
        // Highlight if hovered
        const scaleTarget = (group === hovered) ? 1.05 : 1.0;
        group.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 10);
    });
  }
}
