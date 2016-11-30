
import {$, d3, uuid, jsplumb} from "nbtutor-deps";


export class MemoryModelUI{
    constructor(trace_history, d3Root){
        this.trace_history = trace_history;
        this.d3Root = d3Root;
        this.connectors = [];
        this.objects_rendered = [];
        this.jsplumb = jsplumb.getInstance({
            Container: this.d3Root[0],
        });
    }

    _setHover(cls, state){
        d3.select(".nbtutor-var-object." + cls).select(".nbtutor-var-value")
            .classed("nbtutor-hover", state);
        d3.select(".nbtutor-var-object." + cls).select("table")
            .classed("nbtutor-hover", state);
        d3.selectAll("svg." + cls).classed("jtk-hover", state);
        d3.selectAll("path." + cls).classed("jtk-hover", state);
    }

    _connectObjects(){
        let that = this;
        this.connectors.map((con) => {
            let stateMachineConnector = {
                paintStyle: {lineWidth: 2, stroke: "#056"},
                endpoint: "Blank",
                anchors: ["Right", "Left"],
                connector: ["Bezier", {"curviness": 80}],
                detachable: false,
                overlays: [
                    ["Arrow", {length: 10, width: 10, location: 1}]
                ],
            };
            stateMachineConnector.cssClass = con.from;
            stateMachineConnector.overlays[0][1].cssClass = con.from;
            if (con.from[0] == 'r'){
                stateMachineConnector.anchors = [
                    "Top", ["Left", "Right"]
                ];
            }

            d3.select("#" + con.to).classed(con.from, true);
            this.jsplumb.connect({
                source: con.from,
                target: con.to
            }, stateMachineConnector);
        });
    }

    _createHeapDiv(object){
        let position = object.options.position || 'right';
        let d3Obj = this.d3Root.select(".nbtutor-heap")
            .append("div")
                .attr("class", "nbtutor-heap-row-" + position)
            .append("div")
                .attr("class", "nbtutor-var-object")
                .attr("id", object.uuid);
        return d3Obj;
    }

    _createPrimitive(object){
        let d3Obj = this._createHeapDiv(object);
        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(object.type);
        d3Obj.append("div")
            .attr("class", "nbtutor-var-value")
            .text(object.value);
    }

    _createSequence(object, tracestep){
        let that = this;
        let heap_history = this.trace_history.heap_history;
        object.values.map((obj) => {
            let child = heap_history.getObjectById(tracestep, obj.id);
            if (!object.options.inline || child.catagory != 'primitive'){
                obj.uuid = 'r-' + uuid.v4();
                that._createObject(child, tracestep);
                that.connectors.push({
                    from: obj.uuid,
                    to: child.uuid
                });
            }
        });

        let d3Obj = this._createHeapDiv(object);
        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(object.type);

        let d3Table = d3Obj.append("table")
            .attr("class", "nbtutor-seq-" + object.type);
        let d3IndRow = d3Table.append("tr");
        let d3ValRow = d3Table.append("tr");

        // Create sequence index numbers
        let indexes = [];
        for (let i=0; i<object.values.length; i++){
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
        let d3Refs = d3ValRow.selectAll("td")
            .data(object.values)
            .enter()
                .append("td")
                .attr("class", "nbtutor-anchor-from");

        d3Refs.append("div")
            .each(function(d){
                let child = heap_history.getObjectById(tracestep, d.id);
                if (object.options.inline && child.catagory === 'primitive'){
                    d3.select(this).text(child.value);
                } else {
                    d3.select(this).attr("id", (d) => d.uuid);
                }
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

    _createKeyValue(object, tracestep){
        let that = this;
        let heap_history = this.trace_history.heap_history;
        object.values.map((obj) => {
            let key = heap_history.getObjectById(tracestep, obj.key_id);
            if (!object.options.inline_keys || key.catagory != 'primitive'){
                obj.key_uuid = 'r-' + uuid.v4();
                that._createObject(key, tracestep);
                that.connectors.push({
                    from: obj.key_uuid,
                    to: key.uuid
                });
            }
            let value = heap_history.getObjectById(tracestep, obj.val_id);
            if (!object.options.inline_vals || value.catagory != 'primitive'){
                obj.val_uuid = 'r-' + uuid.v4();
                that._createObject(value, tracestep);
                that.connectors.push({
                    from: obj.val_uuid,
                    to: value.uuid
                });
            }
        });


        let d3Obj = this._createHeapDiv(object);
        d3Obj.append("div")
            .attr("class", "nbtutor-var-type")
            .text(object.type);

        let d3Table = d3Obj.append("table")
            .attr("class", "nbtutor-seq-key-value");

        let d3Rows = d3Table.selectAll("tr")
            .data(object.values)
            .enter()
                .append("tr");

        let d3Keys = d3Rows.append("td")
            .attr("class", "nbtutor-anchor-from");
        let d3Vals = d3Rows.append("td")
            .attr("class", "nbtutor-anchor-from");

        d3Keys.append("div")
            .each(function(d){
                let key = heap_history.getObjectById(tracestep, d.key_id);
                if (object.options.inline_keys && key.catagory === 'primitive'){
                    d3.select(this).text(key.value);
                } else {
                    d3.select(this).attr("id", (d) => d.key_uuid);
                }
            });

        d3Vals.append("div")
            .each(function(d){
                let value = heap_history.getObjectById(tracestep, d.val_id);
                if (object.options.inline_vals && value.catagory === 'primitive'){
                    d3.select(this).text(value.value);
                } else {
                    d3.select(this).attr("id", (d) => d.val_uuid);
                }
            });

        // Toggle mouse hover over ref
        d3Keys.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            that._setHover(d.key_uuid, true);
        });
        d3Keys.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.key_uuid, false);
        });
        d3Vals.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            that._setHover(d.val_uuid, true);
        });
        d3Vals.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.val_uuid, false);
        });
    }

    _createObject(object, tracestep){
        if (this.objects_rendered.indexOf(object.uuid) >= 0){
            return;
        }

        this.objects_rendered.push(object.uuid);
        switch (object.catagory){
            case "primitive":
                this._createPrimitive(object);
                break;
            case "sequence":
                this._createSequence(object, tracestep);
                break;
            case "key-value":
                this._createKeyValue(object, tracestep);
                break;
            default:
                this._createPrimitive({
                    uuid: object.uuid,
                    type: object.type,
                    options: object.options,
                    value: 'OBJECT',
                });
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

        let stack_history = this.trace_history.stack_history;
        let heap_history = this.trace_history.heap_history;
        let stack_frames = stack_history.getStackFrames(tracestep);

        // Create tables for each frame
        let d3Frames = this.d3Root.select(".nbtutor-stack").selectAll("div")
            .data(stack_frames, (d) => d.uuid)
            .enter()
                .append("div")
                .attr("class", "nbtutor-frame");

        d3Frames.append("table")
            .attr("id", (d) => d.uuid)
            .append("thead")
            .append("tr")
            .append("th")
                .attr("colspan", 2)
                .text((d) => d.name);
        d3Frames.select("table").append("tbody");
        d3Frames.select("table").append("tfoot");

        // Add names to each frame
        let d3Names = d3Frames.select("tbody").selectAll("tr")
            .data((d) => {
                return d.vars.map((v) => {
                    return {object: v, options: d.options};
                });
            }, (d) => d.object.name)
            .enter()
                .append("tr");

        let that = this;
        d3Names.append("td")
            .attr("class", "nbtutor-var-name")
            .text((d) => d.object.name);

        d3Names.append("td")
            .attr("class", "nbtutor-anchor-from")
            .append("div")
                .attr("id", (d) => d.object.uuid)
            .each(function(d){
                let object = heap_history.getObjectById(tracestep, d.object.id);
                if (d.options.inline && object.catagory === 'primitive'){
                    d3.select(this).text(object.value);
                } else {
                    that._createObject(object, tracestep);
                    that.connectors.push({
                        from: d.object.uuid,
                        to: object.uuid
                    });
                }
            });

        // Create connector lines
        this._connectObjects();

        // Toggle active frame
        let d3Tables = this.d3Root.select(".nbtutor-stack").selectAll("table");
        d3Tables.classed("nbtutor-active", false);
        d3.select(d3Tables[0].pop()).classed("nbtutor-active", true);

        // Toggle mouse hover over name
        d3Names.on('mouseover', function(d){
            d3.select(this).classed("nbtutor-hover", true);
            that._setHover(d.object.uuid, true);
        });
        d3Names.on('mouseout', function(d){
            d3.select(this).classed("nbtutor-hover", false);
            that._setHover(d.object.uuid, false);
        });

        $(window).resize(function(){
            that.jsplumb.repaintEverything();
        });
    }

    destroy(){
        this.jsplumb.empty(this.d3Root[0]);
        this.d3Root.selectAll("div").remove();
        this.connectors = [];
        this.objects_rendered = [];
    }
}
