
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
    let map = {
        "int": createPrimitive,
        "float": createPrimitive,
        "str": createPrimitive,
    };

    let func = map[type];
    if (func === undefined){
        return createUnknown;
    }
    return func;
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
    constructor(stacktrace, d3Root){
        this.stacktrace = stacktrace;
        this.connectors = [];
        this.d3Root = d3Root;
    }

    create(lineNo){
        // First empty the parent div
        this.empty();

        // Init parent div
        this.d3Root.append("div")
            .attr("class", "nbtutor-stack");
        this.d3Root.append("div")
            .attr("class", "nbtutor-heap");

        // Create tables for each frame
        let trace = this.stacktrace.get(lineNo);
        let d3Divs = this.d3Root.select(".nbtutor-stack").selectAll("div")
            .data(
                trace.frames.map((d) => {
                    return {uuid: d.uuid, name: d.name};
                }),
                (d) => d.uuid
            );

        let d3Frames = d3Divs.enter()
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

        // Toggle active class
        this.d3Root.selectAll("table").classed("nbtutor-active", false);
        this.d3Root.selectAll("table:last-child").classed("nbtutor-active", true);

        // Add names to each frame
        let d3Rows = d3Frames.select("tbody").selectAll("tr")
            .data(
                (d, i) => trace.frames[i].vars,
                (d) => {return d.name;}
            );

        let d3Names = d3Rows.enter()
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
                let obj = that.stacktrace.getHeapVarById(lineNo, d.id);
                that.connectors.push({ from: d.uuid, to: obj.uuid });
            });

        // Toggle hover classes
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
            .data(trace.heap, (d) => d.uuid)
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

    empty(keepRoot=true){
        jsplumb.empty(this.d3Root[0]);
        this.connectors = [];
        if (keepRoot) {
            this.d3Root.selectAll("div").remove();
        } else {
            this.d3Root.remove();
        }
    }
}
