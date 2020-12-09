import TouchPointPath from "./touchPointPath";

export default class TouchPointScene {
    
    /**
    * Object which acts as a node for the camera to traverse to across the scenes in the 3D space
    */
    constructor(index: number, previousPath: TouchPointPath, nextPath: TouchPointPath, previousTouchPoint?: TouchPointScene, nextTouchPoint?: TouchPointScene) {
        this.index = index;
        this.previousPath = previousPath;
        this.nextPath = nextPath;

        this.previousTouchPoint = null;
        this.nextTouchPoint = null; 
    }

    /** 
    @default // touch point scene number  
    **/
    index: number;

    /** 
    @default // previous touchpoint path   
    **/
    previousPath: TouchPointPath;

    /** 
    @default // next touchpoint path   
    **/

    nextPath: TouchPointPath;
    previousTouchPoint: TouchPointScene | null;
    nextTouchPoint: TouchPointScene | null;

    /**
	* Sets previous touch point scene object.
	*/
    setPreviousTouchPoint(previousTouchPoint: TouchPointScene) {
        this.previousTouchPoint = previousTouchPoint;
    }


    /**
	* Sets next touch point scene object.
	*/
    setNextTouchPoint(nextTouchPoint: TouchPointScene){
        this.nextTouchPoint = nextTouchPoint;
    }

}