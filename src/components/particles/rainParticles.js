import * as THREE from 'three';
import React, {useRef,useEffect } from 'react'
import RainParticleMaterial from "../shaders/RainParticleMaterial.js"

export default function RainParticles(props) {

    var mParticleSystem;
    var prefabGeometry;
    var prefabBufferGeometry; 

    const fillBUfferData = (() => {

    })

    const generatePositionAndIndexBuffers = (() => {

    })

    const initializeParticles = (() => {
        mParticleSystem = useRef();
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