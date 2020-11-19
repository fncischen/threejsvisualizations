import * as THREE from 'three';
import React, {useRef,useEffect } from 'react'
import RainParticleMaterial from "../shaders/RainParticleMaterial.js"
import particleMaterial from '../shaders/ParticleMaterial.js';

export default function RainParticles(props) {

    var mParticleSystem;
    var prefabGeometry;
    var prefabBufferGeometry;
    var particleCount = 80; 
    var particleDimension;

    const fillBUfferData = (() => {

    })

    // https://codepen.io/cvaneenige/pen/zegVmG
    const generatePositionAndIndexBuffers = (() => {

        prefabBufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount*3),3));
        prefabBufferGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3),3));
        prefabBufferGeometry.setAttribute('aEndPosition', new THREE.BufferAttribute(new Float32Array(particleCount*3),3));
        prefabBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount*3),3));


        var posBuffer = prefabBufferGeometry.getAttribute('position');
        var aStartPosBuffer = prefabBufferGeometry.getAttribute('aStartPosition');
        var aEndPosBuffer = prefabBufferGeometry.getAttribute('aEndPosition');
        var aEndPosBuffer = prefabBufferGeometry.getAttribute('color');

        for (let x = -S, offset = 0; x < particleCount; x += 1) {
            for (let z = -S; z < S; z += 1) {
              posBuffer.array[offset++] = (x / (S / 20) + 1;
              posBuffer.array[offset++] = z / (S / 20) + 1;
            }
          }


    })

    const initializeParticles = (() => {
        mParticleSystem = useRef();
        particleDimension; // check 
        var prefabGeometry =  new THREE.IcosahedronGeometry(1, 2);
        prefabBufferGeometry = new THREE.BufferGeometry(); 
        generatePositionAndIndexBuffers(); // why i messed up 
        fillBufferData();

    })

    return (
        <mesh ref={mParticleSystem} args={[prefabBufferGeometry, RainParticleMaterial]}>
        </mesh>
    )
}