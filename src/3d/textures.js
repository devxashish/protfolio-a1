import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Procedural noise generator for lightweight materials
export class TextureGenerator {
    static createNoiseTexture(width, height, scale, opacity = 1.0) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Very fast pseudo-random noise
            const val = (Math.random() * 255) * opacity;
            data[i] = val;     // R
            data[i+1] = val;   // G
            data[i+2] = val;   // B
            data[i+3] = 255;   // A
        }
        
        ctx.putImageData(imgData, 0, 0);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(scale, scale);
        // Optimize for performance
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.anisotropy = 4; 
        
        return texture;
    }
    
    static createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Simple procedural wood-grain imitation
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(0,0,256,256);
        
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for(let i=0; i<50; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random()*256, 0);
            ctx.bezierCurveTo(Math.random()*256, 128, Math.random()*256, 128, Math.random()*256, 256);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
}
