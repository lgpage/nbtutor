
import {d3} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import {Toolbar} from "./toolbar";
import {GutterMarkers} from "./gutters";
import {TraceHistory} from "../data/trace_history";
import {StackTimeline} from "../data/stack_timeline";
import {MemoryModelUI} from "../render/html_memory";
import {TimelineUI} from "../render/html_timeline";

import events from "base/js/events";


export class VisualizedCell {
    constructor(cell){
        cell.metadata.nbtutor = cell.metadata.nbtutor || {};

        this.tracestep = 0;
        this.trace_history = new TraceHistory(cell);
        this.stack_timeline = new StackTimeline();

        this.cell = cell;
        this.metadata = cell.metadata.nbtutor;

        this.$input_area = cell.element.find(".input_area")
            .addClass("nbtutor-input-area");
        this.$nbtutor_canvas = $("<div/>")
            .attr("class", "nbtutor-canvas")
            .attr("id", "c-" + uuid.v4())
            .addClass("nbtutor-hidden");
        this.d3Root = d3.select(this.$nbtutor_canvas.toArray()[0]);

        this.toolbar = new Toolbar(cell);
        this.markers = new GutterMarkers(cell);
        this.memoryUI = new MemoryModelUI(this.trace_history, this.d3Root);
        this.timelineUI = new TimelineUI(this.stack_timeline, this.d3Root);

        // Build the UI elements
        this._build();
    }

    _bindButtons(){
        let that = this;

        this.toolbar.$btn_first.on("click", () => {
            let stack_history = this.trace_history.stack_history;
            let heap_history = this.trace_history.heap_history;
            let output_history = this.trace_history.output_history;

            that.tracestep = 0;
            that.stack_timeline.clear();
            that.stack_timeline.push(
                stack_history.getStackFrames(that.tracestep),
                heap_history.getHeapObjects(that.tracestep)
            );
            that.visualize();
        });

        this.toolbar.$btn_prev.on("click", () => {
            if (that.tracestep > 0){
                that.tracestep -= 1;
                that.stack_timeline.pop();
                that.visualize();
            }
        });

        this.toolbar.$btn_next.on("click", () => {
            if (that.tracestep < that.trace_history.tracesteps-1){
                let stack_history = this.trace_history.stack_history;
                let heap_history = this.trace_history.heap_history;
                let output_history = this.trace_history.output_history;

                that.tracestep += 1;
                that.stack_timeline.push(
                    stack_history.getStackFrames(that.tracestep),
                    heap_history.getHeapObjects(that.tracestep)
                );
                that.visualize();
            }
        });

        this.toolbar.$btn_last.on("click", () => {
            let stack_history = this.trace_history.stack_history;
            let heap_history = this.trace_history.heap_history;
            let output_history = this.trace_history.output_history;

            that.stack_timeline.clear();
            that.tracestep = that.trace_history.tracesteps-1;
            for (let tracestep=0; tracestep<that.tracestep+1; tracestep++){
                that.stack_timeline.push(
                    stack_history.getStackFrames(tracestep),
                    heap_history.getHeapObjects(tracestep)
                );
            }
            that.visualize();
        });
    }

    _build(){
        this._bindButtons();
        this.$input_area.append(this.$nbtutor_canvas);

        let that = this;
        events.on('global_hide.CellToolBar', () => {
            that.destroy();
        });

        events.on("render_view_changed.CellToolBar", () => {
            let render_view = that.metadata.render_view;
            if (render_view == "none"){
                that.$nbtutor_canvas.addClass("nbtutor-hidden");
                that.markers.destroy();
            } else {
                if (that.trace_history.updateData()){
                    // Only visualize the execute if the data could be updated
                    that.$nbtutor_canvas.removeClass("nbtutor-hidden");
                    that.toolbar.$btn_first.trigger("click");
                } else {
                    // Else set the render view back to 'none'
                    that.toolbar.$select_view.val("none").trigger("change");
                }
            }
        });
    }

    visualize(){
        // visualize code execution
        let render_view = this.metadata.render_view;
        if (render_view == "memory"){
            this.memoryUI.create(this.tracestep);
        }
        if (render_view == "timeline"){
            this.timelineUI.create();
        }

        let curLines = this.trace_history.curLineNumbers(this.tracestep);
        let nextLine = this.trace_history.nextLineNumber(this.tracestep);
        this.markers.setMarkers(curLines, nextLine);
    }

    updateData(){
        let json_str = this.cell.output_area.outputs[0].text;

        try {
            // If it looks like our object, and smells like it...
            let trace_history = JSON.parse(json_str);
            if (trace_history.stack_history && trace_history.heap_history){
                this.metadata.trace_history = trace_history;
            }
        }
        catch (err) {
            this.metadata.trace_history = undefined;
        }
        finally {
            this.toolbar.$select_view.trigger("change");
            return Boolean(this.metadata.trace_history);
        }
    }

    destroy(){
        this.$nbtutor_canvas.remove();
        this.markers.destroy();
        this.cell.nbtutor = null;
    }
}
