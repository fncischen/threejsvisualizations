import * as THREE from "three";

// define the shader chunks here 
var mDuration = 20;
var ShaderChunk = {};

ShaderChunk["animation_time"] = "float tDelay = aAnimation.x;\nfloat tDuration = aAnimation.y;\nfloat tTime = clamp(uTime - tDelay, 0.0, tDuration);\nfloat tProgress = ease(tTime, 0.0, 1.0, tDuration);\n";

ShaderChunk["cubic_bezier"] = "vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t)\n{\n    vec3 tp;\n    float tn = 1.0 - t;\n\n    tp.xyz = tn * tn * tn * p0.xyz + 3.0 * tn * tn * t * c0.xyz + 3.0 * tn * t * t * c1.xyz + t * t * t * p1.xyz;\n\n    return tp;\n}\n";

ShaderChunk["ease_in_cubic"] = "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t*t + b;\n}\n";

ShaderChunk["ease_in_quad"] = "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t + b;\n}\n";

ShaderChunk["ease_out_cubic"] = "float ease(float t, float b, float c, float d) {\n  return c*((t=t/d - 1.0)*t*t + 1.0) + b;\n}\n";

ShaderChunk["quaternion_rotation"] = "vec3 rotateVector(vec4 q, vec3 v)\n{\n    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\nvec4 quatFromAxisAngle(vec3 axis, float angle)\n{\n    float halfAngle = angle * 0.5;\n    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n}\n";


class BaseAnimationMaterial extends THREE.ShaderMaterial{

    constructor(parameters) {
        super();

        this.shaderFunctions = [];
        this.shaderParameters = [];
        this.shaderVertexInit = [];
        this.shaderTransformNormal = [];
        this.shaderTransformPosition = [];

        this.setValues(parameters);
    }
};

// abstract
BaseAnimationMaterial.prototype._concatVertexShader = function() {
  return '';
};

BaseAnimationMaterial.prototype._concatFunctions = function() {
  return this.shaderFunctions.join('\n');
};
BaseAnimationMaterial.prototype._concatParameters = function() {
  return this.shaderParameters.join('\n');
};
BaseAnimationMaterial.prototype._concatVertexInit = function() {
  return this.shaderVertexInit.join('\n');
};
BaseAnimationMaterial.prototype._concatTransformNormal = function() {
  return this.shaderTransformNormal.join('\n');
};
BaseAnimationMaterial.prototype._concatTransformPosition = function() {
  return this.shaderTransformPosition.join('\n');
};


BaseAnimationMaterial.prototype.setUniformValues = function(values) {
  for (var key in values) {
      if (key in this.uniforms) {
          var uniform = this.uniforms[key];
          var value = values[key];

          // todo add matrix uniform types
          switch (uniform.type) {
              case 'c': // color
                  uniform.value.set(value);
                  break;
              case 'v2': // vectors
              case 'v3':
              case 'v4':
                  uniform.value.copy(value);
                  break;
              case 'f': // float
              case 't': // texture
                  uniform.value = value;
          }
      }
  }
};

class PhongAnimationMaterial extends BaseAnimationMaterial {

    constructor(parameters, uniformValues) {
        super(parameters);

        var phongShader = THREE.ShaderLib['phong'];

        this.uniforms = THREE.UniformsUtils.merge([phongShader.uniforms, this.uniforms]);
        this.lights = true;
        this.vertexShader = this._concatVertexShader();
        this.fragmentShader = phongShader.fragmentShader;

        // todo add missing default defines
        uniformValues.map && (this.defines['USE_MAP'] = '');
        uniformValues.normalMap && (this.defines['USE_NORMALMAP'] = '');

        this.setUniformValues(uniformValues);
  }

};

PhongAnimationMaterial.prototype._concatVertexShader = function() {
  // based on THREE.ShaderLib.phong
  return [
      "#define PHONG",

      "varying vec3 vViewPosition;",

      "#ifndef FLAT_SHADED",

      "	varying vec3 vNormal;",

      "#endif",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "uv_pars_vertex" ],
      THREE.ShaderChunk[ "uv2_pars_vertex" ],
      THREE.ShaderChunk[ "displacementmap_pars_vertex" ],
      THREE.ShaderChunk[ "envmap_pars_vertex" ],
      THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
      THREE.ShaderChunk[ "skinning_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

      this._concatFunctions(),

      this._concatParameters(),

      "void main() {",

      this._concatVertexInit(),

      THREE.ShaderChunk[ "uv_vertex" ],
      THREE.ShaderChunk[ "uv2_vertex" ],
      THREE.ShaderChunk[ "color_vertex" ],
      THREE.ShaderChunk[ "beginnormal_vertex" ],

      this._concatTransformNormal(),

      THREE.ShaderChunk[ "morphnormal_vertex" ],
      THREE.ShaderChunk[ "skinbase_vertex" ],
      THREE.ShaderChunk[ "skinnormal_vertex" ],
      THREE.ShaderChunk[ "defaultnormal_vertex" ],

      "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED

      "	vNormal = normalize( transformedNormal );",

      "#endif",

      THREE.ShaderChunk[ "begin_vertex" ],

      this._concatTransformPosition(),

      THREE.ShaderChunk[ "displacementmap_vertex" ],
      THREE.ShaderChunk[ "morphtarget_vertex" ],
      THREE.ShaderChunk[ "skinning_vertex" ],
      THREE.ShaderChunk[ "project_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_vertex" ],

      "	vViewPosition = - mvPosition.xyz;",

      THREE.ShaderChunk[ "worldpos_vertex" ],
      THREE.ShaderChunk[ "envmap_vertex" ],
      THREE.ShaderChunk[ "lights_phong_vertex" ],
      THREE.ShaderChunk[ "shadowmap_vertex" ],

      "}"

  ].join( "\n" );
};


const shaderMat = new PhongAnimationMaterial({
  vertexColors: THREE.VertexColors,
  flatShading: THREE.FlatShading,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {type: 'f', value: 0},
    uDuration: {type: 'f', value: mDuration}
  },
  // i should have called this shaderFunction, otherwise the material
  // is left in vertexfunctions
  shaderFunctions: [
    ShaderChunk['quaternion_rotation'],
    ShaderChunk['cubic_bezier'],
  ],

  shaderVertexInit: [
    // shaderVertexInit
    'float tProgress = mod((uTime + aOffset), uDuration) / uDuration;',

    'float angle = aAxisAngle.w * tProgress;',
    'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
  ],

  shaderTransformNormal: [
    // shader transform normal 
    'objectNormal = rotateVector(tQuat, objectNormal);',
  ],

  shaderTransformPosition: [
    // shaderTransformPosition
    'transformed = rotateVector(tQuat, transformed);',
    'transformed += cubicBezier(aStartPosition, aControlPoint1, aControlPoint2, aEndPosition, tProgress);'
  ],
  shaderParameters: [
    'uniform float uTime;',
    'uniform float uDuration;',
    'attribute float aOffset;',
    'attribute vec3 aStartPosition;',
    'attribute vec3 aControlPoint1;',
    'attribute vec3 aControlPoint2;',
    'attribute vec3 aEndPosition;',
    'attribute vec4 aAxisAngle;'
  ],
},
// THREE.MeshPhongMaterial uniforms
{
  specular: 0xfff000,
  shininess: 50
}
);

export default shaderMat;


