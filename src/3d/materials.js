import * as THREE from 'three';

const simplexNoiseGLSL = `
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const setupWorldPositionVertex = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>\n varying vec3 vWorldPosition;`
    );
    shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>\n vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`
    );
};

export class MaterialSystem {
    
    static getConcreteMaterial(color = 0x2a2a2a, scale = 1.0) {
        const mat = new THREE.MeshStandardMaterial({ 
            color: color, 
            roughness: 0.8, 
            metalness: 0.1 
        });

        mat.onBeforeCompile = (shader) => {
            setupWorldPositionVertex(shader);
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\n varying vec3 vWorldPosition;\n ${simplexNoiseGLSL}`
            );
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                 // Multi-frequency noise for concrete texture
                 float n1 = snoise(vWorldPosition * ${3.0 * scale});
                 float n2 = snoise(vWorldPosition * ${10.0 * scale});
                 float noise = (n1 * 0.7 + n2 * 0.3) * 0.5 + 0.5;
                 
                 // Apply noise to diffuse color
                 diffuseColor.rgb *= mix(0.8, 1.1, noise);
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <roughnessmap_fragment>',
                `#include <roughnessmap_fragment>
                 float rNoise = snoise(vWorldPosition * ${5.0 * scale}) * 0.5 + 0.5;
                 roughnessFactor *= mix(0.7, 1.0, rNoise);
                `
            );
        };
        return mat;
    }

    static getSteelMaterial() {
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1c, 
            roughness: 0.3, 
            metalness: 0.8 
        });

        mat.onBeforeCompile = (shader) => {
            setupWorldPositionVertex(shader);
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\n varying vec3 vWorldPosition;\n ${simplexNoiseGLSL}`
            );
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <roughnessmap_fragment>',
                `#include <roughnessmap_fragment>
                 // Anisotropic/scratched metal look
                 float rNoise = snoise(vec3(vWorldPosition.x * 20.0, vWorldPosition.y * 2.0, vWorldPosition.z * 20.0)) * 0.5 + 0.5;
                 roughnessFactor *= mix(0.8, 1.5, rNoise);
                `
            );
        };
        return mat;
    }

    static getWoodMaterial() {
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x4a3219, 
            roughness: 0.7, 
            metalness: 0.05 
        });

        mat.onBeforeCompile = (shader) => {
            setupWorldPositionVertex(shader);
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\n varying vec3 vWorldPosition;\n ${simplexNoiseGLSL}`
            );
            
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                 // Wood grain using sine waves warped by noise
                 vec3 pos = vWorldPosition * 2.0;
                 float noise = snoise(pos * 0.5);
                 float grain = sin((pos.x + pos.y + pos.z)*10.0 + noise * 5.0) * 0.5 + 0.5;
                 
                 diffuseColor.rgb *= mix(vec3(0.6, 0.4, 0.2), vec3(1.0), grain);
                `
            );
        };
        return mat;
    }
}
