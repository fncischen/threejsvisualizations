import * as THREE from 'three';
// insert a line to import data from JSON file

export default class VerticalStoryDashboard {

    constructor(props) {
        this.stories = props.stories;
        this.camera = props.camera; 
        

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

    // convert 3d objects from storySpace to worldSpace
    convertStorySpaceToWorldSpace(storyIndex) {
        let story = this.stories[index];

        // assume ground plane is imported from box 
        let groundPlane = story.groundPlane; 
        let groundPlaneWidth = groundPlane.width; 
        let groundPlaneCoords = groundPlane.transformCoords; 


    }

    initalizeStory() {
        for(var i = 0; i < this.stories.length; i++){
            this.convertStorySpaceToWorldSpace(i);
        }
    }

}