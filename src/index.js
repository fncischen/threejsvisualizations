import ReactDOM from 'react-dom'
import * as THREE from 'three'
import React, {Suspense, useCallback, useEffect, useRef, useMemo } from 'react'
import Particles from "./components/particles/particles.js"
import { Canvas, useFrame, useThree, extend} from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import LoaderTest from "./components/storyTypes/verticalStory/loaderTest.js"
import dat from 'three/examples/jsm/libs/dat.gui.module'


extend({ OrbitControls });

// https://github.com/dataarts/dat.gui/blob/master/API.md

var testmeout;

const CameraControls = ((props) => {

    // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    scene,
    gl,
  } = useThree()

  console.log(useThree());
  console.log(gl);
  console.log(gl.domElement);
  // console.log(scene);

  const params = {
    splitScreen: false,
    switchToPublicView: false 
  }

  const controls = useRef();  
  
  let SCREEN_WIDTH = window.innerWidth;
  let SCREEN_HEIGHT = window.innerHeight;
  let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

  gl.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  // const Camera = new THREE.PerspectiveCamera({fov: 60, position: [0, 600, 600], near: 0.1, far: 5000});
  camera.position.x = 0;
  camera.position.y = 15;
  camera.position.z = 15;
  camera.fov = 60;
  camera.near = 0.1;
  camera.far = 10000;
  camera.aspect = aspect * 0.5;




  let camera2 = new THREE.PerspectiveCamera(60, aspect * 0.5, 0.1, 1000);
  camera2.position.x = 0;
  camera2.position.y = 0;
  camera2.position.z = 5;
  console.log(camera)
  console.log(camera2);
    // renderer.clear();

    // renderer.setViewport(0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT);
    // renderer.render(scene, camera);

    // renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    // renderer.render(scene, camera2);

  var gui = new dat.GUI();
  gui.add(params, "splitScreen") // add boolean to toggle orthogonal camera or regular camera 
  gui.add(params, "switchToPublicView")
  // const cameraHelper = new THREE.CameraHelper(camera);
  // generate bounding box for the camera 
  // I want to be able to debug 

  /// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_camera.html
  const animate = (() => {
    gl.clear();

    if(params['switchToPublicView'] == true) {
          var cam = camera; 
          gl.render(scene, cam); 
    }
    else {
         var cam = camera2;
         gl.render(scene, cam)
    }
    
  })
  
  testmeout = gl; 

  useFrame(() => {    
    requestAnimationFrame(animate);

    controls.current.update()
    animate(); // set up loop function for animation 


  })


  return( 
  <group>
  <cameraHelper args={camera}/>
  <cameraHelper args={camera2}/>
  <orbitControls ref={controls} args={[camera, gl.domElement]} autoRotate={false} enableZoom={true} />
  </group>
  )

})

function App() {
    const mouse = useRef([0, 0])

    // const {
    //   camera,
    // } = useThree()

    // console.log(useThree());

    // let SCREEN_WIDTH = window.innerWidth;
    // let SCREEN_HEIGHT = window.innerHeight;
    // let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    // var scene = new THREE.Scene();

    // let camera2 = new THREE.PerspectiveCamera({fov: 60, near: 0.1, far: 50000, position: new THREE.Vector3(30,30,0) });

    // var renderer = new THREE.WebGLRenderer();
    // renderer.setViewport(0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT);
    // renderer.render(scene, camera);

    // renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    // renderer.render(scene, camera2);
    // console.log(renderer);
    // add buttons to switch 
    return (
        <Canvas gl={testmeout} style={{height: 500, color: "FF0000"}}>
            <CameraControls/>            
            <ambientLight />
            <pointLight position={[0, 400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, -400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, 0, 400]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, 0, -400]} intensity={4} distance={1000} decay={2} color={"white"}/>
            {/* <Particles/>        */}
            <Suspense fallback={null}>     
            <LoaderTest/>
            </Suspense>
            {/* <BoxTest/> */}
            {/* <BoxTwo/> */}
          {/* <Swarm mouse={mouse} count={20000} />
          <Effect />
          <Dolly /> */}
        </Canvas>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))