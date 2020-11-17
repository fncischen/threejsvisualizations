import * as THREE from 'three';
// insert a line to import data from JSON file

export default class VerticalStoryDashboard {

    constructor(props) {
        this.stories = props.stories;
        this.cameraPosition = props.cameraPosition;
        this.camera = null; 
        
        this.initalizeStory();
    }

    onScreenScrollDown(dy) {

    }
    
    onScreenScrollUp(dy) {

    }

    onCameraPanLeft(dx){

    }   
    
    onCameraPanRight(dx) {

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

            character.position += groundPlanePos;
        }

        for(var j = 0; j < story.environments.length; j++) {
            let environment = story.environment[j];
            
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
        for(var i = 0; i < story){

        }
    }

    initalizeStory() {
        for(var i = 0; i < this.stories.length; i++){
            this.convertStorySpaceToWorldSpace(i);
        }
    }

}