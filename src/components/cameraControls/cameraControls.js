import ReactDOM from 'react-dom'
import * as THREE from 'three'
import React, {Suspense, useCallback, useEffect, useRef, useMemo } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {extend, useThree, useFrame} from "react-three-fiber";
import dat from 'three/examples/jsm/libs/dat.gui.module'


extend({ OrbitControls });

// https://github.com/dataarts/dat.gui/blob/master/API.md

export default function CameraControls(props){

    // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const { camera, gl } = useThree()


  const params = {
    splitScreen: false,
    switchToPublicView: false 
  }

  const controls = useRef();  

  // const Camera = new THREE.PerspectiveCamera({fov: 60, position: [0, 600, 600], near: 0.1, far: 5000});
  camera.position.x = 0;
  camera.position.y = 15;
  camera.position.z = 15;
  camera.fov = 60;
  camera.near = 0.1;
  camera.far = 10000;

  var gui = new dat.GUI();
  gui.add(params, "splitScreen") // add boolean to toggle orthogonal camera or regular camera 
  gui.add(params, "switchToPublicView")
  // const cameraHelper = new THREE.CameraHelper(camera);
  // generate bounding box for the camera 
  // I want to be able to debug 

  /// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_camera.html

  // figure out the react render viewport issues
  // https://shaderism.com/multiple-render-views-with-react

  
  // testmeout = gl; 

  useFrame(() => {    
    // requestAnimationFrame(animate);

    controls.current.update()
    // animate(); // set up loop function for animation 


  })

  return( 
  <group>
  <cameraHelper args={camera}/>
  <orbitControls ref={controls} args={[camera, gl.domElement]} autoRotate={false} enableZoom={true} />
  </group>
  )

}