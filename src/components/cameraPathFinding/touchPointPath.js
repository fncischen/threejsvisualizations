import * as THREE from 'three';

export default class TouchPointPath{
    constructor(curve) {
        this.curve = curve;
        this.tubeBufferGeometryPath = new THREE.TubeBufferGeometry(curve, 250, 0.2, 10, true);
        this.bufferGeometryActive = false; // these toggles help us determine state changes
    }

}

TouchPointPath.constructor = TouchPointPath;