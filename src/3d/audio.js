export class AudioSystem {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.masterGain = null;
    
    // Nodes
    this.roomTone = null;
    this.rainTone = null;
    this.footstepTimer = 0;
    
    this.setupUI();
  }

  setupUI() {
    this.btn = document.getElementById('audio-toggle');
    if (this.btn) {
        this.btn.addEventListener('click', () => this.toggle());
    }
  }

  createNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
    }
    return buffer;
  }

  initAudio() {
    if (this.ctx) return;
    
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;
    this.masterGain.connect(this.ctx.destination);
    
    const noiseBuffer = this.createNoiseBuffer();

    // 1. INTERIOR ROOM TONE
    this.roomToneGain = this.ctx.createGain();
    this.roomToneGain.gain.value = 0.05;
    this.roomToneGain.connect(this.masterGain);
    
    const hum = this.ctx.createOscillator();
    hum.type = 'sine';
    hum.frequency.value = 55; // Sub bass hum
    hum.connect(this.roomToneGain);
    hum.start();

    // 2. EXTERIOR RAIN AMBIENCE
    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0; // Starts silent, increases near exit
    
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1000;
    rainFilter.Q.value = 0.5;
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    
    const rainNoise = this.ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;
    rainNoise.connect(rainFilter);
    rainNoise.start();
  }

  toggle() {
    if (!this.enabled) {
      if (!this.ctx) this.initAudio();
      this.ctx.resume();
      this.enabled = true;
      if (this.btn) this.btn.innerHTML = 'SOUND: ON';
      this.playLightClick(); // Feedback for clicking the button
    } else {
      this.ctx.suspend();
      this.enabled = false;
      if (this.btn) this.btn.innerHTML = 'SOUND: OFF';
    }
  }

  playLightClick() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playProjectHover() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playProjectClick() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playFootstep() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  update(delta, cameraZ, isTransitioning) {
    if (!this.enabled || !this.ctx) return;

    // Fade master volume out during cinematic transition
    if (isTransitioning) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
        return; // Stop updating other parameters
    }

    // Rain spatial mix: louder as Z approaches -75
    // Z goes from 5 (entry) down to -75 (exit)
    // Map -30 to -75 -> Volume 0.0 to 0.1
    let rainVol = 0;
    if (cameraZ < -30) {
        rainVol = Math.min(0.1, (Math.abs(cameraZ + 30) / 45) * 0.1);
    }
    this.rainGain.gain.setTargetAtTime(rainVol, this.ctx.currentTime, 0.5);
  }

  updateFootsteps(delta, velocity) {
    if (!this.enabled || !this.ctx) return;
    // Velocity is camera speed (Math.abs(targetZ - currentZ))
    if (velocity > 0.05) {
        this.footstepTimer -= delta;
        if (this.footstepTimer <= 0) {
            this.playFootstep();
            this.footstepTimer = 0.6; // step every 0.6 seconds of continuous movement
        }
    } else {
        this.footstepTimer = 0; // reset
    }
  }
}
