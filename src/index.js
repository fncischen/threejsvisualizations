import ReactDOM from 'react-dom'
import React, {Suspense, Component, useRef} from 'react'
import Particles from "./components/particles/particles.js"
import { Canvas, useFrame, useThree, extend} from 'react-three-fiber'
import LoaderTest from "./components/storyTypes/verticalStory/loaderTest.js"
import * as THREE from 'three'

import CameraControls from "./components/cameraControls/cameraControls.js"
import VerticalStoryDashboard from "./components/storyTypes/verticalStory/verticalStoryDashboard.js"

class App extends React.Component {

    constructor(props){
      super(props);

      this.state = { previousY: 0.0, deltaY: 0.0 }
      console.log(this.state);

    }

    // this is a better way of rendering events 
    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);

    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }

    // check for hooks 
    // https://stackoverflow.com/questions/57088861/react-setstate-hook-from-scroll-event-listener
    // handleScroll(e){
    //   console.log("curent state :" + this.state);

    //   var newScrollY = window.scrollY;
    //   var dY = newScrollY - this.state.previousY;
    //   await this.setState({previousY: newScrollY, deltaY: dY})
    //   setInterval(1000);
    //   // take the delta between previous scrollY and current scrollY
    //   // send it to the canvas object's camera

    //   // use it to pan the camera 

    //   // retrive scroll data, send it to state, and then place it inside the vertical story dashboard 
    // }

    render() {
    return (            
        <div className="test">
        <VerticalStoryDashboard/>
        <Canvas style={{height: 500, color: "FF0000"}}>
            {/* <CameraControls/>             */}
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
        </div>
    )
    }
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))