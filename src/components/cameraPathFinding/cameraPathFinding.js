/// cameraPathfinding reference
// https://threejs.org/examples/#webgl_geometry_extrude_splines

import { Component, useEffect,  } from 'react';
import * as THREE from 'three'; 
import {useLoader, addEffect} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useStore } from ".store.js";
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

export default function CameraPath(props){

    var controlPoints = props.controlPoints;
    var TouchPointScenes = []; // array of curves
    var buttonToClick = props.buttonToClick;

    const actions = useStore(state => state.actions) // actions with methods to call 
    // at different states of the event 
    
    const {
        camera,
        gl: {domElement}
      } = useThree()
    
    var timeStepRate = 0.1; // change timeStepRate; 

    const loader = new GLTFLoader();

    const {nodes} = useLoader(loader, "models/left.gltf");
    var leftobj = nodes[0]; // data type: obj  
    
    const {nodes} = useLoader(loader, "models/right.gltf");
    var rightobj = nodes[0]; // data type: obj 

    // set up orbit controls but modify
    // https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
    var controls = new OrbitControls(); // review this data structure 

    // set up a series of beizer paths based on a given array 
    var intializePaths = () => {
        
        var Curves = [];

        // we need a cleaner way of organizing this  

        for(var i = 0; i < controlPoints - 4; i+=4){
            
            var bezierCurve = new THREE.CubicBezierCurve(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);           
            
            Curves.push(bezierCurve);
        }

        let touchPointSceneLength = Curves.length + 1; 

        for(var i = 1; i < touchPointSceneLength-1; i+=2) {

            var t = new TouchPointScene({index: i-1, previousPath: Curves[i-1], nextPath: Curves[i]});
            var t1 = new TouchPointScene({index: i, previousPath: Curves[i], nextPath: Curves[i+1]});

            TouchPointScenes.push(t);
            TouchPointScenes.push(t+1);

            t1.previousTouchPoint = TouchPointScenes[i];
            t.nextTouchPoint = TouchPointScenes[i+1]; 
        }
    }

    intializePaths();
    actions.init(camera, TouchPointScenes);
    
    var onCameraMove = (direction) => {
        actions.startMove(direction);
    }

    return (
        // https://codesandbox.io/embed/r3f-game-i2160
        // https://github.com/pmndrs/zustand\

        <group>
        <camera ref={camera}/>

        <primitive object={leftobj} onClick={onCameraMove("back")}/>
        <primitive object={rightobj} onClick={onCameraMove("forward")}/>

        </group>
    ) 
}