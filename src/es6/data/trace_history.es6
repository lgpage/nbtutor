
import {$} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import {StackHistory} from "./stack_history";
import {HeapHistory} from "./heap_history";
import {OutputHistory} from "./output_history";


export class TraceHistory{
    constructor(cell){
        this.cell = cell;
        this.tracesteps = 0;
        this.stack_history = null;
        this.heap_history = null;
        this.output_history = null;
    }

    clear(){
        this.tracesteps = 0;
        this.stack_history = null;
        this.heap_history = null;
        this.output_history = null;
    }

    curLineNumbers(tracestep){
        /*
         * Get the current code line numbers at a specified trace step in the
         * history
         */
        let stackframes = this.stack_history.getStackFrames(tracestep-1) || [];
        let lines = stackframes.map((frame) => +frame.lineno);
        return lines;
    }

    nextLineNumber(tracestep){
        /*
         * Get the next code line number at a specified trace step in the
         * history
         */
        let stackframes = this.stack_history.getStackFrames(tracestep) || [];
        let frame = stackframes[stackframes.length-1];
        let line = +frame.lineno;
        if (frame.event === "return"){
            frame = stackframes[stackframes.length-2] || {};
            line = +(frame.lineno || 0);
        }
        return line;
    }

    updateData(history){
        /**
         * Update data from history
         */
        this.stack_history = new StackHistory(history.stack_history);
        this.heap_history = new HeapHistory(history.heap_history);
        this.output_history = new OutputHistory(history.output_history);
        this.tracesteps = history.stack_history.length;
    }
}
