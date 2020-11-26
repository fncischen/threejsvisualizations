import ReactDOM from 'react-dom'
import React, { useCallback, useEffect, useRef, useMemo , useState} from 'react'
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
  camera.position.z = 20;
  camera.fov = 40;
  camera.near = 0.1;
  camera.far = 10000;

  /// https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/
  useFrame(() => {controls.current.update()})

  return <orbitControls ref={controls} args={[camera, domElement]} autoRotate={false} enableZoom={true} />

})

function App() {
    const [rainParticleEnabled, onRainParticleEnabled] = useState(false);

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

            { rainParticleEnabled ? <Particles enabled={rainParticleEnabled}/> :
             <RainParticles enabled={rainParticleEnabled}/>}

          </scene>
        </Canvas>
        </div>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))