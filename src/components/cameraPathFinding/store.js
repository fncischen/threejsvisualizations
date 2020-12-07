import * as THREE from 'three'
import {useEffect} from 'react';
import create from 'zustand';
import TouchPointScene from "./TouchPointScene.js"

// https://github.com/pmndrs/zustand
// https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes

const [useStore] = create((set,get) => {

    let camera = null 
    let timeStepRate = 0.2
    let cameraPaths = null

    return {

        data: {
            t: 0,
            position: [0,0,0],

            currentPath: new THREE.CubicBezierCurve(),
            currentTouchPoint: new TouchPointScene(),
            nextTouchPoint: new TouchPointScene(),
            direction: null,

            currentLocationIndex: 0,

            isMoving: false, 

            forwardObjPos: [0,0,0],
            backObjPos: [0,0,0],
        },

        // state with actions
        actions: {
            init(camera, cameraPaths) {
                set({camera, cameraPaths})

                const {data} = get();

                data.forwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z + 10];
                data.backwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z - 10]; 

            },

            // call via onClick event handler 
            startMove(direction) {

                const {data,actions} = get();
                data.direction = direction; 

                if(data.direction == "back") {
                    data.currentPath = data.currentTouchPoint.previousPath;
                    data.nextTouchPoint = data.currentTouchPoint.previousTouchPoint;
                }
                else if (data.direction == "forward") {
                    data.currentPath = data.currentTouchPoint.nextPath;
                    data.nextTouchPoint = data.currentTouchPoint.nextTouchPoint; 
                }

                actions.move();

            },

            testMove(direction) {
                console.log("testing! " + direction);
            },

            // call inside 
            move() {

                const {data, actions} = get()                    
                
                if(data.direction == "back") {
                    data.timeStepRate *= -1;
                }

                if (camera != null) {
                useEffect(() => {

                    if(camera.position != finalDestination) {

                        // set up interpolation for this 
                        data.t += timeStepRate; // use a different lerping function to loop this path 
                        // https://threejs.org/docs/#api/en/extras/core/Curve
                        camera.current.position = data.currentPathPath.getPointAt(t);
                    
                    }
                    else {
                        data.t = 0; 
                        return; // test out 
                    }

                })
                }
                actions.stopMove();
            },

            stopMove() {

                const { data, actions } = get()

                if(data.direction == "back") {
                    data.currentLocationIndex = data.currentLocationIndex+1;
                }
                else if (data.direction == "forward") {
                   data.currentLocationIndex = data.currentLocationIndex-1;
                } 

                if(camera != null) {
                    data.forwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z + 10];
                    data.backwardObjPos = [camera.position.x, camera.position.y - 10, camera.position.z - 10]; 
                }
            }
        }
    }

})

export default useStore;