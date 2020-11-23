import * as THREE from 'three';

export default class BaseAnimationMaterial extends THREE.ShaderMaterial{

    constructor(parameters) {
        super();

        this.shaderFunctions = [];
        this.shaderParameters = [];
        this.shaderVertexInit = [];
        this.shaderTransformNormal = [];
        this.shaderTransformPosition = [];
        this.mainVertexFunctions = [];

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