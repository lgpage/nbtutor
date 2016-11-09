
import {uuid} from "nbtutor-deps";


export class StackHistory{
    constructor(data){
        this.data = data || [];
        this._setUUids();
    }

    _setUUids(){
        /**
         * Frame and variable ids may be unique for a given code cell, but may
         * not be unique for the entire notebook so we need to create unique
         * ids. Unique ids are needed for the jsPlumb connectors and timeline
         * data.
         */
        let that = this;
        let frame_ids = [];

        // Collect all unique frame ids
        this.data.map((stack_frames) => {
            stack_frames.map((frame) => {
                if (frame_ids.indexOf(frame.id) < 0){
                    frame_ids.push(frame.id);
                }
            });
        });

        // Set frame uuids
        frame_ids.map((id) => {
            // Make id identifier start with a letter, else d3 falls over
            let new_uuid = "f-" + uuid.v4();
            that.data.map((stack_frames) => {
                stack_frames.map((frame) => {
                    if (frame.id === id) {
                        frame.uuid = new_uuid;
                    }
                });
            });
        });

        // Variable uuids can be completely unique. No need
        // to collect and carry uuids accross tracesteps
        this.data.map((stack_frames) => {
            stack_frames.map((frame) => {
                frame.vars.map((ref) => {
                    // Make id identifier start with a letter, else d3 falls over
                    ref.uuid = "v-" + uuid.v4();
                });
            });
        });
    }

    getStackFrames(tracestep){
        /*
         * Get the stack frames at a specified trace step in the history
         */
        return this.data[tracestep];
    }

    getFrameById(tracestep, id){
        /*
         * Get a single frame at a specified trace step in the history
         * that matches a specified frame id.
         */
        let frames = this.getStackFrames(tracestep) || [];
        let ind = frames.map((d) => d.id).indexOf(id);
        return frames[ind];
    }

    getFrameVarByName(tracestep, frame_id, name){
        /*
         * Get a single frame variable at a specified trace step in the history
         * that matches a specified frame id and variable name.
         */
        let frame = this.getFrameById(tracestep, frame_id) || [];
        let variables = frame.vars || []
        let ind = frame.vars.map((d) => d.name).indexOf(name);
        return variables[ind];
    }

    getFrameVarById(tracestep, frame_id, id){
        /*
         * Get a single frame variable at a specified trace step in the history
         * that matches a specified frame id and reference id.
         */
        let frame = this.getFrameById(tracestep, frame_id) || [];
        let variables = frame.vars || []
        let ind = frame.vars.map((d) => d.id).indexOf(id);
        return variables[ind];
    }
}
