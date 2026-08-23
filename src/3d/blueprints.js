import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class BlueprintGenerator {
    static createStoryBlueprint() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        
        // Cyanotype background
        ctx.fillStyle = '#0a2342';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        for (let i = 0; i < canvas.width; i += 64) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
        
        // Heavy grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        for (let i = 0; i < canvas.width; i += 512) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Blueprint details and markings
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        
        // Title
        ctx.font = 'bold 80px monospace';
        ctx.fillText("ARCHITECTURAL ETHOS // v1.0", 100, 150);
        ctx.fillRect(100, 180, 1000, 10);
        
        // Text blocks (answering "how I think, built alone, resilient")
        ctx.font = '45px monospace';
        const lineHeight = 70;
        
        const lines = [
            "01. FOUNDATION",
            "Self-taught. No traditional safety net.",
            "I built this engineering foundation alone, brick by brick.",
            "Resilience is not a buzzword; it is the core requirement.",
            "",
            "02. METHODOLOGY",
            "I do not rely on high-level frameworks to hide complexity.",
            "I study the low-level primitives.",
            "When the framework breaks, I know how to fix the engine.",
            "",
            "03. EXECUTION",
            "Code is a physical material.",
            "It must bear weight. It must not collapse under stress.",
            "Every function, every architecture must be deliberate."
        ];
        
        let startY = 350;
        lines.forEach(line => {
            if(line.startsWith("0")) {
                ctx.font = 'bold 55px monospace';
                startY += 40;
            } else {
                ctx.font = '45px monospace';
            }
            ctx.fillText(line, 100, startY);
            startY += lineHeight;
        });
        
        // Decorative technical drawings (geometric shapes)
        ctx.lineWidth = 6;
        ctx.strokeRect(1200, 300, 600, 600);
        ctx.beginPath(); ctx.arc(1500, 600, 250, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1200, 300); ctx.lineTo(1800, 900); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1800, 300); ctx.lineTo(1200, 900); ctx.stroke();
        
        // Annotations
        ctx.font = '30px monospace';
        ctx.fillText("FIG 1. LOAD BEARING DISTRIBUTION", 1200, 960);
        ctx.fillText("STATUS: VERIFIED", 1200, 1000);
        
        // Generate Texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        return texture;
    }
}
