export default class TouchPointScene{
    constructor(index, previousPath, nextPath) {
        this.index = index;
        this.previousPath = previousPath;
        this.nextPath = nextPath; 

        this.previousTouchPoint = null; 
        this.nextTouchPoint = null; 

        this.bufferGeometryPreviousPath = null; // dont require it, make it optional 
        this.bufferGeometryNextPath = null; // dont require it, make it optional 

        this.bufferGeometryActive = false; 
    }

    setPreviousTouchPoint(prevTouchPoint) {
        this.previousTouchPoint = prevTouchPoint;
    }

    setNextTouchPoint(nextTouchPoint) {
        this.nextTouchPoint = nextTouchPoint;
    }

    // optional beizer path generated via geometry 
    // for debugging purposes 
    generateBeizerPathGeometries() {

    }
}
