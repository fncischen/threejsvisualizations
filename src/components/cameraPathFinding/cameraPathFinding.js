/// cameraPathfinding reference
// https://threejs.org/examples/#webgl_geometry_extrude_splines

import * as THREE from 'three'; 
import {useLoader, useThree, useFrame} from 'react-three-fiber';
import {useEffect} from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useStore from "./store.js";
import TouchPointScene from './TouchPointScene';
import TouchPointPath from "./touchPointPath";
import useYScroll from "./onScroll.js";
import {a as aDom} from "@react-spring/web";

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
    var tubeGeometries = [];
    console.log(curves);
    for(var i = 0; i < curves.length; i++){

        //  https://threejs.org/docs/index.html#api/en/extras/curves/CubicBezierCurve3
        // set up subdivision and scale, understanding points
        const points = curves[i].curve.getPoints( 50 );

        var bg = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial( { color : 'blue'} );

        const curveObject = new THREE.Line( bg, material );
        tubeGeometries.push(curves[i].tub)

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
    var currentLocation = props.currentLocation; 
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

    const lowerBound = -100;
    const highBound = 2400; 

    const [y] = useYScroll([lowerBound, highBound], { domTarget: window })
    // what if we use the scroll as a lerp ratio between camera pos 1 and camera pos 2

    // we don't need the move function anymore
    const interpolateY = ((y) => {
        let t = y / (highBound - lowerBound);
        return t; 
    })


    // set up orbit controls but modify
    // https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
   //  var controls = new OrbitControls(); // review this data structure 

    // set up a series of beizer paths based on a given array 
    var intializePaths = () => {
        for(var i = 0; i < controlPoints.length; i+=4){
            
            var bezierCurve = new THREE.CubicBezierCurve3(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);           
            var touchPointPath = new TouchPointPath(bezierCurve);
            Curves.push(touchPointPath);
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

    // actions.init(camera, TouchPointScenes, TouchPointScenes[0]);
    actions.initTwo(camera,TouchPointScenes);

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

        if (intersectTwo.length > 1) {
            console.log("clicking on forward obj!");
            // console.log(intersectTwo);
            actions.startMove("forwards");

        }
          
        requestAnimationFrame(checkRaycast);

    })

    // you can check and see if the camera is in moving state (i.e.)

    let offset = 0        
    
    console.log(y);
    

    useFrame(() => {

        var t = interpolateY(y.get());
        actions.moveInterpolation(t);

        camera.position.x = data.position.x;
        camera.position.y = data.position.y + 25;
        camera.position.z = data.position.z;


    })

    // frame loop https://github.com/pmndrs/react-three-fiber/issues/133


    const cameraLookAtFunction = (() => {
            // https://codesandbox.io/embed/r3f-game-i2160
            // reference to camera rig component 
            const track = data.currentTrack;
            const t = data.t; 
            const pos = data.position;    
            
            const segments = track.tangents.length
            const pickt = t * segments // how many segments have we passed as a function of time 
            const pick = Math.floor(pickt) // each segment is like a cell 
            const pickNext = (pick + 1) % segments // next segment to go to 

            // console.log("binromals pick : " + pick)
            // console.log(track.binormals[pick]);
            console.log("binromals picknext : " + pickNext)
            // console.log(track.binormals[pickNext]);



            // store data regarding normals and binormals in data storage for class usage
            data.binormal.subVectors(track.binormals[pickNext], track.binormals[pick])
            data.binormal.multiplyScalar(pickt - pick).add(track.binormals[pick])

            // get the direction and offset, and use that to 
            const dir = track.parameters.path.getTangentAt(t)
            offset += (Math.max(15, 15 + -mouse.y / 20) - offset) * 0.05
            data.normal.copy(data.binormal).cross(dir)

            pos.add(data.normal.clone().multiplyScalar(offset))
            console.log('camera positions');
            console.log(pos);
            
            camera.position.copy(pos)
            // console.log(camera.position);
            const lookAt = track.parameters.path.getPointAt((t + 30 / track.parameters.path.getLength()) % 1).multiplyScalar(data.scale)
            camera.matrix.lookAt(camera.position, lookAt, data.normal)
            camera.quaternion.setFromRotationMatrix(camera.matrix)
            // camera.fov += ((t > 0.4 && t < 0.45 ? 120 : data.fov) - camera.fov) * 0.05
            camera.updateProjectionMatrix()
    })



    return (
        // https://codesandbox.io/embed/r3f-game-i2160
        // https://github.com/pmndrs/zustand\
        // use the style here 

        <group>
        
        <BeizerPath props={{curves: Curves}}></BeizerPath>
        {/* <primitive object={backobj} position={data.backObjPos} />
        <primitive object={forwardobj} position={data.forwardObjPos}/> */}
        </group>
    ) 
}