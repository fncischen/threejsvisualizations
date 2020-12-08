/// cameraPathfinding reference
// https://threejs.org/examples/#webgl_geometry_extrude_splines

import * as THREE from 'three'; 
import {useLoader, useThree, useFrame} from 'react-three-fiber';
import {useEffect} from 'react'
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

var mouse = new THREE.Vector2();


function BeizerPath({props}) {
    var curves = props.curves; 
    var lines = [];

    for(var i = 0; i < curves.length; i++){

        //  https://threejs.org/docs/index.html#api/en/extras/curves/CubicBezierCurve3
        // set up subdivision and scale, understanding points
        const points = curves[i].getPoints( 50 );

        var bg = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial( { color : 'blue'} );

        const curveObject = new THREE.Line( bg, material );

        lines.push(curveObject);

    }

    return (
        lines.map(line => {
            return (<primitive object={line}/>)
        })
    )
}


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // console.log('mouse x : '+ mouse.x + " mouse y : " + mouse.y)
}

export default function CameraPath({props}){
    // console.log(props);
    // console.log(props.controlPoints)

    var controlPoints = props.controlPoints;
    var TouchPointScenes = []; // array of curves
    // var buttonToClick = props.buttonToClick;
    var Curves = [];
    // console.log(controlPoints)
    // var raycasterForCamera = useRef();

    const actions = useStore(state => state.actions); // actions with methods to call
    const data = useStore(state => state.data); 
    // at different states of the event 
    
    const {
        camera,
        gl: {domElement},
        raycaster
      } = useThree()
    
    // const loader = new GLTFLoader();

    const load1 = useLoader(GLTFLoader, "./models/backward.gltf");
    // console.log(load1);
    // var backobj; 
    var backobj = load1.nodes.Cube; // data type: obj  
    
    const load2 = useLoader(GLTFLoader, "./models/forward.gltf");
    // console.log(load2);
    var forwardobj = load2.nodes.Cube; // data type: obj 




    // set up orbit controls but modify
    // https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
   //  var controls = new OrbitControls(); // review this data structure 

    // set up a series of beizer paths based on a given array 
    var intializePaths = () => {
        for(var i = 0; i < controlPoints.length; i+=4){
            
            var bezierCurve = new THREE.CubicBezierCurve3(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);           
            Curves.push(bezierCurve);
        }

        let touchPointSceneLength = Curves.length + 1; 

        for(var i = 0; i < touchPointSceneLength; i+=2) {
            console.log('run');
            var t = new TouchPointScene(i, null, Curves[i]);
            var t1 = new TouchPointScene(i+1, Curves[i], null);

            TouchPointScenes.push(t);
            TouchPointScenes.push(t1);

            if(TouchPointScenes[i-1] != null ){
                t.previousPath = Curves[i-1];
                TouchPointScenes[i-1].nextPath = Curves[i-1];
            }

            t1.setPreviousTouchPoint(TouchPointScenes[i]);
            t.setNextTouchPoint(TouchPointScenes[i+1]);
            
          }
        console.log(TouchPointScenes)
    }

    intializePaths();    
    console.log(TouchPointScenes);
    console.log(Curves);

    actions.init(camera, TouchPointScenes, TouchPointScenes[0]);

    // https://spectrum.chat/react-three-fiber/general/raycasting-e-g-onclick-noob-tips~be3da813-7cd0-45b9-a30b-7f43163b3e92
    var onCameraMove = (direction) => {

        console.log('click!');
        actions.startMove(direction);
    }

    window.addEventListener( 'mousemove', onMouseMove, false );

    var checkRaycast = (() => {    
        
        raycaster.setFromCamera(mouse, camera);

        const intersectOne = raycaster.intersectObject(backobj);
        const intersectTwo = raycaster.intersectObject(forwardobj);


        // if(intersectOne.length > 1) {
        //     console.log("clicking on back obj!");        
        //     // console.log(intersectOne);
        //     // actions.startMove("backwards");
        // }
        if (intersectTwo.length > 1) {
            console.log("clicking on forward obj!");
            // console.log(intersectTwo);
            actions.startMove("forwards");

        }
          
        requestAnimationFrame(checkRaycast);

    })

    // you can check and see if the camera is in moving state (i.e.)

    useFrame(() => {
        // set up all the if and then statements
        checkRaycast();

        if(data.isCameraMoving) {
            console.log("use effect move move ")
            actions.move();
        }

    })


    // set up a raycaster


    return (
        // https://codesandbox.io/embed/r3f-game-i2160
        // https://github.com/pmndrs/zustand\

        <group>

        <BeizerPath props={{curves: Curves}}></BeizerPath>
        <primitive object={backobj} position={data.backObjPos} />
        <primitive object={forwardobj} position={data.forwardObjPos}/>
        </group>
    ) 
}