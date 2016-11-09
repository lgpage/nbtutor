
import {$} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import dialog from "base/js/dialog";
import Jupyter from "base/js/namespace";


export class StackTrace{
    constructor(cell){
        this.cell = cell;
        this.stacks = [];
        this.heaps = [];
        this.outputs = [];
        this.lines = 0;
    }

    _setUuids(){
        /**
         * Heap object and frame ids may be unique for a given code cell, but
         * may not be unique for the entire notebook so we need to create
         * unique ids. Unique ids are needed for jsPlumb containers and
         * connectors.
         */

        let that = this;
        let frame_ids = [];
        let obj_ids = [];

        // Collect all frame ids
        this.stacks.map((frames) => {
            frames.map((frame) => {
                if (frame_ids.indexOf(frame.id) < 0){
                    frame_ids.push(frame.id);
                }
            });
        });

        // Set frame object unique ids
        frame_ids.map((id) => {
            // Make id identifier start with a letter, else d3 falls over
            let new_uuid = "f-" + uuid.v4();
            that.stacks.map((frames) => {
                frames.map((frame) => {
                    if (frame.id === id) {
                        frame.uuid = new_uuid;
                    }
                });
            });
        });

        // Collect all heap objects
        this.heaps.map((heap) => {
            heap.map((obj) => {
                if (obj_ids.indexOf(obj.id) < 0){
                    obj_ids.push(obj.id);
                }
            });
        });

        // Set heap object unique ids
        obj_ids.map((id) => {
            // Make id identifier start with a letter, else d3 falls over
            let new_uuid = "h-" + uuid.v4();
            that.heaps.map((heap) => {
                heap.map((obj) => {
                    if (obj.id === id) {
                        obj.uuid = new_uuid;
                    }
                });
            });
        });

        // Name ids can be completely unique per stack, frame and name. No need
        // to collect and carry id accross stacks
        this.stacks.map((frames) => {
            frames.map((frame) => {
                frame.vars.map((obj) => {
                    // Make id identifier start with a letter, else d3 falls over
                    obj.uuid = "v-" + uuid.v4();
                });
            });
        });

    }

    getHeapVarById(lineNo, id){
        let heap = this.heaps[lineNo];
        let ind = heap.map((d) => d.id).indexOf(id);
        return heap[ind];
    }

    update(){
        // Update from cell metadata
        let metadata = this.cell.metadata.nbtutor;
        if (metadata.stacktrace === undefined){
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
            return 0;
        }
        else {
            this.stacks = metadata.stacktrace.stacks;
            this.heaps = metadata.stacktrace.heaps;
            this.outputs = metadata.stacktrace.outputs;
            this.lines = this.stacks.length;
            this._setUuids();
            return 1;
        }
    }

    get(lineNo){
        return {
            frames: this.stacks[lineNo],
            heap: this.heaps[lineNo],
            output: this.outputs[lineNo]
        };
    }
}

