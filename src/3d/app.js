import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { World } from './world.js';
import { CameraController } from './camera.js';
import { Lighting } from './lighting.js';
import { Weather } from './weather.js';
import { Projects } from './projects.js';
import { AudioSystem } from './audio.js';

export class App {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'webgl-container';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.zIndex = '-1'; // Behind HTML
    this.container.style.pointerEvents = 'none'; // Let pointer events pass through initially
    document.body.prepend(this.container);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050505, 0.15); // Start very thick (dark entry)

    this.cameraController = new CameraController(this);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Performance constraints
    const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2 for performance
    this.renderer.setPixelRatio(dpr);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Systems
    this.lighting = new Lighting(this.scene);
    this.world = new World(this.scene);
    this.weather = new Weather(this.scene);
    this.projects = new Projects(this.scene);

    // Initialize Audio
    this.audio = new AudioSystem();

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
    // Project hover/click audio events
    let lastHovered = null;
    window.addEventListener('projectHover', (e) => {
        this.projects.pointer = e.detail;
        const hovered = this.projects.getHoveredArtifact(this.cameraController.camera);
        if (hovered && hovered !== lastHovered) {
            this.audio.playProjectHover();
        }
        lastHovered = hovered;
    });

    window.addEventListener('projectInteraction', (e) => {
        this.projects.pointer = e.detail;
        const intersected = this.projects.getHoveredArtifact(this.cameraController.camera);
        if (intersected) {
            this.audio.playProjectClick();
            this.projects.checkIntersections(this.cameraController.camera, this);
        }
    });
    
    window.addEventListener('lightActivated', () => {
        if (this.audio && this.audio.enabled) {
            this.audio.playLightClick();
        }
    });
    
    // Check reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  onWindowResize() {
    this.cameraController.resize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    
    const delta = Math.min(this.clock.getDelta(), 0.1); 
    const time = this.clock.getElapsedTime();

    if (!this.prefersReducedMotion) {
        this.cameraController.update(delta);
        this.weather.update(delta, time);
        this.projects.update(delta, this.cameraController.camera);
        
        // Audio updates
        if (this.audio && this.audio.enabled) {
            const camVel = Math.abs(this.cameraController.targetZ - this.cameraController.currentZ);
            this.audio.updateFootsteps(delta, camVel);
            this.audio.update(delta, this.cameraController.currentZ, this.cameraController.isTransitioning);
        }
        
        // Entry Sequence: Fade fog from 0.15 down to 0.02
        if (this.scene.fog.density > 0.02) {
            this.scene.fog.density -= 0.05 * delta;
        }
    }
    
    this.lighting.update(this.cameraController.camera.position);

    this.renderer.render(this.scene, this.cameraController.camera);
  }
}
