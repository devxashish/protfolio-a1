import fs from 'fs';

let content = fs.readFileSync('src/3d/entry.js', 'utf8');

const oldUI = `        // Overlay to catch first interaction
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.cursor = 'pointer';
        document.body.appendChild(this.overlay);`;

const newUI = `        // Overlay to catch first interaction
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.cursor = 'pointer';
        this.overlay.style.display = 'flex';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.justifyContent = 'center';
        document.body.appendChild(this.overlay);

        const tapPrompt = document.createElement('div');
        tapPrompt.textContent = "TAP OR SCROLL TO INITIATE";
        tapPrompt.style.color = 'rgba(255,255,255,0.4)';
        tapPrompt.style.fontFamily = 'monospace';
        tapPrompt.style.letterSpacing = '4px';
        tapPrompt.style.fontSize = '12px';
        tapPrompt.style.animation = 'pulse 2s infinite';
        this.overlay.appendChild(tapPrompt);
        
        // Add pulse animation
        if (!document.getElementById('pulse-anim')) {
            const style = document.createElement('style');
            style.id = 'pulse-anim';
            style.innerHTML = \`
                @keyframes pulse {
                    0% { opacity: 0.2; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.2; }
                }
            \`;
            document.head.appendChild(style);
        }`;

content = content.replace(oldUI, newUI);
fs.writeFileSync('src/3d/entry.js', content);
