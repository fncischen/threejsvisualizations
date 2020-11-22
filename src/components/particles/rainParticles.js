import * as THREE from 'three';
import React, {useRef,useEffect } from 'react'
import RainMat from "../shaders/RainParticleMaterial.js";

export default function RainParticles(props) {

    var mParticleSystem;
    var prefabGeometry;
    var prefabBufferGeometry;
    
    var startYheight = 20;
    var endYheight = -20;

    var multiplier; 

    var particleCount; 
    var mTime = 0;
    var mDuration = 5; 
    var mTimeStep = (1/60);
    var S = 80; // particleDimension 
    var progress = 0;

    var rainParticleMaterial; 

    const setupPositionAndIndexBuffer = (() => {
        const indexes = prefabGeometry.faces.length * 3; 
        const indexBuffer = new Uint32Array(multiplier * indexes);
        const vertexCount = prefabGeometry.vertices.length;
        const vertices = prefabGeometry.vertices;

        const bufferIndexes = [];
        for (let i = 0; i < prefabGeometry.faces.length; i += 1) {
          bufferIndexes.push(prefabGeometry.faces[i].a, prefabGeometry.faces[i].b, prefabGeometry.faces[i].c);
        }

        // Loop over the multiplier
        for (let i = 0; i < multiplier; i += 1) {
          // Loop over the indexes of the baseGeometry
          for (let j = 0; j < indexes; j += 1) {
            // Repeat over the indexes and add them to the buffer
            indexBuffer[i * indexes + j] = bufferIndexes[j] + i * vertexCount;
          }
        }
    
        // Set the index with the data
        prefabBufferGeometry.setIndex(new THREE.BufferAttribute(indexBuffer, 1));
    
        // Create a new attribute to store data in
        const attributeData = new Float32Array(multiplier * vertexCount * 3);
    
        // Value to hold position used in the loop for the array positions
        let offset = 0;
        // Loop over the multiplier
        for (let i = 0; i < multiplier; i += 1) {
          // Loop over the vertexCount of the baseGeometry
          for (let j = 0; j < vertexCount; j += 1, offset += 3) {
            // Repeat over the vertices and add them to the buffer
            const vertex = vertices[j];
            attributeData[offset] = vertex.x;
            attributeData[offset + 1] = vertex.y;
            attributeData[offset + 2] = vertex.z;
          }
        }
    
        const posAttribute = new THREE.BufferAttribute(attributeData, 3);
        prefabBufferGeometry.setAttribute('position', posAttribute);
        // this.addAttribute('position', attribute);
    })

    // https://codepen.io/cvaneenige/pen/zegVmG
    const setupShaderProperties = (() => {

        var xzcoords = []

        for (let x = -S; x < S; x += 1) {
            for (let z = -S; z < S; z += 1) {
              xzcoords.push(x / (S / 20) + 1, z / (S / 20) + 1);
              // this meanss between -S and S, the xz coordinates will 

              // x/4 + 1 , z/4 + 1 // iterate every z/4 + 1 (offset). // -19 .... 1, 5/4, 6/4, 7/4, 2, 9/4, 10/4, 11/4, 3 ... -19 (difference of 1/4) //    
            }
          }

          multiplier = xzcoords.length / 2;

        // var particleCount = 4*S*S;  // this isn't right
        // var particleCount = 4 *S; // because there are 2S x pts, 2S z pts;  
        var prefabVerticiesLength = prefabGeometry.vertices.length; 

        // prefabBufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * prefabVerticiesLength),3)); // keep for consistency
        prefabBufferGeometry.setAttribute('aPositionStart', new THREE.BufferAttribute(new Float32Array(multiplier *3 * prefabVerticiesLength),3));
        prefabBufferGeometry.setAttribute('aPositionEnd', new THREE.BufferAttribute(new Float32Array(multiplier *3 * prefabVerticiesLength),3));
        // prefabBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount*3 * prefabVerticiesLength),3));
        prefabBufferGeometry.setAttribute("aOffset", new THREE.BufferAttribute(new Float32Array(multiplier * prefabVerticiesLength),1));

        // var posBuffer = prefabBufferGeometry.getAttribute('position');
        var aStartPosBuffer = prefabBufferGeometry.getAttribute('aPositionStart');
        var aEndPosBuffer = prefabBufferGeometry.getAttribute('aPositionEnd');
        var aOffset = prefabBufferGeometry.getAttribute('aOffset');
        // var color = prefabBufferGeometry.getAttribute('color');


       

          // this is the real count of the xc coords 
          // 
        
        // study this 
        for(var i = 0, offset = 0; i < multiplier; i++){

            //  apply for each verticies 
            for(var j = 0; j < prefabVerticiesLength; j++){
                aStartPosBuffer.array[offset++] = xzcoords[i * 2]; 
                aStartPosBuffer.array[offset++] = startYheight;
                aStartPosBuffer.array[offset++] = xzcoords[i * 2 + 1];
            }
        }


        for(var i = 0, offset = 0; i < multiplier; i++){

            //  apply for each verticies 
            for(var j = 0; j < prefabVerticiesLength; j++){
                aEndPosBuffer.array[offset++] = xzcoords[i * 2]; 
                aEndPosBuffer.array[offset++] = endYheight;
                aEndPosBuffer.array[offset++] = xzcoords[i * 2 + 1];
            }
        }

        var total = multiplier;
        for(var i = 0, offset = 0; i < multiplier; i++){
           var delay = Math.random() * (total * ((1 - mDuration) / (multiplier - 1)));
           for(var j = 0; j < prefabVerticiesLength; j++) {
               aOffset.array[offset++] = delay; // offset each time you skip a vertices
           }
        }
        // length of particle count 
        // 2S * 2 = 4S ; 
        // const uniforms = {
        //     uProgress: {
        //       value: 0
        //     },
        //     uPosition: {
        //       value: [0, 0, 0]
        //     }
        //   };

        
    })

    const initializeParticles = (() => {
        mParticleSystem = useRef();
        // particleDimension; // check 
        prefabGeometry =  new THREE.OctahedronGeometry(1,0) // dont use buffer geometries
        // since we want verticies 
        prefabBufferGeometry = new THREE.BufferGeometry(); 
        setupShaderProperties(); // why i messed up 
        setupPositionAndIndexBuffer();

        console.log(prefabBufferGeometry);

    })

    initializeParticles();
    console.log('test');
    useEffect(() =>{
        tick();
    })

    const tick = (() => {
        update();
        // render();

        mTime += mTimeStep;
        mTime %= mDuration;

        requestAnimationFrame(tick)
    })

    const update = (() => {
        // mControls.update();
       // mParticleSystem.current.material.uniforms['uTime'].value = mTime;
       mParticleSystem.current.material.uniforms['uProgress'].value = mTime; 
       // console.log(mParticleSystem.current.material.uniforms['uDuration'].value);
       // console.log(mParticleSystem.current.material.uniforms['uP'].value)
        // console.log(mTime);
    })



    // initialize values 
    // mParticleSystem.current.material.uniforms['uProgress'] = 

    return (
        <group>
        <mesh geometry={new THREE.IcosahedronGeometry(1, 2)} material={new THREE.MeshStandardMaterial({
            flatShading: false,
            roughness: 0.1,
            metalness: 0.7
        })} position={[0,0,0]}/>
        <mesh geometry={new THREE.BoxGeometry(440, 440, 440)} material={new THREE.MeshPhongMaterial({color: "blue", emissive: "#212121", side: THREE.BackSide })}/>
        <mesh ref={mParticleSystem} args={[prefabBufferGeometry, RainMat]}>
        </mesh>
        </group>
    )
}