import BaseAnimationMaterial from "./baseMaterial/BaseAnimationMaterial.js";
import * as THREE from "three";

var ShaderChunk = {};

ShaderChunk['quat_from_axis_angle'] = "vec4 quatFromAxisAngle(vec3 axis, float angle) \n {\n float halfAngle = angle * 0.5; \n return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n}\n";

ShaderChunk['rotate_vector'] = "vec3 rotateVector(vec4 q, vec3 v) \n { \n return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); \n} \n";

ShaderChunk['ease_in_ease_out_sin'] = "float easeInOutSin(float t) \n{ \n return (1.0 + sin(3.141618 * t - 3.141618/ 2.0)) / 2.0; \n} \n";

class RainParticleMaterial extends BaseAnimationMaterial{
    constructor(params, uniformValues) {
        super(params);

        var shadowShader = THREE.ShaderLib['shadow'];
        this.vertexColors = THREE.VertexColors;
        this.lights = true; 
        this.side = THREE.DoubleSide;
        this.uniforms = THREE.UniformsUtils.merge([shadowShader.uniforms, this.uniforms])
        var testShader = `
                uniform vec4 color;

                void main() { 

                gl_FragColor = color;   // red
            
                }
            `

        this.vertexShader = this._concatVertexShader();
        this.fragmentShader = shadowShader.fragmentShader;

        this.setUniformValues(uniformValues)
    }

}

RainParticleMaterial.prototype._concatMainVertexFunctions = function() {
    return this.mainVertexFunctions.join('\n');
}

RainParticleMaterial.prototype._concatVertexShader = function() {
    return [
        //"#DEFINE PI =  3.1415926535897932384626433832795",

        
        this._concatParameters(),

        this._concatFunctions(),

        "void main() {",

        this._concatVertexInit(),

        this._concatMainVertexFunctions(),

        "}"
    ].join("\n");
}

// the rain particle material

const RainMat = new RainParticleMaterial({
    uniforms: {
        uPosition: {type: 'v3', value: [0,0,0]},
        uDuration: {type: 'f', value: 0.5},
        uProgress: {type: 'f', value: 0},
        color: {type: 'v3', value: [1,0,0]},
        opacity: {type: 'f', value: 0}
      },
    
    emissive: "#212121",
    flatShading: false,
    roughness: 0.1,

    shaderFunctions: [
        ShaderChunk['quat_from_axis_angle'],
        ShaderChunk["rotate_vector"],
        ShaderChunk["ease_in_ease_out_sin"],
    ],

    shaderVertexInit: [
        'float tProgress = easeInOutSin(min(1.0, max(0.0, (uProgress - aOffset)) / uDuration));',
        'vec3 newPosition = mix(aPositionStart, aPositionEnd, tProgress);',

        'vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), 3.141618/2.0);',
        'vec3 basePosition = rotateVector(quatX, position);'

    ],
    
    shaderParameters: [
        'attribute vec3 aPositionStart;',
        'attribute vec3 aPositionEnd;',
        'attribute float aOffset;',
        'uniform vec3 uPosition;',
        'uniform float uDuration;',
        'uniform float uProgress;',
    ],

    mainVertexFunctions: [
        'float scale = tProgress * 2.0 - 1.0;',
        'scale = 1.0 - scale * scale;', 
        'basePosition *= scale;',
        'basePosition *= min(1.0, max(0.0, -10.0 + distance(vec3(uPosition.x, uPosition.y, newPosition.z), newPosition)));',
        'vec3 finalPos = newPosition + basePosition;',
        'gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPos, 1.0);'
    ]

}, {

    // specular: 0xfff000,
    // shininess: 50
})

// console.log(RainMat.fragmentShader);
// console.log(THREE.ShaderChunk['common'])
// console.log(THREE.ShaderChunk['packing'])
// console.log(THREE.ShaderChunk['bsdfs']);
// console.log(THREE.ShaderChunk['shadowmap_pars_fragment'])
// console.log(THREE.ShaderChunk['shadowmask_pars_fragment'])
// console.log(THREE.ShaderLib['shadow'].fragmentShader);
// console.log(THREE.ShaderChunk['tonemapping_fragment'])
// console.log(THREE.ShaderChunk['encodings_fragment'])
// console.log(THREE.ShaderChunk['fog_fragment'])



// const vertexShader =  `
//     attribute vec3 aPositionStart;
//     attribute vec3 aPositionEnd;
//     attribute float aOffset;
    
//     uniform vec3 uPosition;
//     uniform float uProgress;

//     vec4 quatFromAxisAngle(vec3 axis, float angle) {
//     float halfAngle = angle * 0.5;
//     return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
//     }

//     vec3 rotateVector(vec4 q, vec3 v) {
//     return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
//     }

//     float easeInOutSin(float t){
//     return (1.0 + sin(${Math.PI} * t - ${Math.PI} / 2.0)) / 2.0;
//     }

//     void main(){
//     float tProgress = easeInOutSin(min(1.0, max(0.0, (uProgress - aOffset)) / ${duration}));
//     vec3 newPosition = mix(aPositionStart, aPositionEnd, tProgress);

//     vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), ${Math.PI / 2});
//     vec3 basePosition = rotateVector(quatX, position);

//     float scale = tProgress * 2.0 - 1.0;
//     scale = 1.0 - scale * scale; 
//     basePosition *= scale;
//     basePosition *= min(1.0, max(0.0, -10.0 + distance(vec3(uPosition.x, uPosition.y, newPosition.z), newPosition)));
//     gl_Position = newPosition + basePosition;
//     }
// `;

// scale as function of time progress, based on lerp function, using sin function, with the uProgress as the ratio, and offset (to give it that sense of irregularlity)
// the larger the time, the larger the scale?
// but we invert the scale, so scale is constantly decreasing 
// the position 

export default RainMat;