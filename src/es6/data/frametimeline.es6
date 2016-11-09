
function toShortString(type, value){
    let strval = '${value}';
    let map = {
        'int':   (strval.length > 3) ? 'INT' : strval,
        'float': (strval.length > 3) ? 'FLT' : strval,
        'str':   (strval.length > 3) ? 'STR' : strval,
        'func':   'FNC',
        'lambda': 'FNC',
        'class':  'CLS',
        'list':   'LST',
        'tuple':  'TPL',
    };

    let shortstr = map[type];
    if (shortstr === undefined){
        return 'OBJ';
    }
    return shortstr;
}


export class FrameTimeline{
    constructor(time, frame, heap){
        this.start = time;
        this.time = time;
        this.name = frame.name;
        this.uuid = frame.uuid;
        this.vars = [];
        this.push(frame, heap);
    }

    _fill(){
        let that = this;
        this.vars.map((obj) => {
            for (let t=obj.values.length; t<that.time; t++) {
                obj.values.push("");
            }
        });
    }

    removeEmptyVars(){
        let empty = [];
        this.vars.map((obj, i) => {
            if (obj.values.every((val) => val === "")){
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
        let ind = this.vars.map((d) => d.name).indexOf(name);
        return this.vars[ind];
    }

    push(frame, heap){
        if (frame.uuid != this.uuid){
            throw new Error("frame uuid mismatch!");
        }

        let that = this;
        frame.vars.map((obj) => {
            let frame_var = that.getVarByName(obj.name);
            if (frame_var === undefined){
                frame_var = {name: obj.name, values: []};
                that.vars.push(frame_var);
                that._fill();
            }
            let ind = heap.map((d) => d.id).indexOf(obj.id);
            let hobj = heap[ind];
            let strval = toShortString(hobj.type, hobj.value);
            frame_var.values.push(strval);
        });
        this.time += 1;
        this._fill();
    }

    pop(){
        let popped = this.vars.map((obj) => {
            return {name: obj.name};
        });

        let that = this;
        popped.map((obj) => {
            let frame_var = that.getVarByName(obj.name);
            obj.value = frame_var.values.pop();
        });

        this.removeEmptyVars();
        if (this.time > 0) {
            this.time -= 1;
        }
        return popped;
    }

    isEmpty(){
        return this.vars.length === 0;
    }
}
