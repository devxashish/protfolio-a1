import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { World } from './world.js';
import { CameraController } from './camera.js';
import { Lighting } from './lighting.js';
import { Weather } from './weather.js';
import { Projects } from './projects.js';
import { AudioSystem } from './audio.js';
import { EntrySequence } from './entry.js';

export class App {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'webgl-container';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.zIndex = '-1'; 
    this.container.style.pointerEvents = 'none'; 
    document.body.prepend(this.container);

    this.scene = new THREE.Scene();

    this.cameraController = new CameraController(this);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    const dpr = Math.min(window.devicePixelRatio, 2); 
    this.renderer.setPixelRatio(dpr);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this.lighting = new Lighting(this.scene);
    this.world = new World(this.scene);
    this.weather = new Weather(this.scene);
    this.projects = new Projects(this.scene);

    if (this.world.storyArtifact) {
        this.projects.artifacts.push(this.world.storyArtifact);
    }

    this.audio = new AudioSystem();

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.prefersReducedMotion) {
        this.entry = new EntrySequence(this);
    }

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
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
        if (this.entry && this.entry.isActive) {
            this.entry.update(delta);
        } else {
            this.cameraController.update(delta);
        }
        
        this.weather.update(delta, time);
        this.projects.update(delta, this.cameraController.camera);
        
        if (this.audio && this.audio.enabled) {
            const camVel = Math.abs(this.cameraController.targetZ - this.cameraController.currentZ);
            this.audio.updateFootsteps(delta, camVel);
            this.audio.update(delta, this.cameraController.currentZ, this.cameraController.isTransitioning);
        }
    }
    
    this.lighting.update(this.cameraController.camera.position);

    this.renderer.render(this.scene, this.cameraController.camera);
  }
}
