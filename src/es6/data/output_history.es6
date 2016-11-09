

export class OutputHistory{
    constructor(data){
        this.data = data;
    }

    getOutput(tracestep){
        /*
         * Get the output at a specified trace step in the history
         */
        return this.data[tracestep];
    }
}
