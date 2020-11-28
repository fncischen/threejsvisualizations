import * as THREE from "three";
import particleMaterial from "./ParticleMaterial";

var ShaderChunk = {};

ShaderChunk['quat_from_axis_angle'] = "vec4 quatFromAxisAngle(vec3 axis, float angle) \n {\n float halfAngle = angle * 0.5; \n return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n}\n";

ShaderChunk['rotate_vector'] = "vec3 rotateVector(vec4 q, vec3 v) \n { \n return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); \n} \n";

ShaderChunk['ease_in_ease_out_sin'] = "float easeInOutSin(float t) \n{ \n return (1.0 + sin(3.141618 * t - 3.141618/ 2.0)) / 2.0; \n} \n";

const vertex = `
    attribute vec3 aPositionStart;
    attribute vec3 aPositionEnd;
    attribute float aOffset;
    
    uniform vec3 uPosition;
    uniform float uProgress;
    uniform float mDuration;

    vec4 quatFromAxisAngle(vec3 axis, float angle) {
      float halfAngle = angle * 0.5;
      return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
    }

    vec3 rotateVector(vec4 q, vec3 v) {
      return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }

    float easeInOutSin(float t){
      return (1.0 + sin(3.1416 * t - 3.1416 / 2.0)) / 2.0;
    }

    void main(){
      float tProgress = easeInOutSin(min(1.0, max(0.0, (uProgress - aOffset))/mDuration));
      vec3 newPosition = mix(aPositionStart, aPositionEnd, tProgress);

      vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), 3.1416 / 2.0);
      vec3 basePosition = rotateVector(quatX, position);
  
      float scale = tProgress * 2.0 - 1.0;
      scale = 1.0 - scale * scale;
      basePosition *= scale;
      basePosition *= min(1.0, max(0.0, -10.0 + distance(vec3(uPosition.x, uPosition.y, newPosition.z), newPosition)));
      gl_Position = newPosition + basePosition;
    }
  `;

const fragment = `
#define STANDARD
#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
	#define TRANSMISSION
#endif
attribute vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
	uniform float transmission;
#endif
#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif
#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#ifdef TRANSMISSION
		float totalTransmission = transmission;
	#endif
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <transmissionmap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef TRANSMISSION
		diffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );
	#endif
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`

class RainParticleMaterialTwo extends THREE.MeshStandardMaterial {
    constructor(params, uniformValues) {
        super(params);

        this.uniforms = params.uniforms; 

        this.vertexShader = params.vertexShader;
        this.fragmentShader = params.fragmentShader;
        this.replacedShader = null; 
        // this.onBeforeCompile(s); // compilethe 

    }

    // https://codepen.io/prisoner849/pen/BvxBPW

    // why this is built in /// modify built in material's shaders before compilation
    // https://github.com/mrdoob/three.js/issues/11475



    // for this to work, 
    // you have to know which shaders to replace 
    onBeforeCompile(shader){

        Object.assign(shader.uniforms, this.uniforms);

        // retrieve the shader from existing vertex shader 
        const vertexShader = this.vertexShader.replace(/(\r\n|\n|\r)/gm, '');
        // console.log('vertex shader :' + vertexShader)
        
        // matching regex https://www.w3schools.com/jsref/jsref_obj_regexp.asp
        // get the attribtues
        const attributes = vertexShader.match(/.+?(?=void)/)[0];

        // console.log('attributes ' + attributes)

        // get the main function from the vertex function 
        const main = vertexShader.match(/main\(\){(.*?)}/)[1];
        // console.log('main '+ main);

        shader.vertexShader = `${attributes} \n ${shader.vertexShader}`;

        // add the main function 
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            main.replace('gl_Position =', 'vec3 transformed =')
          );

        // construct a shader that 

        // const fragmentShader = this.fragmentShader.replace(/(\r\n|\n|\r)/gm, '');

        shader.fragmentShader = THREE.ShaderLib['phong'].fragmentShader;
        console.log(shader.fragmentShader);
    }

}

var RainMat2 = new RainParticleMaterialTwo({
    // color: "#4EEE94",
    vertexColors: THREE.VertexColors,
    emissive: "#212121",
    flatShading: true,
    roughness: 0.8,
    metalness: 0.7,

    uniforms: {
        uPosition: {type: 'v3', value: [0,0,0]},
        mDuration: {type: 'f', value: 100},
        uProgress: {type: 'f', value: 0},
      },

    vertexShader: vertex,
    fragmentShader: fragment

})
  

export default RainMat2; 