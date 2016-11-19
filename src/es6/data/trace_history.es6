
import {$} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import {StackHistory} from "./stack_history";
import {HeapHistory} from "./heap_history";
import {OutputHistory} from "./output_history";

import dialog from "base/js/dialog";
import events from "base/js/events";
import Jupyter from "base/js/namespace";


function alertUserMissingData(){
    let msg = $("<p/>").text(
        "No visualization data was found for this cell. " +
        "Please include the following magic at the start " +
        "of the cell and run the code again:"
    ).append($("<pre/>").text(
        "%visualize"
    ));

    dialog.modal({
        notebook: Jupyter.notebook,
        keyboard_manager: Jupyter.notebook.keyboard_manager,
        title: "Missing Visualization Data",
        body: msg,
        buttons: {
            OK: {}
        }
    });
}


export class TraceHistory{
    constructor(cell){
        this.cell = cell;
        this.tracesteps = 0;
        this.line_numbers = [];
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

    updateData(){
        /**
         * Update data from notebook cell metadata
         */
        let metadata = this.cell.metadata.nbtutor || {};
        let history = metadata.trace_history;
        if (history){
            this.stack_history = new StackHistory(history.stack_history);
            this.heap_history = new HeapHistory(history.heap_history);
            this.output_history = new OutputHistory(history.output_history);
            this.line_numbers = []; //history.line_numbers.map((d) => +d);
            this.tracesteps = history.stack_history.length;
            return 1;
        } else {
            alertUserMissingData();
            return 0;
        }
    }
}
