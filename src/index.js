import ReactDOM from 'react-dom'
import * as THREE from 'three'
import React, { useCallback, useEffect, useRef, useMemo , useState, Suspense} from 'react'
import Particles from "./components/particles/particles.js"
import { Canvas, useFrame, useThree, extend} from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RainParticles from "./components/particles/rainParticles.js";
import CameraPath from "./components/cameraPathFinding/cameraPathFinding.js";
import './styles.css';
import useYScroll from "./components/cameraPathFinding/onScroll.js";
import {a as aDom} from "@react-spring/web";

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
  camera.position.z = 120;
  camera.fov = 80;
  camera.near = 0.1;
  camera.far = 10000;

  /// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
  useFrame(() => {controls.current.update()})

  return <orbitControls ref={controls} args={[camera, domElement]} autoRotate={false} enableZoom={true} />

})

function App() {
    const [rainParticleEnabled, onRainParticleEnabled] = useState(false);

    const lowerBound = -100;
    const highBound = 2400; 

    const [y] = useYScroll([lowerBound, highBound], { domTarget: window })


    // https://dev.to/alexkhismatulin/update-boolean-state-right-with-react-hooks-3k2i
  
    const onSwitchToRainParticles = (() => {
        console.log("test "+ rainParticleEnabled)
        if (rainParticleEnabled == true){
            onRainParticleEnabled(false);        
            setTimeout(100000)

        }
        else {
            onRainParticleEnabled(true); 
            setTimeout(100000)

        }


    })

    useEffect(() => {
      setTimeout(100000)
    }, [rainParticleEnabled])

    return (
      <div className="App">
        {/* <button onClick={onSwitchToRainParticles}>Switch to Particle Stream</button> */}
        <Canvas style={{height: 500, color: "FF0000"}}>
            <CameraControls/>
            <scene name="Scene">

            {/* { rainParticleEnabled ? <Particles enabled={rainParticleEnabled}/> :
             <RainParticles enabled={rainParticleEnabled}/>} */}
             <Suspense fallback={null}>
            <CameraPath props={{controlPoints: [new THREE.Vector3(0,50,-500),new THREE.Vector3(50,0,-250), new THREE.Vector3(100,0,-500), new THREE.Vector3(-500,0,-500)], currentLocation: y}} />
            </Suspense>
          </scene>
        </Canvas>
        <aDom.div className="bar" style={{ height: y.interpolate([-100, 2400], ['0%', '100%']) }} />
        </div>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))