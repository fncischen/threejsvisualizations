import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// insert a line to import data from JSON file

export default class VerticalStoryDashboard {

    constructor(props) {
        this.storyPaths = props.storyPaths; 
        this.stories = [];
        this.cameraPosition = props.cameraPosition;
        this.camera = null; 
        
        this.dyVelocity = 3;
        this.dxVelocity = 5; 

        this.loadStories();
        this.initalizeStory();
        this.setupEventlisteners();
    }

    loadStories() {

        // const loader = new THREE.ObjectLoader();
        // https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html

        // const loader = new GLTFLoader();

        // loader.load( 'path/to/model.glb', function ( gltf ) {   

	    // scene.add( gltf.scene );

        // }, undefined, function ( error ) {

	    // console.error( error );

        // } );

        // for(var path in this.storyPaths){

        // }
    }

    onCameraUpdate(){
        this.camera.position.x = window.scrollX/this.dxVelocity;
    }

    initializeCamera() {
        this.camera = new THREE.Camera({fov: 60, position: this.cameraPosition, near: 0.1, far: 5000})
    }

    // convert 3d objects from storySpace to worldSpace
    convertStorySpaceToWorldSpace(storyIndex) {
        let story = this.stories[index];

        // assume ground plane is imported from box 
        let groundPlane = story.groundPlane; 
        let groundPlaneWidth = groundPlane.width; 
        
        let groundPlaneCoordsX = groundPlaneWidth +  this.retrieveStoryPosX(index); 
        let groundPlaneCoordsY = this.retrieveStoryPosY();
        let groundPlaneCoordsZ = 0;

        let groundPlanePos = new THREE.Vector3(groundPlaneCoordsX,groundPlaneCoordsY, groundPlaneCoordsZ);  
        // refactor 
        for(var i = 0; i < story.characters.length; i++){
            let character = story.characters[i];

            // access character 3d object;
            character.position += groundPlanePos;
        }

        for(var j = 0; j < story.environments.length; j++) {
            let environment = story.environment[j];
            
            // access character 3d object;
            environment.position += groundPlanePos; 
            // convert from story space to world space;

        }
    }

    retieveStoryPosY(){
        let y = this.story[0].height/2; 
        return y; 
    }   

    retrieveStoryPosX(index){
        let width = 0; 

        for(var i = 0; i < this.stories.length; i++){
            width += this.stories[i].width;
        }
        return width; 
    }

    initalizeStory() {
        this.initializeCamera();
        for(var i = 0; i < this.stories.length; i++){
            this.convertStorySpaceToWorldSpace(i);
        }
    }

    setupEventlisteners() {
        
        window.addEventListener('scroll', this.onCameraUpdate);

    }

}