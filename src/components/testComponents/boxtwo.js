import * as THREE from 'three';
import React, { Suspense, useState, useRef,useEffect} from 'react'
import { useFrame } from 'react-three-fiber'

export default function BoxTwo(props){

    const boxMesh = useRef();

    var bufferGeometry = new THREE.BufferGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var prefabCount = 50; 
    var segmentWidth = 0.5;

    var squareDimension = Math.floor(Math.sqrt(prefabCount));
    var idx = segmentWidth + 0.2;
    var idy = segmentWidth + 0.2; 

    // we don't have any data on browser size, because that's dependent on the computer size 
    var planeGeometry = new THREE.PlaneGeometry(segmentWidth,segmentWidth);

    let planeGeometryVerticiesCount = planeGeometry.vertices.length;
    console.log('verticies count ' + planeGeometryVerticiesCount);
    let prefabFacesCount = planeGeometry.faces.length;
    let prefabIndiciesCount = prefabFacesCount * 3;

    let verticies = new Float32Array(planeGeometryVerticiesCount * prefabCount * 3)
    let indexBuffer = new Uint32Array(prefabIndiciesCount * prefabCount); // number of faces * 2; 

    let prefabIndicies = [];
    for(var i = 0; i < planeGeometry.faces.length; i++) {
        let face = planeGeometry.faces[i];
        prefabIndicies.push(face.a, face.b, face.c);
    }
    console.log(prefabIndicies + " prefab indicies")

    bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(2*planeGeometryVerticiesCount),2));

    var dx = 0;
    var dy = 0; 

    for(var i = 0, offset = 0; i < prefabCount; i++) {

        if (dx > 3) {
            dx = 0;
            dy += idy; 
        }

        // apply these changes per prefab 
        for(var k = 0; k < planeGeometryVerticiesCount; k++, offset+=3){
            // console.log("offset " + offset);
            var vertex = planeGeometry.vertices[k]

            verticies[offset] = vertex.x + dx - 2; 
            verticies[offset+1] = vertex.y + dy - 2; 
            verticies[offset+2] = vertex.z
        }

        for(var p = 0; p < prefabIndiciesCount ; p++) {
            indexBuffer[i * prefabIndiciesCount + p] = prefabIndicies[p] + i * planeGeometryVerticiesCount;
        }

        dx += idx; 
    }

    console.log(indexBuffer + " index list");
    bufferGeometry.setIndex(new THREE.BufferAttribute(indexBuffer,1));
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(verticies, 3));
    bufferGeometry.material = material;

    console.log("bufferGeometry " + bufferGeometry.getAttribute('position').array);

    // useFrame(() => {
    //     boxMesh.current.rotation.x += 0.003;
    //     boxMesh.current.rotation.y += 0.003;
    //     boxMesh.current.rotation.z += 0.003; 
    // })

    return(
        <mesh ref={boxMesh} args={[bufferGeometry,material]}>

        </mesh>
    )
}