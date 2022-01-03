class Reaction{
    constructor(inputIndex, inValue, tolerance, outputIndex, outValue, importance = 0){
        this.inputIndex = inputIndex;
        this.inValue = inValue;
        this.tolerance = tolerance;
        this.outputIndex = outputIndex;
        this.outValue = outValue;

        this.fired = 0;
        this.importance = importance;
    }

    willExecute(actualInput){
        let result = false;

        if(actualInput[this.inputIndex] <= this.inValue + this.tolerance && actualInput[this.inputIndex] >= this.inValue - this.tolerance){
            result = true;
            this.fired++;
        }

        this.importance = (this.fired * Math.abs(this.outValue)) / generations[GLOBAL_currentGeneration].steps;
        return result;
    }

    randomlyAdjust(){
        this.inValue += ((Math.random() * 2 - 1) / 10);
        this.tolerance += ((Math.random() * 2 - 1) / 10);
        this.outValue += ((Math.random() * 2 - 1) / 10);

        //Capping values
        this.outValue = this.outValue > 1 ? 1 : this.outValue;
        this.outValue = this.outValue < -1 ? -1 : this.outValue;

        this.tolerance = this.tolerance > 1 ? 1 : this.tolerance;
        this.tolerance = this.tolerance < 0 ? 0 : this.tolerance;
    }

    clone(){
        return new Reaction(this.inputIndex, this.inValue, this.tolerance, this.outputIndex, this.outValue, this.importance);
    }
}