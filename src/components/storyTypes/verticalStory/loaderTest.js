import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {useLoader} from "react-three-fiber";

export default function LoaderTest(){

        // https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html
        let objectsInScene;
        let fun;

        // const loader = new GLTFLoader();
        console.log("test me out");
        const loader = new GLTFLoader();
        console.log(loader);

        let scene = new THREE.Scene();
        console.log(scene + " scene");

        loader.load("/models/models2.gltf", function(gltf) {
            console.log('test');
            console.log(gltf.scene.children);
            objectsInScene = gltf.scene;
            fun = gltf.scene.children;
            console.log( fun)

            scene.add(objectsInScene);

        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
            console.log("error : "  + error )
            console.log( 'An error happened' );
    
        }
        );

         console.log(objectsInScene)
         console.log(scene);
         // console.log(fun);
        
        //  const { usedLoader } = useLoader(GLTFLoader, "/models/models2.gltf");
         const {nodes, animations} = useLoader(GLTFLoader, "/models/models2.gltf");

         // https://stackoverflow.com/questions/50674478/javascript-array-looks-like-its-empty-but-has-a-value
         setTimeout(function(){
            console.log(objectsInScene)
         }, 1000)

         console.log(nodes);
        //  console.log(usedLoader);

        return(
            <mesh/>
        )
}

// print out scene graph

// great testing script to break down object 
// function dumpObject(obj, lines = [], isLast = true, prefix = '') {
//     const localPrefix = isLast ? '└─' : '├─'; // see how many children there are 
//     lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`); // put in lines , 
//     const newPrefix = prefix + (isLast ? '  ' : '│ ');
//     const lastNdx = obj.children.length - 1;
//     obj.children.forEach((child, ndx) => {
//       const isLast = ndx === lastNdx;
//       dumpObject(child, lines, isLast, newPrefix);
//     });
//     return lines;
//   }