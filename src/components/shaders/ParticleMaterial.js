import * as THREE from "three";
import PhongAnimationMaterial from "./baseMaterial/PhongAnimationMaterial.js"

// define the shader chunks here 
var mDuration = 20;
var ShaderChunk = {};

ShaderChunk["animation_time"] = "float tDelay = aAnimation.x;\nfloat tDuration = aAnimation.y;\nfloat tTime = clamp(uTime - tDelay, 0.0, tDuration);\nfloat tProgress = ease(tTime, 0.0, 1.0, tDuration);\n";

ShaderChunk["cubic_bezier"] = "vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t)\n{\n    vec3 tp;\n    float tn = 1.0 - t;\n\n    tp.xyz = tn * tn * tn * p0.xyz + 3.0 * tn * tn * t * c0.xyz + 3.0 * tn * t * t * c1.xyz + t * t * t * p1.xyz;\n\n    return tp;\n}\n";

ShaderChunk["ease_in_cubic"] = "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t*t + b;\n}\n";

ShaderChunk["ease_in_quad"] = "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t + b;\n}\n";

ShaderChunk["ease_out_cubic"] = "float ease(float t, float b, float c, float d) {\n  return c*((t=t/d - 1.0)*t*t + 1.0) + b;\n}\n";

ShaderChunk["quaternion_rotation"] = "vec3 rotateVector(vec4 q, vec3 v)\n{\n    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\nvec4 quatFromAxisAngle(vec3 axis, float angle)\n{\n    float halfAngle = angle * 0.5;\n    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n}\n";

const particleMaterial  = new PhongAnimationMaterial({
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

export default particleMaterial;


