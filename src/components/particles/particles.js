import * as THREE from 'three';
import React, {useRef,useEffect } from 'react'

import particleMaterial from "../shaders/ParticleMaterial.js"

export default function Particles({enabled}){

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
    var mDuration = 100; // change 

    const fillBufferData = (() => {
        // then insert shader 
        // prefabBufferGeometry = new THREE.BufferGeometry();  
        var prefabVerticiesLength = prefabGeometry.vertices.length; 

        prefabBufferGeometry.setAttribute('aOffset', new THREE.BufferAttribute(new Float32Array(particleCount * prefabVerticiesLength),1));
        aOffset = prefabBufferGeometry.getAttribute('aOffset');

        prefabBufferGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength), 3));
        aStartPosition = prefabBufferGeometry.getAttribute('aStartPosition');

        prefabBufferGeometry.setAttribute('aControlPoint1', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength), 3));
        aControlPoint1 = prefabBufferGeometry.getAttribute('aControlPoint1');

        prefabBufferGeometry.setAttribute('aControlPoint2', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength), 3));
        aControlPoint2 = prefabBufferGeometry.getAttribute('aControlPoint2');

        prefabBufferGeometry.setAttribute('aEndPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength), 3));
        aEndPosition = prefabBufferGeometry.getAttribute('aEndPosition');
        // console.log(aEndPosition.array);
        prefabBufferGeometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(new Float32Array(particleCount*4 * prefabVerticiesLength),4));
        aAxisAngle = prefabBufferGeometry.getAttribute('aAxisAngle');

        prefabBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength) ,3));
        aColor = prefabBufferGeometry.getAttribute('color');

        console.log(aColor + " buffer geometry");

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

        // console.log("test : " + aEndPosition.array)
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
            angle = Math.PI * THREE.Math.randInt(16, 32);

        //    // vary per particle // keep it constant 
           for(j = 0; j< prefabGeometry.vertices.length; j++) {
                aAxisAngle.array[offset++] = axis.x;
                aAxisAngle.array[offset++] = axis.y;
                aAxisAngle.array[offset++] = axis.z;
                aAxisAngle.array[offset++] = angle;
           }
        } 
        
         // console.log("aAxis :" + aAxisAngle.array );

        // }

        // // buffer color 
        var color = new THREE.Color();
        var h,s,l;

        for(var i = 0, offset = 0; i < particleCount; i++) {
            h = i/particleCount * 50;
            // s = THREE.MathUtils.randFloatSpread(0.59, 0.61);
            l = THREE.MathUtils.randFloatSpread(0.7, 0.9);
             s = 0.8;
            // l = 0.5;

            color.setHSL(h,s,l);
            // console.log("loop")
            for(var j = 0; j < prefabGeometry.vertices.length; j++) {
                aColor.array[offset++] = color.r;
                aColor.array[offset++] = color.g;
                aColor.array[offset++] = color.b; 
                // console.log('loop');
            }

        } 
        //console.log("a color " + aColor.array);

        // mParticleSystem.current.frustumCulled = false;
        // console.log(prefabBufferGeometry);
    })

    const generatePositionAndIndexBuffers = (() => {

        var segmentWidth = 20;
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

        // console.log(positionBuffer);
        // console.log(indexBuffer)

        prefabBufferGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(positionBuffer.length),3));
        var normals = prefabBufferGeometry.getAttribute('normal');

        var vA, vB, vC;

        var p1 = new THREE.Vector3();
        var p2 = new THREE.Vector3();
        var p3 = new THREE.Vector3(); 

        var cA = new THREE.Vector3();
        var cB = new THREE.Vector3();
        
        var indices = indexBuffer.array; 

        // console.log(indexBuffer + " index buffer")
        // 6 
        for(var i = 0; i < prefabIndicesCount; i += 3) {

            // https://en.wikipedia.org/wiki/Vertex_normal
            vA = indexBuffer[i] * 3;
            vB = indexBuffer[i + 1] * 3;
            vC = indexBuffer[i + 2] * 3
            // offset amount

            // https://threejs.org/docs/#api/en/math/Vector3.fromArray
            p1.fromArray(positionBuffer, vA); // retrieve the vector, via this offset value from the array 
            p2.fromArray(positionBuffer, vB);
            p3.fromArray(positionBuffer, vC); 

            cB.subVectors(p3, p2);
            cA.subVectors(p1, p2);
            cB.cross(cA) // we get the value of cb as cross product 

            normals.array[vA] += cB.x;
            normals.array[vA + 1] += cB.y;
            normals.array[vA + 2] += cB.z;

            normals.array[vB] += cB.x;
            normals.array[vB + 1] += cB.y;
            normals.array[vB + 2] += cB.z;

            normals.array[vC] += cB.x;
            normals.array[vC + 1] += cB.y;
            normals.array[vC + 2] += cB.z;


        }

        for(var i = 0; i < particleCount; i++) {
            for(var j =0; j < prefabVerticiesCount; j++) {
                normals[i*prefabIndicesCount + k ] = normals[k];
            }
        }

        normals.needUpdate = true; 

    })


    const initializeParticles = (() => {
            console.log("particles enabled bool: " + enabled)
            mParticleSystem = useRef();
            
            prefabBufferGeometry = new THREE.BufferGeometry(); 
            generatePositionAndIndexBuffers(); // why i messed up 
            fillBufferData();

     })

        
    initializeParticles();
    

        useEffect(() => {
            tick();
        }, [enabled])


    const tick = (() => {
        update();
        // render();

        mTime += mTimeStep;
        mTime %= mDuration;

        requestAnimationFrame(tick)
    })


    const update = (() => {
        // mControls.update();
       //console.log(mParticleSystem.current.material);
       mParticleSystem.current.material.uniforms['uTime'].value = mTime;

    })

    // https://www.robinwieruch.de/conditional-rendering-react

        return(
            <group>
                <pointLight position={[0, 400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
                <pointLight position={[0, -400, 0]} intensity={4} distance={1000} decay={2} color={"white"}/>
                <pointLight position={[0, 0, 400]} intensity={4} distance={1000} decay={2} color={"white"}/>
                <pointLight position={[0, 0, -400]} intensity={4} distance={1000} decay={2} color={"white"}/> 
                <mesh ref={mParticleSystem} args={[prefabBufferGeometry, particleMaterial]}>
            </mesh></group>
        )
}



