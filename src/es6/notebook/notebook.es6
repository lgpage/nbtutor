
import {d3} from "nbtutor-deps";
import {uuid} from "nbtutor-deps";

import {StackTrace} from "../data/stacktrace";
import {Timeline} from "../data/timeline";

import {Toolbar} from "./toolbar";
import {MemoryModelUI} from "../render/html_memory";
import {TimelineUI} from "../render/html_timeline";

import events from "base/js/events";


export class VisualizedCell {
    constructor(cell){
        if (cell.metadata.nbtutor === undefined){
            cell.metadata.nbtutor = {};
        }

        this.lineNo = 0;
        this.cell = cell;
        this.codemirror = cell.code_mirror;
        this.toolbar = new Toolbar(cell);
        this.stacktrace = new StackTrace(cell);
        this.timeline = new Timeline();

        let stack = this.stacktrace.get(this.lineNo);
        if (stack.frames){
            this.timeline.push(stack.frames, stack.heap);
        }

        this.d3Root = null;
        this.$input_area = null;
        this.$nbtutor_canvas = null;
        this.memoryUI = null;
        this.timelineUI = null;
    }

    initUI(){
        this.$input_area = this.cell.element.find(".input_area")
            .addClass("nbtutor-input-area");

        this.$nbtutor_canvas = $("<div/>")
            .attr("class", "nbtutor-canvas")
            .attr("id", "c-" + uuid.v4())
            .addClass("nbtutor-hidden");

        this.$input_area.append(this.$nbtutor_canvas);
        this.d3Root = d3.select(this.$nbtutor_canvas.toArray()[0]);
        this.memoryUI = new MemoryModelUI(this.stacktrace, this.d3Root);
        this.timelineUI = new TimelineUI(this.timeline, this.d3Root);

        let that = this;
        events.on('global_hide.CellToolBar', () => {
            that.$nbtutor_canvas.remove();
            that.codemirror.clearGutter("nbtutor-linemarkers");
        });

        this.toolbar.$select_view.change(() => {
            if (that.toolbar.$select_view.val() != "none"){
                // Try updated the stacktrace data first
                if (!that.stacktrace.update()){
                    that.toolbar.$select_view.val("none").trigger("change");
                    return;
                }
                else {
                    this.toolbar.$btn_first.trigger("click");
                }
            }
            that.updateUI();
        });

        let gutters = this.codemirror.options.gutters;
        if (gutters.indexOf("nbtutor-linemarkers") < 0){
            gutters.push("nbtutor-linemarkers");
        }

        this.toolbar.initUI();
        this.bindButtons();
        return this;
    }

    updateUI(){
        let render_view = this.toolbar.$select_view.val();
        if (render_view == "none"){
            this.$nbtutor_canvas.addClass("nbtutor-hidden");
        }
        else {
            this.$nbtutor_canvas.removeClass("nbtutor-hidden");
            if (render_view == "memory"){
                this.memoryUI.create(this.lineNo);
            }
            if (render_view == "timeline"){
                this.timelineUI.create();
            }

            let info = this.codemirror.lineInfo(this.lineNo-1);
            let lineMarker = $("<i/>")
                .attr("class", "fa fa-long-arrow-right fa-lg")
                .addClass("nbtutor-current-line");
            let nextLineMarker = $("<i/>")
                .attr("class", "fa fa-long-arrow-right fa-lg")
                .addClass("nbtutor-next-line");

            // FIXME: Codemirror line number mapping to stack lineNo
            this.codemirror.setOption('lineNumbers', true);
            this.codemirror.clearGutter("nbtutor-linemarkers");
            this.codemirror.setGutterMarker(
                this.lineNo-1,
                "nbtutor-linemarkers",
                lineMarker.toArray()[0]
            );
            this.codemirror.setGutterMarker(
                this.lineNo,
                "nbtutor-linemarkers",
                nextLineMarker.toArray()[0]
            );
        }
    }

    updateData(){
        try {
            // If it looks like our object, and smells like it...
            let jsonstr = this.cell.output_area.outputs[0].text;
            let stacktrace = JSON.parse(jsonstr);
            if (stacktrace.stacks &&
                stacktrace.heaps &&
                stacktrace.outputs
            ){
                this.cell.metadata.nbtutor.stacktrace = stacktrace;
                this.toolbar.$select_view.val("none").trigger("change");
            }
        } catch (SyntaxError) {
            // Do nothing
            return 0;
        }
    }

    bindButtons(){
        let that = this;

        this.toolbar.$btn_first.on("click", () => {
            that.lineNo = 0;
            that.timeline.clear();
            let stack = that.stacktrace.get(that.lineNo);
            that.timeline.push(stack.frames, stack.heap);
            that.updateUI();
        });

        this.toolbar.$btn_prev.on("click", () => {
            if (that.lineNo > 0){
                that.lineNo -= 1;
                that.timeline.pop();
                that.updateUI();
            }
        });

        this.toolbar.$btn_next.on("click", () => {
            if (that.lineNo < that.stacktrace.lines-1){
                that.lineNo += 1;
                let stack = that.stacktrace.get(that.lineNo);
                that.timeline.push(stack.frames, stack.heap);
                that.updateUI();
            }
        });

        this.toolbar.$btn_last.on("click", () => {
            that.timeline.clear();
            for (let lineNo=0; lineNo<that.stacktrace.lines; lineNo++){
                let stack = that.stacktrace.get(lineNo);
                that.timeline.push(stack.frames, stack.heap);
            }
            that.lineNo = that.stacktrace.lines-1;
            that.updateUI();
        });
    }
}
