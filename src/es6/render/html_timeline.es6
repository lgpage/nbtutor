
import {d3, jsplumb} from "nbtutor-deps";


export class TimelineUI{
    constructor(timeline, d3Root){
        this.timeline = timeline;
        this.d3Root = d3Root;
    }

    create(){
        let headings = ["Names"];
        for (let t=0; t<this.timeline.time; t++){
            headings.push(t);
        }

        // First empty the parent div
        this.empty();

        // Create timeline tables for each frame
        let that = this;
        let d3Tables = this.d3Root.selectAll("div")
            .data(this.timeline.frames, (d) => d.uuid)
            .enter()
                .append("div")
                    .attr("class", "nbtutor-timeline")
                .append("table")
                    .attr("id", (d) => d.uuid);

        let d3Theads = d3Tables.append("thead");
        let d3Tbodys = d3Tables.append("tbody");
        let d3Tfoots = d3Tables.append("tfoot");

        d3Theads.append("tr").append("th")
            .attr("colspan", this.timeline.time+1)
            .text((d) => d.name + " frame");
        d3Theads.append("tr").selectAll("th")
            .data(headings)
            .enter()
                .append("th")
                .text((d) => d);

        // Add names and values to each frame timeline
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

        // Toggle hover class
        d3Rows.on('mouseover', function(d) {
            d3.select(this).classed("nbtutor-hover", true);
        });
        d3Rows.on('mouseout', function(d) {
            d3.select(this).classed("nbtutor-hover", false);
        });
    }

    empty(keepRoot=true){
        jsplumb.empty(this.d3Root[0]);
        if (keepRoot) {
            this.d3Root.selectAll("div").remove();
        } else {
            this.d3Root.remove();
        }
    }
}
