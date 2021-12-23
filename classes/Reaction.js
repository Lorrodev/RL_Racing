class Reaction{
    constructor(inputIndex, inValue, tolerance, outputIndex, outValue){
        this.inputIndex = inputIndex;
        this.inValue = inValue;
        this.tolerance = tolerance;
        this.outputIndex = outputIndex;
        this.outValue = outValue;
    }

    willExecute(actualInput){
        let result = false;

        if(actualInput[this.inputIndex] <= this.inValue + this.tolerance && actualInput[this.inputIndex] >= this.inValue - this.tolerance){
            result = true;
        }

        return result;
    }

    randomlyAdjust(){
        this.inValue += (Math.random() * 2 - 1) / 10;
        this.toleracne += (Math.random() * 2 - 1) / 10;
        this.outValue += (Math.random() * 2 - 1) / 10;

        //Capping outValue
        this.outValue = this.outValue > 1 ? 1 : this.outValue;
        this.outValue = this.outValue < -1 ? -1 : this.outValue;
    }

    clone(){
        return new Reaction(this.inputIndex, this.inValue, this.tolerance, this.outputIndex, this.outValue);
    }
}