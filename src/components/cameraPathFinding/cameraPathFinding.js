/// cameraPathfinding reference
// https://threejs.org/examples/#webgl_geometry_extrude_splines

import * as THREE from 'three'; 
import {useLoader, useEffect, useThree} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useStore from "./store.js";
import TouchPointScene from './TouchPointScene';

// https://github.com/pmndrs/react-postprocessing

// import event handler for moving 

// button shader 
// blender should be real set up for shader, lighting, etc. 

// set up blender tomorrow 
// have right trigger for animation, blendshapes, morphtargets
// think about 3d models, vfx, (study

// im feeling blender is the way to go
// import blender, d3js, and 
// http://billdwhite.com/wordpress/2015/01/12/d3-in-3d-combining-d3-js-and-three-js/

function BeizerPath({props}) {
    var curves = props.curves; 
    var lines = [];

    console.log(curves);
    for(var i = 0; i < curves.length; i++){

        //  https://threejs.org/docs/index.html#api/en/extras/curves/CubicBezierCurve3
        // set up subdivision and scale, understanding points
        const points = curves[i].getPoints( 50 );

        var bg = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial( { color : 'blue'} );

        const curveObject = new THREE.Line( bg, material );

        lines.push(curveObject);

    }

    console.log(lines);

    return (
        lines.map(line => {
            return (<primitive object={line}/>)
        })
    )
}


export default function CameraPath({props}){
    console.log(props);
    console.log(props.controlPoints)

    var controlPoints = props.controlPoints;
    var TouchPointScenes = []; // array of curves
    // var buttonToClick = props.buttonToClick;
    var Curves = [];
    console.log(controlPoints)

    const actions = useStore(state => state.actions); // actions with methods to call
    const data = useStore(state => state.data); 
    // at different states of the event 
    
    const {
        camera,
        gl: {domElement}
      } = useThree()
    
    // const loader = new GLTFLoader();

    const load1 = useLoader(GLTFLoader, "./models/backward.gltf");
    console.log(load1);
    var backobj = load1.nodes.Cube; // data type: obj  
    
    const load2 = useLoader(GLTFLoader, "./models/forward.gltf");
    console.log(load2);
    var forwardobj = load2.nodes.Cube; // data type: obj 

    // set up orbit controls but modify
    // https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
   //  var controls = new OrbitControls(); // review this data structure 

    // set up a series of beizer paths based on a given array 
    var intializePaths = () => {
        console.log('test')
        console.log([3,3,3])
        console.log(controlPoints);
        console.log("length :" + controlPoints.length);
        for(var i = 0; i < controlPoints.length; i+=4){
            
            var bezierCurve = new THREE.CubicBezierCurve(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);           
            console.log('loop')
            console.log(bezierCurve);
            Curves.push(bezierCurve);
        }

        let touchPointSceneLength = Curves.length + 1; 

        for(var i = 1; i < touchPointSceneLength-1; i+=2) {

            var t = new TouchPointScene({index: i-1, previousPath: Curves[i-1], nextPath: Curves[i]});
            var t1 = new TouchPointScene({index: i, previousPath: Curves[i], nextPath: Curves[i+1]});

            TouchPointScenes.push(t);
            TouchPointScenes.push(t+1);

            t1.previousTouchPoint = TouchPointScenes[i-1];
            t.nextTouchPoint = TouchPointScenes[i]; 
        }
    }

    intializePaths();    
    console.log(Curves);

    actions.init(camera, TouchPointScenes);
    
    var onCameraMove = (direction) => {
        actions.startMove(direction);
    }

    return (
        // https://codesandbox.io/embed/r3f-game-i2160
        // https://github.com/pmndrs/zustand\

        <group>

        <BeizerPath props={{curves: Curves}}></BeizerPath>
        <primitive object={backobj} position={data.backObjPos} onClick={onCameraMove("back")}/>
        <primitive object={forwardobj} position={data.forwardObjPos} onClick={onCameraMove("forward")}/>

        </group>
    ) 
}