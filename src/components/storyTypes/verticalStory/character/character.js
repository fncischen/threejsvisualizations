export default class Character {
    constructor(props){
        this.characterPrefab = props.characterPrefab;
        this.characterEnvironmentPrefab = null; 
        this.storySpaceCoords = props.storySpaceCoords;
        this.worldSpaceCoords = null;
    }
}