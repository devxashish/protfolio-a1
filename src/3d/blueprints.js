import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class BlueprintGenerator {
    static createStoryBlueprint() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Cyanotype Background
        ctx.fillStyle = '#0a2342';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i < canvas.width; i += 64) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 64) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Blueprint Header
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('ARCHITECTURAL ETHOS : A.X.D', 100, 100);
        ctx.fillRect(100, 120, 1800, 4);

        // Core Text
        ctx.font = '28px monospace';
        const lines = [
            "01. FOUNDATION",
            "    Self-taught. No traditional safety net.",
            "    Built from a mobile phone before acquiring heavy hardware.",
            "    Every constraint forces a deeper understanding of systems.",
            "",
            "02. ENGINEERING PHILOSOPHY",
            "    Refuse bloat. Respect the machine. Respect the user.",
            "    I build high-performance, bare-metal grade digital environments.",
            "",
            "03. THE OBJECTIVE",
            "    To architect software that does not merely function,",
            "    but possesses physical weight, precision, and soul."
        ];

        lines.forEach((line, index) => {
            ctx.fillText(line, 100, 250 + (index * 50));
        });

        // Schematic Graphics
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        ctx.strokeRect(1400, 250, 400, 400);
        ctx.beginPath(); ctx.arc(1600, 450, 150, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1400, 450); ctx.lineTo(1800, 450); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1600, 250); ctx.lineTo(1600, 650); ctx.stroke();
        
        ctx.font = '20px monospace';
        ctx.fillText('STRESS // TENSION // LOAD', 1400, 700);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }

    static createServerLabel(skillName, index) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#555';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(`0${index} :: ${skillName.toUpperCase()}`, 20, 44);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 2;
        return texture;
    }

    static createTerminalScreen() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4488ff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COMMS UPLINK', 256, 150);
        
        ctx.font = '24px monospace';
        ctx.fillText('AWAITING INTERACTION...', 256, 220);
        
        ctx.strokeStyle = '#4488ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, 412, 412);
        
        ctx.beginPath();
        ctx.arc(256, 350, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(68, 136, 255, 0.2)';
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }
}

    static createIdentityAlphaMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Black background (transparent to light in alpha map if inverted, wait:
        // For alphaMap: white is opaque (blocks light), black is transparent (lets light through).
        // If we want the SHADOW to spell ASHISH, the text must be WHITE (opaque) and the background BLACK (transparent).
        
        ctx.fillStyle = '#000000'; // Transparent to light
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff'; // Blocks light -> casts shadow
        ctx.font = 'bold 300px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '20px';
        ctx.fillText('ASHISH', canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }
