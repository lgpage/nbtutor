
import {FrameTimeline} from "./frametimeline";


export class Timeline{
    constructor(){
        this.time = 0;
        this.frames = [];
    }

    removeEmptyFrames(){
        let empty = [];
        this.frames.map((frame, i) => {
            if (frame.isEmpty()){
                empty.push(i);
            }
        });

        let that = this;
        empty.sort((a, b) => b - a);
        empty.map((i) => {
            that.frames.splice(i, 1);
        });
    }

    clear(){
        this.time = 0;
        this.frames = [];
    }

    push(frames, heap){
        let that = this;
        frames.map((frame) => {
            let found = false;
            for (let i=0; i<that.frames.length; i++){
                if (that.frames[i].uuid === frame.uuid){
                    that.frames[i].push(frame, heap);
                    found = true;
                }
            }
            if (!found){
                that.frames.push(new FrameTimeline(that.time, frame, heap));
            }
        });
        this.time += 1;
    }

    pop(){
        let popped = [];
        if (this.time > 0){
            this.frames.map((frame) => {
                popped.push({
                    frame: frame.name,
                    uuid: frame.uuid,
                    vars: frame.pop()
                });
            });
            this.time -= 1;
            this.removeEmptyFrames();
        }
        return popped;
    }
}
