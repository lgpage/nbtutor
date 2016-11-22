
function toShortString(type, value){
    /**
     * Get a short string representation for an object type and value
     */
    console.log(value);
    let short_str = {
        'int': (value.length > 3) ? 'INT' : value,
        'float': (value.length > 3) ? 'FLT' : value,
        'str': (value.length > 3) ? 'STR' : value,
        'bool': (typeof value === 'string') ? value[0].toUpperCase() : value,
        'none': 'NON',
        'complex': 'CPX',
        'module': 'MOD',
        'function': 'FNC',
        'lambda': 'FNC',
        'class': 'CLS',
        'list': 'LST',
        'tuple': 'TPL',
    };
    return short_str[type] || 'OBJ';
}


export class FrameTimeline{
    constructor(tracestep, frame, heap){
        this.startstep = tracestep;
        this.tracestep = tracestep;
        this.name = frame.name;
        this.uuid = frame.uuid;
        this.vars = [];
        this.push(frame, heap);
    }

    _fill(){
        /**
        * Fill timeline variable values up to the current trace step in the
        * history with an empty string. For example, if a variable is created
        * in trace step 4 all previous trace step values are filled with an
        * empty string.
        */
        let that = this;
        this.vars.map((object) => {
            for (let t=object.values.length; t<that.tracestep; t++) {
                object.values.push("");
            }
        });
    }

    removeEmptyVars(){
        /**
         * Remove any timeline variables whos values are all empty strings.
         */
        let empty = [];
        this.vars.map((object, i) => {
            if (object.values.every((val) => val === "")){
                empty.push(i);
            }
        });

        let that = this;
        empty.sort((a, b) => b - a);
        empty.map((i) => {
            that.vars.splice(i, 1);
        });
    }

    getVarByName(name){
        /**
         * Get a single timeline variable that matched the specified name
         */
        let ind = this.vars.map((object) => object.name).indexOf(name);
        return this.vars[ind];
    }

    push(frame, heap){
        /**
         * Push a stack frame into the timeline. Values obtained from the heap
         */
        if (frame.uuid != this.uuid){
            throw new Error("frame uuid mismatch!");
        }

        let that = this;
        frame.vars.map((ref) => {
            let frame_var = that.getVarByName(ref.name);
            if (!frame_var){
                frame_var = {name: ref.name, values: []};
                that.vars.push(frame_var);
                that._fill();
            }
            let ind = heap.map((object) => object.id).indexOf(ref.id);
            let object = heap[ind];
            let strval = toShortString(object.type, object.value);
            frame_var.values.push(strval);
        });
        this.tracestep += 1;
        this._fill();
    }

    pop(){
        /**
         * Pop the last values for each of the timeline variables and remove
         * any empty variables
         */
        let popped = this.vars.map((object) => {
            return {name: object.name};
        });

        let that = this;
        popped.map((object) => {
            let frame_var = that.getVarByName(object.name);
            object.value = frame_var.values.pop();
        });

        this.removeEmptyVars();
        if (this.tracestep > 0) {
            this.tracestep -= 1;
        }
        return popped;
    }

    isEmpty(){
        /**
         * True if the frame timeline has any variables, else false
         */
        return this.vars.length === 0;
    }
}
