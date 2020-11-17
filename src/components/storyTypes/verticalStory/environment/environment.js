export default class Environment {
    constructor(props){
        this.environmentPrefab = props.environmentPrefab;
        this.threeJSenvironmentPrefab = null; 
        this.storySpaceCoords = props.storySpaceCoords;
        this.worldSpaceCoords = null;
    }
}