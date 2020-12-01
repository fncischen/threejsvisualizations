/// cameraPathfinding reference
// https://threejs.org/examples/#webgl_geometry_extrude_splines

import { Component, useEffect } from 'react';
import * as THREE from 'react-three-fiber'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// import event handler for moving 

class TouchPointScene{
    construtor() {
        this.index = index;
        this.previousPath = previousPath;
        this.nextPath = nextPath; 
        this.bufferGeometryPreviousPath = null; // dont require it, make it optional 
        this.bufferGeometryNextPath = null; // dont require it, make it optional 

    }

    // optional beizer path generated via geometry 
    // for debugging purposes 
    generateBeizerPathGeometries() {

    }
}


// button shader 

export default function CameraPath(props){

    var controlPoints = props.controlPoints;
    var TouchPointScenes = []; // array of curves
    var buttonToClick = props.buttonToClick;

    var camera = useRef()
    
    var timeStepRate = 0.1; // change timeStepRate; 

    const loader = new GLTFLoader();

    // load the buttons 

    loader.load( 'path/to/model.glb', function ( gltf ) {   

        // set up loader and appropriate reference via loader 
        var fromButton = useRef();
        var toButton = useRef();

        // set up material
        // set up shader
        // etc 

    }, undefined, function ( error ) {

	    console.error( error );

    } );




    // different states
    // in movement, from, to, 
    const [currentLocationIndex, atChangeLocation] = useState(0);

    //
    const [positionOfBackButton, setBackPathButton] = useState([])
    const [positionOfToButton, setForwardPathButton] = useState([])


    // set up a series of beizer paths based on a given array 
    var intializePaths = () => {
        
        var Curves = [];

        for(var i = 0; i < controlPoints - 4; i+=4){
            
            var bezierCurve = new THREE.CubicBezierCurve(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);            
            Curves.push(bezierCurve);
        }

        let touchPointSceneLength = Curves.length + 1; 

        for(var i = 1; i < touchPointSceneLength; i++) {
            var t = new TouchPointScene({index: i-1, previousPath: Curves[i-1], nextPath: Curves[i]});
            TouchPointScenes.push(t);
        }
    }

    // its like a state machine where you're switching between differet state
    // each state carries same camera orbiting abilities, can select different objects (but not the ones far away)

    // each control point is like a scene 
    var onCameraMove = (direction) => {
        useEffect(() => { 
            
            var currentTouchScene = TouchPointScenes[currentLocationIndex];
            
            var nextPath; 
            var finalDestination; 
            var t; 

            if(direction == "back") {
                nextPath = currentTouchScene.previousPath;
                finalDestination = nextPath.v4; 
                t = 0; 
            }
            else if (direction == "forward") {
                nextPath = currentTouchScene.nextPath;
                finalDestination = nextPath.v0; 
                t = 1;
            }
            
            // use while statement to loop 
            while(camera.position != finalDestination) {

                t += timeStepRate;
                // https://threejs.org/docs/#api/en/extras/core/Curve
                camera.current.position = nextPath.getPointAt(t);
            }

            if(direction == "back") {
                atChangeLocation(currentLocationIndex+1)
            }
            else if (direction == "forward") {
                atChangeLocation(currentLocationIndex-1)

            }

        })
    }

    // current camera state, via index 
    return (

        // add event handler 
        <group>
        <camera ref={camera}/>
        <object ref={fromButton}/>
        <object ref={toButton}/>
        </group>
    )
    // second, we need to be able to have camera follow these paths at each given point

    // we need event handlers to manage different phases of the camera path 
    // this is very important for the template, since it allows you to control different touchpoints of the user journey 
    
    // this also allows you to rotate your camera 360, but allows you to contol the journey of the path 
}