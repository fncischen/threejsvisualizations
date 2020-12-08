import * as THREE from 'three'
import {addEffect} from 'react-three-fiber';
import create from 'zustand';
import TouchPointScene from "./TouchPointScene.js"

// https://github.com/pmndrs/zustand
// https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes

// https://engineering.icf.com/getting-started-with-a-3d-react-workflow/
// use the state system above


const [useStore] = create((set,get) => {


    return {

        camera: null, 
        timeStepRate: 0.01,
        cameraPaths: null,

        data: {
            t: 0,
            position: [0,0,0],

            currentPath: new THREE.CubicBezierCurve3(),
            currentTouchPoint: new TouchPointScene(),
            nextTouchPoint: new TouchPointScene(),
            destinationPos: new THREE.Vector3(),
            direction: null,

            currentLocationIndex: 0,

            isMoving: false, 

            forwardObjPos: [0,0,0],
            backObjPos: [0,0,0],        
            
            isCameraMoving: false, 

        },

        // state with actions
        actions: {
            init(camera, cameraPaths, startTouchPoint) {
                console.log("initalize actions")
                console.log(camera);
                set({camera, cameraPaths})

                const {data} = get();

                data.forwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z + 10];
                data.backwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z - 10]; 

                data.currentTouchPoint = startTouchPoint;
                console.log(data.currentTouchPoint)
            },

            // call via onClick event handler 
            startMove(direction) {

                const {data,actions, isCameraMoving} = get();
                data.direction = direction; 

                if(data.direction == "back") {
                    data.currentPath = data.currentTouchPoint.previousPath;
                    data.nextTouchPoint = data.currentTouchPoint.previousTouchPoint;
                    data.destinationPos = data.currentPath.v0;
                    console.log(data.currentPath);
                }
                else if (data.direction == "forwards") {
                    data.currentPath = data.currentTouchPoint.nextPath;
                    data.nextTouchPoint = data.currentTouchPoint.nextTouchPoint; 
                    data.destinationPos = data.currentPath.v3;
                    // console.log(data.currentPath);
                    // console.log(data.destinationPos);

                }

                data.isCameraMoving = true; 

               //  actions.move();

            },

            testMove(direction) {
                console.log("testing! " + direction);
            },

            testMoveTwo(direction) {
                console.log("testing! " + direction);

                // setTimeout(function(){ console.log("2 seconds") }, 2000);
                // setTimeout(function(){ console.log("4 seconds")}, 4000);
                // setTimeout(function(){ console.log("6 seconds") }, 6000);
                var t = 0; 

                // use addeffect // 
                // https://developer.aliyun.com/mirror/npm/package/react-three-fiber-cambrian
                addEffect(() => {

                    if(t != 50000) {
                        t += 100;
                        console.log("time at : " + t );
                    }
                    else {
                        return;
                    }


                })

                if(data.direction == "back") {
                    data.timeStepRate *= -1;
                }
                console.log("we're done")
            },

            // call inside 
            move() {

                const {data, actions, camera, timeStepRate} = get()                    

                if(data.t < 1.0) {
                        // set up interpolation for this 
                        data.t += timeStepRate; // use a different lerping function to loop this path 
                        // https://threejs.org/docs/#api/en/extras/core/Curve
                        console.log(data.t);
                        // // fix add ref       
                        // console.log(camera);                     
                        // can't do it this way since camera is not a useRef 
                        // camera.current.position = data.currentPath.getPointAt(data.t);
                        // point = data.currentPath.getPoint(data.t);
                        // console.log(point);
                    
                }
                else {
                    data.t = 0;
                    data.isCameraMoving = false; 
                    actions.stopMoveTest();
                }
            },

            stopMoveTest() {
                console.log('stopped move');
            },

            stopMove() {

                const { data, actions,camera } = get()

                if(data.direction == "back") {
                    data.currentLocationIndex = data.currentLocationIndex+1;
                }
                else if (data.direction == "forward") {
                   data.currentLocationIndex = data.currentLocationIndex-1;
                } 

                    data.forwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z + 10];
                    data.backwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z - 10]; 
                
            }
        }
    }

})

export default useStore;