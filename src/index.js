import ReactDOM from 'react-dom'
import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import Particles from "./components/boxTest/particles.js"
import { Canvas, useFrame } from 'react-three-fiber'
import * as THREE from 'three';
import BoxTest from "./components/boxtest.js"
import BoxTwo from "./components/boxtwo.js"
import BoxThree from "./components/boxthree.js"

const CameraControls = (() => {

  const {
    gl: {domElement}
  } = useThree()

  const Controls = useRef();
  const Camera = new THREE.PerspectiveCamera({fov: 60, position: [0, 600, 600], near: 0.1, far: 5000});
  useFrame(() => {Controls.current.update()})

  return(
    <OrbitControl ref={controls} args={[camera, domElement]} />
  )

})

function App() {
    const mouse = useRef([0, 0])
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
    
    // const camera = useRef(); 

    const orbitControl = new THREE.OrbitControl();
    // const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), []) 

    return (
        <Canvas style={{height: 500, color: "FF0000"}}>
            <scene name="Scene">
            <ambientLight />
            <pointLight position={[0, 400, 0]} intensity={4} distance={1000} decay={2} color="blue"/>
            <Particles/>
            {/* <BoxTest/> */}
            {/* <BoxTwo/> */}
          {/* <Swarm mouse={mouse} count={20000} />
          <Effect />
          <Dolly /> */}
          </scene>
        </Canvas>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))