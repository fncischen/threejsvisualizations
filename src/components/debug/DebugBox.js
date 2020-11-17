import * as THREE from 'three'

// build 
export class DebugBox {
    
    constructor(props){
        var xMin = props.xMin;
        var yMin = props.yMin;
        var zMin = props.zMin;

        var xMax = props.xMax;
        var yMax = props.yMax;
        var zMax = props.zMax; 

        var v1 = new THREE.Vector3(xMin, yMin, zMin);
        var v2 = new THREE.Vector3(xMax, yMax, zMax);

        this.Box = new THREE.Box3(v1, v2)
        

    }

    // use mouse onclick handlers
    onDebugBoxUpdate() {

    }

    onDebugBoxClick() {

    }

    onDebugBoxMove(dx, dy, dz) {

        // use event handler to notify 
    }
}