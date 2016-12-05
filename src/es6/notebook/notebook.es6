
import {d3} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import {Toolbar} from "./toolbar";
import {GutterMarkers} from "./gutters";
import {TraceHistory} from "../data/trace_history";
import {StackTimeline} from "../data/stack_timeline";
import {MemoryModelUI} from "../render/html_memory";
import {TimelineUI} from "../render/html_timeline";

import dialog from "base/js/dialog";
import events from "base/js/events";
import Jupyter from "base/js/namespace";


function alertUserMissingData(){
    let msg = $("<p/>").text(
        "No visualization data was found for this cell. " +
        "Please include the following magic at the start " +
        "of the cell and run the code again:"
    ).append($("<pre/>").text(
        "%%nbtutor"
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


export class VisualizedCell {
    constructor(cell){
        this.tracestep = 0;
        this.trace_history = new TraceHistory(cell);
        this.stack_timeline = new StackTimeline();

        this.cell = cell;
        this.codemirror = cell.code_mirror;
        this.output_area = this.cell.output_area;

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

    _checkData(){
        // Alert if no data
        if (!this.trace_history || !this.trace_history.stack_history){
            this.toolbar.$select_view.val("none").trigger("change");
            alertUserMissingData();
        }
    }

    _bindButtons(){
        let that = this;

        this.toolbar.$btn_first.on("click", () => {
            let stack_history = this.trace_history.stack_history;
            let heap_history = this.trace_history.heap_history;

            that._checkData();
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
                that._checkData();
                that.tracestep -= 1;
                that.stack_timeline.pop();
                that.visualize();
            }
        });

        this.toolbar.$btn_next.on("click", () => {
            if (that.tracestep < that.trace_history.tracesteps-1){
                let stack_history = this.trace_history.stack_history;
                let heap_history = this.trace_history.heap_history;

                that._checkData();
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

            that._checkData();
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
        events.on("global_hide.CellToolBar", () => {
            that.destroy();
        });

        this.toolbar.$select_view.on("change", function(){
            that.memoryUI.destroy();
            let render_view = $(this).val();
            if (render_view == "none"){
                that.markers.clearMarkers();
                that.markers.hideLegend();
                that.$nbtutor_canvas.addClass("nbtutor-hidden");
            } else {
                that.markers.showLegend();
                that.$nbtutor_canvas.removeClass("nbtutor-hidden");
                that.toolbar.$btn_first.trigger("click");
            }
        });

        this.codemirror.on("change", () => {
            that.markers.clearMarkers();
            that.toolbar.$select_view.val("none").trigger("change");
            that.trace_history.clear();
        });
    }

    visualize(){
        // visualize code execution
        let render_view = this.toolbar.$select_view.val();
        if (render_view == "memory"){
            this.memoryUI.create(this.tracestep);
        }
        if (render_view == "timeline"){
            this.timelineUI.create();
        }

        // Add CodeMirror line markers
        let lineNumbers = this.trace_history.getLineNumbers(this.tracestep);
        this.markers.setMarkers(lineNumbers);

        // Manage cell output
        let output_history = this.trace_history.output_history;
        this.output_area.clear_output();
        this.output_area.handle_output({
            header: {msg_type: "stream"},
            content: {
                name: "nbtutor",
                text: output_history.getOutput(this.tracestep),
            },
        });
    }

    updateData(data){
        this.output_area.clear_output();
        this.trace_history.updateData(data)
        this.toolbar.$select_view.val("memory").trigger("change");
    }

    destroy(){
        this.$nbtutor_canvas.remove();
        this.markers.destroy();
        this.toolbar.destroy();
        this.cell.nbtutor = null;
    }
}
