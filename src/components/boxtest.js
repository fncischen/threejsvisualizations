import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import React, { Suspense, useState, useRef,useEffect } from 'react'

export default function BoxTest(props){

    const boxMesh = useRef();
    var testme = [];

    const setUpStuff = (() => {
        testme = [3,3,3];
    })

    setUpStuff();

    useFrame(() => {
        boxMesh.current.rotation.x += 0.003;
        boxMesh.current.rotation.y += 0.003;
        boxMesh.current.rotation.z += 0.003; 
    })

    // const mat = new THREE.MeshBasicMaterial({color: 0x00ff00});

    return (
        <mesh {...props} ref={boxMesh}>
            <boxBufferGeometry args={testme} />
            <meshStandardMaterial color={0x00ff00} attach="material" />
        </mesh>
    )
}

