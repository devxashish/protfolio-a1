import fs from 'fs';

let content = fs.readFileSync('src/3d/blueprints.js', 'utf8');

const newMethod = `    static createHolographicSign(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#88ccff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        
        ctx.strokeStyle = 'rgba(136, 204, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 492, 108);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }
}
`;

content = content.replace('}\n', newMethod);
fs.writeFileSync('src/3d/blueprints.js', content);
