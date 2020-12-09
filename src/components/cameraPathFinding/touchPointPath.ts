import touchPointPath from "./touchPointPath";
import * as THREE from 'three';


export default class TouchPointPath {
    
    /**
    * Object which stores the curve and Tube Buffer Geometry for the camera path
    */
    constructor(curve: THREE.CubicBezierCurve3)
    {
        this.curve = curve; 
        this.tubeBufferGeometryPath = new THREE.TubeBufferGeometry(curve, 250, 0.2, 10, true);
    }

    /** 
    @default new THREE.CubicBezierCurve3
    **/

    curve: THREE.CubicBezierCurve3;

    /** 
    @default new THREE.TubeBufferGeometry
    **/

    tubeBufferGeometryPath: THREE.TubeBufferGeometry;

}