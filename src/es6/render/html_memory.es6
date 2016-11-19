
import {d3, jsplumb} from "nbtutor-deps";


function createPrimitive(d, d3Div){
    var d3Obj = d3Div.append("div")
        .attr("class", "nbtutor-var-object")
        .attr("id", d.uuid);

    d3Obj.append("div")
        .attr("class", "nbtutor-var-type")
        .text(d.type);

    d3Obj.append("div")
        .attr("class", "nbtutor-var-value")
        .text(d.value);
}


function createUnknown(d, d3Div){
    createPrimitive({
        uuid: d.uuid,
        type: d.type,
        value: 'OBJECT',
    }, d3Div);
}


function getCreateObjectFunction(type) {
    let func = {
        "int": createPrimitive,
        "float": createPrimitive,
        "str": createPrimitive,
    };
    return func[type] || createUnknown;
}


function connectObjects(fromId, toId, container, cssClass){
    let stateMachineConnector = {
        paintStyle: {lineWidth: 2, stroke: "#056"},
        cssClass: cssClass,
        anchor: "Continuous",
        endpoint: "Blank",
        detachable: false,
        overlays: [
            ["Arrow", {length: 10, width: 10, location: 1, cssClass: cssClass}]
        ],
    };
    jsplumb.setContainer(container);
    jsplumb.connect({source: fromId, target: toId}, stateMachineConnector);
}


export class MemoryModelUI{
    constructor(trace_history, d3Root){
        this.trace_history = trace_history;
        this.d3Root = d3Root;
        this.connectors = [];
    }

    create(tracestep){
        // First destroy any previous visualization
        this.destroy();

        // Init parent div
        this.d3Root.append("div")
            .attr("class", "nbtutor-stack");
        this.d3Root.append("div")
            .attr("class", "nbtutor-heap");

        // Create tables for each frame
        let stack_history = this.trace_history.stack_history;
        let heap_history = this.trace_history.heap_history;
        let d3Frames = this.d3Root.select(".nbtutor-stack").selectAll("div")
            .data(stack_history.getStackFrames(tracestep), (d) => d.uuid)
            .enter()
                .append("div")
                .attr("class", "nbtutor-frame");

        d3Frames.append("table")
            .attr("id", (d) => d.uuid)
            .append("thead")
            .append("tr")
            .append("th")
                .attr("colspan", 2)
                .text((d) => d.name + " frame");
        d3Frames.select("table").append("tbody");
        d3Frames.select("table").append("tfoot");

        // Add names to each frame
        let d3Names = d3Frames.select("tbody").selectAll("tr")
            .data((d) => d.vars, (d) => d.name)
            .enter()
                .append("tr");

        d3Names.append("td")
            .attr("class", "nbtutor-var-name")
            .text((d) => d.name);

        let that = this;
        d3Names.append("td")
            .attr("class", "nbtutor-anchor-from")
            .append("div")
                .attr("id", (d) => d.uuid)
            .each((d) => {
                // Add connectors data from name to object
                let object = heap_history.getObjectById(tracestep, d.id);
                that.connectors.push({from: d.uuid, to: object.uuid});
            });

        // Toggle active frame
        this.d3Root.selectAll("table")
            .classed("nbtutor-active", false);
        d3.select(this.d3Root.selectAll("table")[0].pop())
            .classed("nbtutor-active", true);

        // Toggle mouse hover over name
        d3Names.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            d3.select(".nbtutor-var-object." + d.uuid)
                .select(".nbtutor-var-value")
                .classed("nbtutor-hover", true);
            d3.selectAll("svg." + d.uuid).classed("jtk-hover", true);
            d3.selectAll("path." + d.uuid).classed("jtk-hover", true);
        });
        d3Names.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            d3.select(".nbtutor-var-object." + d.uuid)
                .select(".nbtutor-var-value")
                .classed("nbtutor-hover", false);
            d3.selectAll("svg." + d.uuid).classed("jtk-hover", false);
            d3.selectAll("path." + d.uuid).classed("jtk-hover", false);
        });

        // Create heap objects
        let d3HeapRows = this.d3Root.select(".nbtutor-heap").selectAll("div")
            .data(heap_history.getHeapObjects(tracestep), (d) => d.uuid)
            .enter()
                .append("div")
                .attr("class", "nbtutor-heap-row");

        d3HeapRows.each(function(d){
            let d3Div = d3.select(this);
            let createObject = getCreateObjectFunction(d.type);
            createObject(d, d3Div);
        });

        // Create connector lines
        this.connectors.map((con) => {
            d3.select("#" + con.to).classed(con.from, true);
            connectObjects(con.from, con.to, that.d3Root[0], con.from);
        });
    }

    destroy(){
        jsplumb.empty(this.d3Root[0]);
        this.d3Root.selectAll("div").remove();
        this.connectors = [];
    }
}
