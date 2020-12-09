export default class TouchPointScene{
    constructor(index, previousPath, nextPath) {
        this.index = index;
        this.previousPath = previousPath;
        this.nextPath = nextPath; 

        this.previousTouchPoint; 
        this.nextTouchPoint; 
    }

    setPreviousTouchPoint(prevTouchPoint) {
        this.previousTouchPoint = prevTouchPoint;
    }

    setNextTouchPoint(nextTouchPoint) {
        this.nextTouchPoint = nextTouchPoint;
    }
}
