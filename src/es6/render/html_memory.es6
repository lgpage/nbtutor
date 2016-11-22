
import {d3, uuid, jsplumb} from "nbtutor-deps";


function connectObjects(fromId, toId, container, cssClass){
    let stateMachineConnector = {
        paintStyle: {lineWidth: 2, stroke: "#056"},
        cssClass: cssClass,
        endpoint: "Blank",
        anchors: ["Right", "Left"],
        connector: ["Bezier", {"curviness": 80}],
        detachable: false,
        overlays: [
            ["Arrow", {length: 10, width: 10, location: 1, cssClass: cssClass}]
        ],
    };
    if (fromId[0] == 'r'){
        stateMachineConnector.anchors = ["Top", "Left"];
    }

    jsplumb.setContainer(container);
    jsplumb.connect({source: fromId, target: toId}, stateMachineConnector);
}


export class MemoryModelUI{
    constructor(trace_history, d3Root){
        this.trace_history = trace_history;
        this.d3Root = d3Root;
        this.connectors = [];
    }

    _setHover(cls, state){
        d3.select(".nbtutor-var-object." + cls)
            .select(".nbtutor-var-value")
            .classed("nbtutor-hover", state);
        d3.select(".nbtutor-var-object." + cls)
            .select("table")
            .classed("nbtutor-hover", state);
        d3.selectAll("svg." + cls).classed("jtk-hover", state);
        d3.selectAll("path." + cls).classed("jtk-hover", state);
    }

    createPrimitive(d, d3Div){
        let d3Obj = d3Div.append("div")
            .attr("class", "nbtutor-var-object")
            .attr("id", d.uuid);

        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(d.type);

        d3Obj.append("div")
            .attr("class", "nbtutor-var-value")
            .text(d.value);
    }

    createSequence(d, d3Div, tracestep){
        d3Div.classed("nbtutor-heap-row-left", true);
        let d3Obj = d3Div.append("div")
            .attr("class", "nbtutor-var-object")
            .attr("id", d.uuid);

        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(d.type);

        let d3Table = d3Obj.append("table")
            .attr("class", "nbtutor-seq-" + d.type);
        let d3IndRow = d3Table.append("tr");
        let d3ValRow = d3Table.append("tr");

        // Create sequence index numbers
        let indexes = [];
        for (let i=0; i<d.value.length; i++){
            indexes.push(i);
        }

        // Add index numbers
        d3IndRow.selectAll("td")
            .data(indexes)
            .enter()
                .append("td")
                .attr("class", "nbtutor-var-index")
                .text((d) => d);

        // Add sequence anchors
        let heap_history = this.trace_history.heap_history;
        let d3Refs = d3ValRow.selectAll("td")
            .data(d.value)
            .enter()
                .append("td")
                .attr("class", "nbtutor-anchor-from");

        let that = this;
        d3Refs.append("div")
            .each(function(d){
                // Create a uuid for the anchor
                d.uuid = 'r-' + uuid.v4();
                // Add connectors data from sequence position to object
                let object = heap_history.getObjectById(tracestep, d.id);
                that.connectors.push({from: d.uuid, to: object.uuid});
                d3.select(this).attr("id", (d) => d.uuid);
            });

        // Toggle mouse hover over ref
        d3Refs.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            that._setHover(d.uuid, true);
        });
        d3Refs.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.uuid, false);
        });
    }

    createDict(d, d3Div, tracestep){
        d3Div.classed("nbtutor-heap-row-left", true);
        let d3Obj = d3Div.append("div")
            .attr("class", "nbtutor-var-object")
            .attr("id", d.uuid);

        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(d.type);

        let d3Table = d3Obj.append("table")
            .attr("class", "nbtutor-seq-" + d.type);

        let d3Rows = d3Table.selectAll("tr")
            .data(d.value)
            .enter()
                .append("tr");

        let d3Keys = d3Rows.append("td")
            .attr("class", "nbtutor-var-key")
            .text((d) => d.key);

        let that = this;
        let heap_history = this.trace_history.heap_history;
        d3Rows.append("td")
            .attr("class", "nbtutor-anchor-from")
            .append("div")
            .each(function(d){
                // Create a uuid for the anchor
                d.uuid = 'r-' + uuid.v4();
                // Add connectors data from sequence position to object
                let object = heap_history.getObjectById(tracestep, d.id);
                that.connectors.push({from: d.uuid, to: object.uuid});
                d3.select(this).attr("id", (d) => d.uuid);
            });

        // Toggle mouse hover over ref
        d3Rows.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            that._setHover(d.uuid, true);
        });
        d3Rows.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.uuid, false);
        });
    }

    createObject(d, d3Div, tracestep){
        switch (d.type){
            case "int":
            case "float":
            case "str":
                this.createPrimitive(d, d3Div);
                break;
            case "list":
            case "tuple":
                this.createSequence(d, d3Div, tracestep);
                break;
            case "dict":
                this.createDict(d, d3Div, tracestep);
                break;
            default:
                this.createPrimitive({
                    uuid: d.uuid,
                    type: d.type,
                    value: 'OBJECT',
                }, d3Div);
        }
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
            that._setHover(d.uuid, true);
        });
        d3Names.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.uuid, false);
        });

        // Create heap objects
        let d3HeapRows = this.d3Root.select(".nbtutor-heap").selectAll("div")
            .data(heap_history.getHeapObjects(tracestep), (d) => d.uuid)
            .enter()
                .append("div")
                .attr("class", "nbtutor-heap-row");

        d3HeapRows.each(function(d){
            let d3Div = d3.select(this);
            that.createObject(d, d3Div, tracestep);
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
