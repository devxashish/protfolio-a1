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
        this.sandFalling = true;
        
        this.elapsedReveal = 0;
        this.totalRevealDuration = 3.0; // architectural reveal time
        
        this.elapsedSand = 0;
        this.totalSandDuration = 4.0; // how long sand falls before reveal
        
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupDarkness();
        this.setupSand();
        this.setupUI();
        this.lockControls();
    }

    setupDarkness() {
        this.scene.fog = new THREE.FogExp2(0x000000, 0.15); // extreme fog
        
        this.origAmbient = this.lighting.ambientLight.intensity;
        this.origDir = this.lighting.directionalLight.intensity;
        this.origExt = this.lighting.exteriorLight.intensity;
        
        this.lighting.ambientLight.intensity = 0.01;
        this.lighting.directionalLight.intensity = 0;
        this.lighting.exteriorLight.intensity = 0;
        
        this.spotlight = new THREE.SpotLight(0xffffff, 0, 100, Math.PI / 6, 0.5, 1.0);
        this.spotlight.position.set(-10, 2, 8); 
        this.spotlight.target.position.set(0, 4, 0);
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = 2048;
        this.spotlight.shadow.mapSize.height = 2048;
        this.scene.add(this.spotlight);
        this.scene.add(this.spotlight.target);
    }

    setupSand() {
        const particleCount = 10000;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        // Spawn sand high above the camera at Z=13 to 16
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;          // X
            positions[i * 3 + 1] = 5 + (Math.random() * 25);        // Y (High up)
            positions[i * 3 + 2] = 12 + (Math.random() * 5);        // Z
            velocities.push({
                x: 0,
                y: -(1.5 + Math.random() * 2), // falling speed
                z: 0
            });
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const mat = new THREE.PointsMaterial({
            color: 0xaa8866, // sand color
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            depthWrite: false
        });

        this.sand = new THREE.Points(geo, mat);
        this.sandVelocities = velocities;
        this.scene.add(this.sand);
    }

    setupUI() {
        
        // No overlay, sand starts automatically
        this.overlay = null;


        

        const updateMouse = (e) => {
            // Normalized device coordinates (-1 to +1)
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            this.mouseX = (clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(clientY / window.innerHeight) * 2 + 1;
        };

        document.addEventListener('mousemove', updateMouse);
        document.addEventListener('touchmove', updateMouse, {passive: true});
        document.addEventListener('touchstart', updateMouse, {passive: true});

        
    }

    lockControls() {
        this.cameraController.enabled = false;
        this.cameraController.orbitRadius = 40;
        this.cameraController.targetRadius = 40;
    }

    startSand() {
        this.sandFalling = true;
        this.overlay.style.display = 'none';
        
        if (this.app.audio && this.app.audio.enabled) {
            // Audio integration
        }
    }

    startReveal() {
        this.sandFalling = false;
        this.isRevealing = true;
    }

    skip() {
        this.elapsedReveal = this.totalRevealDuration;
        this.completeSequence();
    }

    completeSequence() {
        this.isActive = false;
        this.isRevealing = false;
        this.sandFalling = false;
        
        if (this.overlay && this.overlay.parentNode) this.overlay.remove();
        if (this.skipBtn && this.skipBtn.parentNode) this.skipBtn.remove();
        if (this.sand) this.scene.remove(this.sand); // Remove sand to save memory
        this.subtitle.style.opacity = '1';
        
        this.scene.fog.density = 0.02;
        this.spotlight.intensity = 150;
        this.spotlight.position.set(0, 8, 4); 
        
        this.cameraController.targetRadius = 30;
        this.cameraController.enabled = true;
        
        this.lighting.ambientLight.intensity = this.origAmbient;
        this.lighting.directionalLight.intensity = this.origDir;
        this.lighting.exteriorLight.intensity = this.origExt;
    }

    update(delta) {
        if (!this.isActive) return;

        // Sand Physics
        if (this.sandFalling || this.isRevealing) {
            const positions = this.sand.geometry.attributes.position.array;
            
            // Unproject mouse to 3D world space for interaction
            const vector = new THREE.Vector3(this.mouseX, this.mouseY, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = 14; // distance from camera to interaction plane
            const mouse3D = this.camera.position.clone().add(dir.multiplyScalar(distance));

            for (let i = 0; i < positions.length / 3; i++) {
                // Apply velocities
                positions[i * 3] += this.sandVelocities[i].x * delta;
                positions[i * 3 + 1] += this.sandVelocities[i].y * delta;
                positions[i * 3 + 2] += this.sandVelocities[i].z * delta;
                
                const px = positions[i * 3];
                const py = positions[i * 3 + 1];
                const pz = positions[i * 3 + 2];
                
                // Mouse repulsion
                const dx = px - mouse3D.x;
                const dy = py - mouse3D.y;
                const distSq = dx*dx + dy*dy;
                
                if (distSq < 4.0) { // Interaction radius squared
                    const force = (4.0 - distSq) * 1.5;
                    this.sandVelocities[i].x += dx * force * delta;
                    this.sandVelocities[i].y += dy * force * delta;
                }
                
                // Friction / Air resistance for horizontal movement
                this.sandVelocities[i].x *= 0.95;
                this.sandVelocities[i].z *= 0.95;
                
                // If it falls below floor, slowly reset to top (continuous shower)
                if (positions[i * 3 + 1] < 0) {
                    if (this.sandFalling) {
                        positions[i * 3 + 1] = 10 + Math.random() * 5; // Reset high
                        this.sandVelocities[i].x = 0;
                        this.sandVelocities[i].z = 0;
                    }
                }
            }
            this.sand.geometry.attributes.position.needsUpdate = true;
            
            // Advance sequence
            if (this.sandFalling) {
                this.elapsedSand += delta;
                if (this.elapsedSand > this.totalSandDuration) {
                    this.startReveal();
                }
            }
        }

        // Architectural Reveal
        if (this.isRevealing) {
            this.elapsedReveal += delta;
            const progress = Math.min(this.elapsedReveal / this.totalRevealDuration, 1.0);
            
            const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.scene.fog.density = 0.15 - (ease * 0.13); // Ends at 0.02
            
            // Sand fades out
            this.sand.material.opacity = 0.6 * (1.0 - ease);

            this.spotlight.intensity = ease * 150; 
            
            this.spotlight.position.x = -8 + (ease * 8); 
            this.spotlight.position.y = 2 + (ease * 6);  
            this.spotlight.position.z = 8 - (ease * 4);  
            
            // Camera handled by CameraController
            
            if (progress > 0.7) {
                this.subtitle.style.opacity = ((progress - 0.7) / 0.3).toString();
            }

            if (progress >= 1.0) {
                this.completeSequence();
            }
        }
    }
}
