import ReactDOM from 'react-dom'
import React, {Suspense,useRef} from 'react'
import Particles from "./components/particles/particles.js"
import { Canvas, useFrame, useThree, extend} from 'react-three-fiber'
import LoaderTest from "./components/storyTypes/verticalStory/loaderTest.js"
import * as THREE from 'three'

import CameraControls from "./components/cameraControls/cameraControls.js"

function App() {

    return (
        <Canvas style={{height: 500, color: "FF0000"}}>
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