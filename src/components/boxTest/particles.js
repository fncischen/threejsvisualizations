import * as THREE from 'three';
import React, { Suspense, useState, useRef,useEffect } from 'react'
import { Canvas, extend, useFrame, useThree} from 'react-three-fiber'
import { unstable_batchedUpdates } from 'react-dom';
import { instancedMesh, MeshPhongMaterial, RawShaderMaterial } from 'three';
// import { useSpring, config } from '@react-spring/core'
// import { match } from 'core-js/fn/symbol';

import shadMat from "./shaders/shaders.js"

export default function Particles(props){

    // https://codepen.io/zadvorsky/pen/qOYqGv?editors=1010
    var prefabGeometry;
    var prefabBufferGeometry;

    var mParticleSystem; 

    var particleCount = 100000; // change number  

    var aOffset;
    var aAxisAngle; 
    var aStartPosition;
    var aControlPoint1;
    var aControlPoint2;
    var aEndPosition;

    var aColor;

    var i,j, offset; 

    var mTime = 0.0; 
    var mTimeStep = (1/60);
    var mDuration = 500; // change 

    var aColor;
    var testMat;

   //  const addControlPoint= ((posX, posY, posZ))

    const fillBufferData = (() => {
        // then insert shader 
        // prefabBufferGeometry = new THREE.BufferGeometry();  
        prefabBufferGeometry.setAttribute('aOffset', new THREE.BufferAttribute(new Float32Array(particleCount),1));
        aOffset = prefabBufferGeometry.getAttribute('aOffset');

        prefabBufferGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3), 3));
        aStartPosition = prefabBufferGeometry.getAttribute('aStartPosition');

        prefabBufferGeometry.setAttribute('aControlPoint1', new THREE.BufferAttribute(new Float32Array(particleCount*3), 3));
        aControlPoint1 = prefabBufferGeometry.getAttribute('aControlPoint1');

        prefabBufferGeometry.setAttribute('aControlPoint2', new THREE.BufferAttribute(new Float32Array(particleCount*3), 3));
        aControlPoint2 = prefabBufferGeometry.getAttribute('aControlPoint2');

        prefabBufferGeometry.setAttribute('aEndPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3), 3));
        aEndPosition = prefabBufferGeometry.getAttribute('aEndPosition');
        // console.log(aEndPosition.array);
        prefabBufferGeometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(new Float32Array(particleCount*4),4));
        aAxisAngle = prefabBufferGeometry.getAttribute('aAxisAngle');

        prefabBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount*3) ,3));
        aColor = prefabBufferGeometry.getAttribute('color');

        // console.log(aColor + " buffer geometry");

        var delay;
        // console.log(prefabGeometry.vertices.length + " verticies length")
        var offset = 0;

        for(var i = 0, offset = 0 ; i < particleCount; i++) {
            delay = i / particleCount * mDuration; 
            // console.log(delay + "delay " + i );

            for(var j = 0; j < prefabGeometry.vertices.length; j++) {
                aOffset.array[offset++] = delay;
                // console.log(aOffset.array[offset] + "offset : " + offset);
            }

        }
        
        // console.log(prefabBufferGeometry);

        // https://codepen.io/zadvorsky/pen/qOYqGv
        // https://codepen.io/zadvorsky/pen/MaVXPQ
        // on shader chunks https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-advanced-materials-and-custom-shaders
        // http://three-bas-examples.surge.sh/docs/index.html
        
        // buffer start positions
        var x, y, z;

        for(var i = 0, offset = 0; i < particleCount; i++ ){
            x = -1000;
            y = 0;
            z = 0;

            for(var j = 0; j < prefabGeometry.vertices.length; j++) {
                aStartPosition.array[offset++] = x;
                aStartPosition.array[offset++] = y;
                aStartPosition.array[offset++] = z;
            }
        }


        for(var i = 0, offset = 0; i < particleCount; i++) {
            x = THREE.MathUtils.randFloat(-400, 400);
            y = THREE.MathUtils.randFloat(400, 600);
            z = THREE.MathUtils.randFloat(-1200, -800);
            
            for(var j = 0; j < prefabGeometry.vertices.length; j++){
                aControlPoint1.array[offset++] = x;
                aControlPoint1.array[offset++] = y;
                aControlPoint1.array[offset++] = z; 

            }
        }

        for(var i = 0, offset = 0; i < particleCount; i++) {
            x = THREE.MathUtils.randFloat(-400, 400);
            y = THREE.MathUtils.randFloat(-600, -400);
            z = THREE.MathUtils.randFloat(800, 1200);
            
            for(var j = 0; j < prefabGeometry.vertices.length; j++){
                aControlPoint2.array[offset++] = x;
                aControlPoint2.array[offset++] = y;
                aControlPoint2.array[offset++] = z; 

            }
        }

        // buffer end position

        for(var i = 0, offset = 0; i < particleCount; i++) {
            x = 1000;
            y = 0;
            z = 0; 

            for(var j = 0; j < prefabGeometry.vertices.length; j++) {
                aEndPosition.array[offset++] = x;
                aEndPosition.array[offset++] = y;
                aEndPosition.array[offset++] = z;

            }
        }

        console.log("test : " + aEndPosition.array)
        // // set up axis angle that can be used for 
        // // axis angle instance 
        var axis = new THREE.Vector3();
        var angle = 0;
        for(var i = 0, offset = 0; i < particleCount; i++){
            // check here: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
           axis.x = THREE.MathUtils.randFloatSpread(2) 
           axis.y = THREE.MathUtils.randFloatSpread(2) 
           axis.z = THREE.MathUtils.randFloatSpread(2)
           axis.normalize(); 

        //    // place axis angle value via buffer here 

        //    // vary per particle // keep it constant 
           for(j = 0; j< prefabGeometry.vertices.length; j++) {
                aAxisAngle.array[offset++] = axis.x;
                aAxisAngle.array[offset++] = axis.y;
                aAxisAngle.array[offset++] = axis.z;
                aAxisAngle.array[offset++] = angle;
           }
        } 
 

        // }

        // // buffer color 
        var color = new THREE.Color();
        var h,s,l;

        for(var i = 0, offset = 0; i < prefabGeometry.vertices.length; i++) {
            h = i / particleCount;
            s = THREE.MathUtils.randFloatSpread(0.4, 0.6);
            l = THREE.MathUtils.randFloatSpread(0.4, 0.6);

            color.setHSL(h,s,l);

            for(var j = 0; j < prefabGeometry.vertices.length; j++) {
                aColor.array[offset++] = color.r;
                aColor.array[offset++] = color.g;
                aColor.array[offset++] = color.b; 
            }

        } 

        // mParticleSystem.current.frustumCulled = false;
        // console.log(prefabBufferGeometry);
    })


    const generatePositionAndIndexBuffers = (() => {

        var segmentWidth = 5;
        prefabGeometry = new THREE.PlaneGeometry(segmentWidth,segmentWidth);
        var squareDimension = Math.floor(Math.sqrt(particleCount));

        var prefabFaceCount = prefabGeometry.faces.length;
        var prefabIndicesCount = prefabGeometry.faces.length * 3; // 
        var prefabVerticiesCount = prefabGeometry.vertices.length; 
        var prefabIndices = []; // for square prefab, 6 indices, we loop per face
        // and push per 3 indices, via triangle;  

        var idx = segmentWidth + 0.2;
        var idy = segmentWidth + 0.2; 
    
        // generate indices based on amount of faces in prefab
        for (var h = 0; h < prefabFaceCount; h++) {
            var face = prefabGeometry.faces[h];
            prefabIndices.push(face.a, face.b, face.c);
        }   
        
        var indexBuffer = new Uint32Array(particleCount * prefabIndicesCount)
        var positionBuffer = new Float32Array(particleCount * prefabVerticiesCount * 3);

        // https://www.soft8soft.com/docs/manual/en/programmers_guide/How-to-update-things.html

        // prefabBufferGeometry.setIndex(new THREE.BufferAttribute(indexBuffer,1));
        // var positionBuffer = prefabBufferGeometry.getAttribute("position");

        // use the prefab geometry to create instances and UVs specific 
        // to the UX indices

        var dx = 0;
        var dy = 0; 

        for(var i = 0, dx = 0, offset = 0; i < particleCount; i++) {

            // loop through each prefab count element 
            for(var j  = 0; j < prefabVerticiesCount; j++, offset += 3) {
                // loop through the prefab geometry 
                var prefabVertex = prefabGeometry.vertices[j];

                // loop through positionBuffer 
                positionBuffer[offset    ] = prefabVertex.x;
                positionBuffer[offset + 1] = prefabVertex.y;
                positionBuffer[offset + 2] = prefabVertex.z;
            }

            for(var k = 0; k < prefabIndicesCount; k++){
                indexBuffer[i * prefabIndicesCount + k] = prefabIndices[k] + i * prefabVerticiesCount;
            }

        }
        
        prefabBufferGeometry.setIndex(new THREE.BufferAttribute(indexBuffer,1))
        prefabBufferGeometry.setAttribute("position", new THREE.BufferAttribute(positionBuffer,3))
        prefabBufferGeometry.getAttribute("position").name = "position";

        console.log(positionBuffer);
        console.log(indexBuffer)



    })

    const generateUVbuffers = (() => {
        // var uvBuffer = prefabBufferGeometry.getAttribute("uv");
        

    })

    const generateVertexNormals = (() => {
       // var vertexNormals = prefabBufferGeometry.getAttribute('normal');


    })




    const initializeParticles = (() => {
            mParticleSystem = useRef();
            // prefabGeometry = new THREE.PlaneGeometry(4,4)
            prefabBufferGeometry = new THREE.BufferGeometry(); 
            // testMat = new THREE.MeshPhongMaterial([{color: "blue"}]);
            testMat = new THREE.MeshBasicMaterial( { color: 0xfff000 } );
            generatePositionAndIndexBuffers(); // why i messed up 
            fillBufferData();

     })

        
    initializeParticles();

    // requestAnimationFrame(tick);

   // console.log(shadMat.vertexShader);

    useEffect(() => {
        tick();
    })



    const tick = (() => {
        update();
        // render();

        mTime += mTimeStep;
        mTime %= mDuration;

        requestAnimationFrame(tick)
    })

    requestAnimationFrame(tick);

    const update = (() => {
        // mControls.update();
       mParticleSystem.current.material.uniforms['uTime'].value = mTime;
       mParticleSystem.current.frustumCalled = false; 
        // console.log(mParticleSystem.current.material);
       // mParticleSystem.current.instanceMatrix.needsUpdate = true; 
       // requestAnimationFrame(tick);

    })

    // useFrame(() => {
    //     mParticleSystem.current.rotation.x += 0.003;
    //     mParticleSystem.current.rotation.y += 0.003;
    //     mParticleSystem.current.rotation.z += 0.003; 
    // })

    // how to debug Instanced Mesh 

    return(
        <mesh ref={mParticleSystem} args={[prefabBufferGeometry, shadMat]}>
        </mesh>
    )
}



