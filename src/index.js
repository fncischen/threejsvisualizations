import ReactDOM from 'react-dom'
import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import Particles from "./components/particles/particles.js"
import { Canvas, useFrame, useThree, extend} from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RainParticles from "./components/particles/rainParticles.js";

extend({ OrbitControls });


const CameraControls = (() => {

    // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: {domElement}
  } = useThree()

  const controls = useRef();
  // const Camera = new THREE.PerspectiveCamera({fov: 60, position: [0, 600, 600], near: 0.1, far: 5000});
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;
  camera.fov = 40;
  camera.near = 0.1;
  camera.far = 10000;

  /// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
  useFrame(() => {controls.current.update()})

  return <orbitControls ref={controls} args={[camera, domElement]} autoRotate={false} enableZoom={true} />

})

function App() {
    const mouse = useRef([0, 0])

    return (
        <Canvas style={{height: 500, color: "FF0000"}}>
            <CameraControls/>
            <scene name="Scene">
            <ambientLight />
            <pointLight position={[0, 400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, -400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, 0, 400]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <pointLight position={[0, 0, -400]} intensity={4} distance={1000} decay={2} color={"white"}/>
            <spotLight position={[0,5,0]} color={"red"} intensity={10} distance={1000}/>
            {/* <Particles/> */}
            {/* <BoxTest/> */}
            {/* <BoxTwo/> */}
            <RainParticles/>
          {/* <Swarm mouse={mouse} count={20000} />
          <Effect />
          <Dolly /> */}
          </scene>
        </Canvas>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))