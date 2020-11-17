
// abstract class for different types of touch point streams;
export default class touchPointStream {

    constructor(props){
        this.material = props.material;
        this.touchPointOrigin = props.touchPointOrigin;
        this.touchPointDestination = props.touchPointDestination;
        this.dataInterpolationFunctions = props.dataInterpolationFunctions;
    }

    onDataStart() {

    }
    
    onDataUpdate() {

    }

    // assume that you can pause data stream rendering
    onDataPause() {

    }

    onDataStreamSelect() {

    }

    onDataStreamHover() {
        
    }

}