
import {$} from "nbtutor-deps";

import events from "base/js/events";


export class Toolbar {
    constructor(cell){
        this.$root = cell.celltoolbar.element.find(".button_container");
        this.$btn_first = $("<button/>")
            .text("<< First Line");
        this.$btn_prev = $("<button/>")
            .text("< Prev");
        this.$btn_next = $("<button/>")
            .text("Next >");
        this.$btn_last = $("<button/>")
            .text("Last Line >>");
        this.$select_view = $("<select/>");

        // Should have already been created, but just in case
        cell.metadata.nbtutor = cell.metadata.nbtutor || {};
        this.metadata = cell.metadata.nbtutor;

        // Build the UI elements
        this._build();
    }

    _build(){
        this.$root.addClass("nbtutor-buttons");
        this.$root.append(this.$btn_first);
        this.$root.append(this.$btn_prev);
        this.$root.append(this.$btn_next);
        this.$root.append(this.$btn_last);
        this.$root.children("button")
            .attr("type", "button")
            .addClass("nbtutor-hidden");
        this.$root.append(this.$select_view);

        this.$select_view.append(
            $('<option/>')
            .attr("value", "none")
            .text("-")
        );
        this.$select_view.append(
            $('<option/>')
            .attr("value", "memory")
            .text("Memory")
        );
        this.$select_view.append(
            $('<option/>')
            .attr("value", "timeline")
            .text("Timeline")
        );

        let that = this;
        this.$select_view.change(() => {
            let render_view = this.$select_view.val();
            this.metadata.render_view = render_view;
            if (render_view === "none"){
                this.hideButtons();
            } else {
                this.showButtons();
            }
            events.trigger("render_view_changed.CellToolBar");
        });

        // Initialize the current render view from the metadata
        let render_view = this.metadata.render_view || "none";
        this.$select_view.val(render_view).trigger("change");
    }

    showButtons(){
        this.$root.children("button").removeClass("nbtutor-hidden");
    }

    hideButtons(){
        this.$root.children("button").addClass("nbtutor-hidden");
    }

    destroy(){
    }
}
