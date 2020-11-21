import * as THREE from 'three';
import React, {useRef,useEffect } from 'react'
import RainParticleMaterial from "../shaders/RainParticleMaterial.js"
import particleMaterial from '../shaders/ParticleMaterial.js';

export default function RainParticles(props) {

    var mParticleSystem;
    var prefabGeometry;
    var prefabBufferGeometry;
    
    var startYheight = 20;
    var endYheight = -20;

    var particleCount; 
    var S = 80; // particleDimension 

    const fillBUfferData = (() => {

    })

    // https://codepen.io/cvaneenige/pen/zegVmG
    const generatePositionAndIndexBuffers = (() => {

        var particleCount = 4*S*S;
        var prefabVerticiesLength = prefabGeometry.verticies.length; 

        // prefabBufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * prefabVerticiesLength),3)); // keep for consistency
        prefabBufferGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(new Float32Array(particleCount *3),3));
        prefabBufferGeometry.setAttribute('aEndPosition', new THREE.BufferAttribute(new Float32Array(particleCount *3),3));
        prefabBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount*3),3));


        var posBuffer = prefabBufferGeometry.getAttribute('position');
        var aStartPosBuffer = prefabBufferGeometry.getAttribute('aStartPosition');
        var aEndPosBuffer = prefabBufferGeometry.getAttribute('aEndPosition');
        var aEndPosBuffer = prefabBufferGeometry.getAttribute('color');

        var xzcoords = []

        for (let x = -S; x < S; x += 1) {
            for (let z = -S; z < S; z += 1) {
              xzcoords.push(x / (S / 20) + 1, z / (S / 20) + 1);
              // this meanss between -S and S, the xz coordinates will 

              // x/4 + 1 , z/4 + 1 // iterate every z/4 + 1 (offset). // -19 .... 1, 5/4, 6/4, 7/4, 2, 9/4, 10/4, 11/4, 3 ... -19 (difference of 1/4) //    
            }
          }
        
        // study this 
        for(var i = 0, offset = 0; i < particleCount; i++){
            // 
            for(var j = 0; j < prefabVerticiesLength; j++){
                aStartPosBuffer.array[offset++] = 
                aStartPosBuffer.array[offset++] = startYheight;
                aStartPosBuffer.array[offset++] = 
            }
        }
        // length of particle count 
        // 2S * 2S = 4S^2 ; 

    })

    const initializeParticles = (() => {
        mParticleSystem = useRef();
        particleDimension; // check 
        var prefabGeometry =  new THREE.OctahedronGeometry(1,0) // dont use buffer geometries
        // since we want verticies 
        prefabBufferGeometry = new THREE.BufferGeometry(); 
        generatePositionAndIndexBuffers(); // why i messed up 
        fillBufferData();

    })

    return (
        <mesh ref={mParticleSystem} args={[prefabBufferGeometry, RainParticleMaterial]}>
        </mesh>
    )
}