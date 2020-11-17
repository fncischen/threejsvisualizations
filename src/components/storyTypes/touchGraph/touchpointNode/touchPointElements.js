export default class touchPointElements {

    constructor(props){
        this.characters = props.characters; // on update function, loop through all relevant character animations. 
        // have all event handlers for this specific environment 
        this.environment = props.environment; // initialize all relevant environments
        this.vfx = props.vfx; // have all the specific VFX specific to this touchPoint to loop through, including the position of each VFX, etc.  
    }

}