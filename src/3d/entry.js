import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class EntrySequence {
    constructor(app) {
        this.app = app;
        this.scene = app.scene;
        this.camera = app.cameraController.camera;
        this.cameraController = app.cameraController;
        this.lighting = app.lighting;
        
        this.isActive = true;
        this.isRevealing = false;
        this.elapsed = 0;
        this.totalDuration = 4.0;
        
        // Save original lighting values
        this.origAmbient = this.lighting.ambientLight.intensity;
        this.origDir = this.lighting.directionalLight.intensity;
        this.origExt = this.lighting.exteriorLight.intensity;
        
        this.setupEnvironment();
        this.setupShadowRig();
        this.setupDust();
        this.setupUI();
        this.lockControls();
    }

    setupEnvironment() {
        // Initial darkness (perceived, not literal black)
        this.scene.fog = new THREE.FogExp2(0x020202, 0.12);
        this.scene.background = new THREE.Color(0x020202);
        
        // Turn off all main lights initially for the dark void effect
        this.lighting.ambientLight.intensity = 0;
        this.lighting.directionalLight.intensity = 0;
        this.lighting.exteriorLight.intensity = 0;
        
        // Force tungstens to 0 immediately so they don't fade in if camera is near
        this.lighting.tungstens.forEach(t => t.light.intensity = 0);
    }

    setupShadowRig() {
        // Spotlight for the reveal
        this.spotlight = new THREE.SpotLight(0xffffff, 0);
        this.spotlight.position.set(-8, 8, 8); // Start wide and low
        this.spotlight.angle = Math.PI / 4;
        this.spotlight.penumbra = 0.5;
        this.spotlight.decay = 2;
        this.spotlight.distance = 50;
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = 1024;
        this.spotlight.shadow.mapSize.height = 1024;
        this.spotlight.shadow.camera.near = 1;
        this.spotlight.shadow.camera.far = 20;
        
        this.target = new THREE.Object3D();
        this.target.position.set(0, 0, 0);
        this.scene.add(this.target);
        this.spotlight.target = this.target;
        
        this.scene.add(this.spotlight);

        // The "ASHISH" Shadow Mask
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black'; // Alpha 0 in alphaMap
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white'; // Alpha 1 in alphaMap
        ctx.font = 'bold 160px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '10px';
        ctx.fillText('ASHISH', canvas.width / 2, canvas.height / 2);

        const alphaMap = new THREE.CanvasTexture(canvas);
        alphaMap.anisotropy = 4;

        const maskGeo = new THREE.PlaneGeometry(8, 2);
        const maskMat = new THREE.MeshStandardMaterial({
            alphaMap: alphaMap,
            alphaTest: 0.5,
            colorWrite: false, // Do not render to screen
            depthWrite: true   // Render to shadow map
        });

        this.shadowMask = new THREE.Mesh(maskGeo, maskMat);
        // Position it just above the floor, embedded in the Z=0 pillar
        this.shadowMask.position.set(0, 2, 1);
        this.shadowMask.rotation.x = -0.2; // Slight tilt
        this.shadowMask.castShadow = true;
        this.scene.add(this.shadowMask);
        
        // Disable shadow casting on the abstract core geometry to let the mask cleanly cast the word
        this.scene.traverse((child) => {
            if (child.isMesh && child.position.z === 0 && child.position.y > 0) {
                if (child !== this.shadowMask) {
                    child.castShadow = false;
                }
            }
        });
    }

    setupDust() {
        // Very lightweight particle system
        const particleCount = 200;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20 + 5;
            velocities.push({
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            });
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const mat = new THREE.PointsMaterial({
            color: 0x888888,
            size: 0.05,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        });

        this.dust = new THREE.Points(geo, mat);
        this.dustVelocities = velocities;
        this.scene.add(this.dust);
    }

    setupUI() {
        // Overlay to catch first interaction
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.cursor = 'pointer';
        document.body.appendChild(this.overlay);

        // Subtitle (hidden initially)
        this.subtitle = document.createElement('div');
        this.subtitle.textContent = "SOFTWARE ENGINEER";
        this.subtitle.style.position = 'fixed';
        this.subtitle.style.top = '60%';
        this.subtitle.style.width = '100%';
        this.subtitle.style.textAlign = 'center';
        this.subtitle.style.color = '#fff';
        this.subtitle.style.fontFamily = 'monospace';
        this.subtitle.style.letterSpacing = '5px';
        this.subtitle.style.fontSize = '12px';
        this.subtitle.style.opacity = '0';
        this.subtitle.style.transition = 'opacity 2s ease';
        this.subtitle.style.zIndex = '10';
        this.subtitle.style.pointerEvents = 'none';
        document.body.appendChild(this.subtitle);

        // Elegant Skip
        this.skipBtn = document.createElement('div');
        this.skipBtn.textContent = "SKIP";
        this.skipBtn.style.position = 'fixed';
        this.skipBtn.style.bottom = '20px';
        this.skipBtn.style.right = '20px';
        this.skipBtn.style.color = 'rgba(255,255,255,0.3)';
        this.skipBtn.style.fontFamily = 'monospace';
        this.skipBtn.style.fontSize = '10px';
        this.skipBtn.style.letterSpacing = '2px';
        this.skipBtn.style.cursor = 'pointer';
        this.skipBtn.style.zIndex = '10000';
        this.skipBtn.style.transition = 'color 0.3s';
        this.skipBtn.onmouseover = () => this.skipBtn.style.color = 'rgba(255,255,255,0.8)';
        this.skipBtn.onmouseout = () => this.skipBtn.style.color = 'rgba(255,255,255,0.3)';
        document.body.appendChild(this.skipBtn);

        // Bind events
        const trigger = (e) => {
            if (!this.isRevealing) {
                if (e.target === this.skipBtn) return;
                this.startReveal();
            }
        };

        this.overlay.addEventListener('click', trigger);
        this.overlay.addEventListener('touchstart', trigger);
        this.overlay.addEventListener('wheel', trigger);
        
        this.skipBtn.addEventListener('click', () => {
            this.skip();
        });
    }

    lockControls() {
        this.cameraController.enabled = false;
        this.cameraController.currentZ = 16;
        this.cameraController.targetZ = 16;
        this.camera.position.z = 16;
        this.camera.position.y = 1.7;
    }

    startReveal() {
        this.isRevealing = true;
        this.overlay.style.display = 'none';
        
        // Physical disturbance: dust swirls briefly
        this.dustVelocities.forEach(v => {
            v.x += (Math.random() - 0.5) * 0.5;
            v.y += (Math.random() - 0.5) * 0.5;
            v.z += (Math.random() - 0.5) * 0.5;
        });
        
        // Play subtle rumble
        if (this.app.audio && this.app.audio.enabled) {
            // Future audio integration point
        }
    }

    skip() {
        this.elapsed = this.totalDuration;
        this.completeSequence();
    }

    completeSequence() {
        this.isActive = false;
        this.isRevealing = false;
        
        // Cleanup UI
        if (this.overlay && this.overlay.parentNode) this.overlay.remove();
        if (this.skipBtn && this.skipBtn.parentNode) this.skipBtn.remove();
        this.subtitle.style.opacity = '1';
        
        // Snap to final state
        this.scene.fog.density = 0.02;
        this.spotlight.intensity = 150;
        this.spotlight.position.set(0, 8, 4); // Final light position
        
        // Unlock camera exactly at Z=15, Y=1.5
        this.camera.position.z = 15;
        this.camera.position.y = 1.5;
        this.cameraController.currentZ = 15;
        this.cameraController.targetZ = 15;
        this.cameraController.enabled = true;
        
        // Restore standard world lights
        this.lighting.ambientLight.intensity = this.origAmbient;
        this.lighting.directionalLight.intensity = this.origDir;
        this.lighting.exteriorLight.intensity = this.origExt;
        
        // Tungsten lights will naturally trigger via lighting.update() since distance is now active
    }

    update(delta) {
        if (!this.isActive) return;

        // Dust ambient movement
        const positions = this.dust.geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += this.dustVelocities[i].x * delta;
            positions[i * 3 + 1] += this.dustVelocities[i].y * delta;
            positions[i * 3 + 2] += this.dustVelocities[i].z * delta;
            
            // Dampen disturbance back to slow ambient drift
            this.dustVelocities[i].x *= 0.95;
            this.dustVelocities[i].y *= 0.95;
            this.dustVelocities[i].z *= 0.95;
            
            // Re-inject subtle drift
            this.dustVelocities[i].x += (Math.random() - 0.5) * 0.001;
            this.dustVelocities[i].y += (Math.random() - 0.5) * 0.001;
            this.dustVelocities[i].z += (Math.random() - 0.5) * 0.001;
        }
        this.dust.geometry.attributes.position.needsUpdate = true;

        if (!this.isRevealing) return;

        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.totalDuration, 1.0);
        
        // Easing function (easeInOutQuad)
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // 1. Fog dissipates slightly
        this.scene.fog.density = 0.12 - (ease * 0.10); // Ends at 0.02

        // 2. Spotlight sweeps and intensifies
        this.spotlight.intensity = ease * 150; 
        
        // Light moves from side/low to top/center to perfectly align the shadow
        this.spotlight.position.x = -8 + (ease * 8); // -8 to 0
        this.spotlight.position.z = 8 - (ease * 4);  // 8 to 4
        
        // 3. Camera drifts forward and slightly down
        this.camera.position.z = 16 - (ease * 1); // 16 to 15
        this.camera.position.y = 1.7 - (ease * 0.2); // 1.7 to 1.5
        this.cameraController.currentZ = this.camera.position.z;
        this.cameraController.targetZ = this.camera.position.z;
        
        // 4. Subtitle fades in late
        if (progress > 0.7) {
            this.subtitle.style.opacity = ((progress - 0.7) / 0.3).toString();
        }

        // 5. Completion
        if (progress >= 1.0) {
            this.completeSequence();
        }
    }
}
