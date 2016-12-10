/* eslint no-unused-vars: 0 */
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

    getLineNumbers(tracestep){
        let curstack = this.stack_history.getStackFrames(tracestep) || [];
        let prevstack = this.stack_history.getStackFrames(tracestep-1) || [];
        let prevframe = prevstack[prevstack.length-1] || {};

        let prevLines = [+(prevframe.lineno || 0)];
        let curLines = curstack.map((frame) => +frame.lineno);
        let nextLine = curLines.pop();

        if (prevframe.event === "return"){
            let frame = prevstack[prevstack.length-2] || {};
            prevLines.push(+(frame.lineno || 0));
        }

        if (tracestep == this.stack_history.data.length-1){
            nextLine = 0;
        }

        return {
            prevLines: prevLines,
            curLines: curLines,
            nextLine: nextLine,
        };
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
