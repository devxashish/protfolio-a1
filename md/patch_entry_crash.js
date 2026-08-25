import fs from 'fs';
let content = fs.readFileSync('src/3d/entry.js', 'utf8');

// Fix exteriorLight crash
content = content.replace("this.origExt = this.lighting.exteriorLight.intensity;", "this.origExt = this.lighting.exteriorLight ? this.lighting.exteriorLight.intensity : 0;");
content = content.replace("this.lighting.exteriorLight.intensity = 0;", "if (this.lighting.exteriorLight) this.lighting.exteriorLight.intensity = 0;");
content = content.replace("this.lighting.exteriorLight.intensity = this.origExt;", "if (this.lighting.exteriorLight) this.lighting.exteriorLight.intensity = this.origExt;");

fs.writeFileSync('src/3d/entry.js', content);
