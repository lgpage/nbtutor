
import {d3} from "nbtutor-deps";


export class TimelineUI{
    constructor(stack_timeline, d3Root){
        this.stack_timeline = stack_timeline;
        this.d3Root = d3Root;
    }

    create(){
        // First destroy any previous visualization
        this.destroy();

        // Create trace step headings data
        let headings = ["Names"];
        for (let t=0; t<this.stack_timeline.tracestep; t++){
            headings.push(t);
        }

        // Create stack timeline tables for each frame
        let that = this;
        let d3Canvas = this.d3Root.append("div")
            .attr("class", "nbtutor-timeline-canvas");

        let d3Tables = d3Canvas.selectAll("div")
            .data(this.stack_timeline.stack_frames, (d) => d.uuid)
            .enter()
                .append("div")
                    .attr("class", "nbtutor-timeline")
                .append("table")
                    .attr("id", (d) => d.uuid);

        let d3Theads = d3Tables.append("thead");
        let d3Tbodys = d3Tables.append("tbody");
        let d3Tfoots = d3Tables.append("tfoot");

        // Create stace step headings
        d3Theads.append("tr").append("th")
            .attr("colspan", this.stack_timeline.tracestep+1)
            .text((d) => d.name);

        d3Theads.append("tr").selectAll("th")
            .data(headings)
            .enter()
                .append("th")
                .text((d) => d);

        // Add names and values to each frame stack timeline
        let d3Rows = d3Tbodys.selectAll("tr")
            .data((d) => d.vars, (d) => d.name)
            .enter()
                .append("tr");

        d3Rows.selectAll("td")
            .data((d) => [d.name].concat(d.values))
            .enter()
                .append("td")
                .attr("class", (d, i) => {
                    return (i > 0) ? "nbtutor-var-value" : "nbtutor-var-name";
                })
                .text((d) => d);

        // Toggle mouce hover over name
        d3Rows.on('mouseover', function(d) {
            d3.select(this).classed("nbtutor-hover", true);
        });
        d3Rows.on('mouseout', function(d) {
            d3.select(this).classed("nbtutor-hover", false);
        });
    }

    destroy(){
        this.d3Root.selectAll("div").remove();
    }
}
