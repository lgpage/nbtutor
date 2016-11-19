
import {FrameTimeline} from "./frame_timeline";


export class StackTimeline{
    constructor(){
        this.tracestep = 0;
        this.stack_frames = [];
    }

    _fill(){
        let that = this;
        this.stack_frames.map((frame) => {
            frame.tracestep = that.tracestep;
            frame._fill();
        });
    }

    clear(){
        /*
         * Clear the stack timeline
         */
        this.tracestep = 0;
        this.stack_frames = [];
    }

    removeEmptyFrames(){
        /*
         * Remove any frame that does not contain any variables
         */
        let empty = [];
        this.stack_frames.map((frame, i) => {
            if (frame.isEmpty()){
                empty.push(i);
            }
        });

        let that = this;
        empty.sort((a, b) => b - a);
        empty.map((i) => {
            that.stack_frames.splice(i, 1);
        });
    }

    push(stack_frames, heap){
        /*
         * Push all stack frames into the timeline. Values obtained from the
         * heap
         */
        let that = this;
        stack_frames.map((frame) => {
            let found = false;
            for (let i=0; i<that.stack_frames.length; i++){
                if (that.stack_frames[i].uuid === frame.uuid){
                    that.stack_frames[i].push(frame, heap);
                    found = true;
                }
            }
            if (!found){
                that.stack_frames.push(
                    new FrameTimeline(that.tracestep, frame, heap)
                );
            }
        });
        this.tracestep += 1;
        this._fill();
    }

    pop(){
        /*
         * Pop the last values for each of the timeline variables from every
         * stack frame and remove any empty variables and frame
         */
        let popped = [];
        if (this.tracestep > 0){
            this.stack_frames.map((frame) => {
                popped.push({
                    frame: frame.name,
                    uuid: frame.uuid,
                    vars: frame.pop()
                });
            });
            this.tracestep -= 1;
            this.removeEmptyFrames();
        }
        return popped;
    }
}
