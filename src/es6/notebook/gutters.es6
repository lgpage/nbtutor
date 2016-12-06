

export class GutterMarkers {
    constructor(cell){
        this.codemirror = cell.code_mirror;
        this.codemirror.setOption('lineNumbers', true);
        this.$root = cell.element.find(".inner_cell");
        this.$legend = $("<div/>")
            .addClass("nbtutor-hidden")
            .addClass("nbtutor-legend");

        // Create codemirror gutter id for nbtutor
        let gutters = this.codemirror.options.gutters;
        if (gutters.indexOf("nbtutor-linemarkers") < 0){
            gutters.push("nbtutor-linemarkers");
        }

        // Build the legend elements
        this._build_legend();
    }

    _build_legend(){
        let $prevLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-prev-line");
        let $curLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-current-line");
        let $nextLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-next-line");

        this.$legend.append($("<p/>")
            .append($prevLineMarker)
            .append($("<span/>").text("Previous line")));
        this.$legend.append($("<p/>")
            .append($nextLineMarker)
            .append($("<span/>").text("Next line")));
        this.$legend.append($("<p/>")
            .append($curLineMarker)
            .append($("<span/>").text("Waiting for next frame")));

        this.$root.append(this.$legend);
    }

    setMarkers(lineNumbers){
        // First clear current gutter markers
        this.codemirror.clearGutter("nbtutor-linemarkers");

        let prevLines = lineNumbers.prevLines;
        let curLines = lineNumbers.curLines;
        let nextLine = lineNumbers.nextLine;

        // Update CodeMirror line markers
        let that = this;
        curLines.map((line) => {
            let $curLineMarker = $("<i/>")
                .attr("class", "fa fa-long-arrow-right fa-lg")
                .addClass("nbtutor-current-line");
            if (line-1 >= 0) {
                that.codemirror.setGutterMarker(
                    line-1,
                    "nbtutor-linemarkers",
                    $curLineMarker.toArray()[0]
                );
            }
        });

        prevLines.map((line) => {
            let $prevLineMarker = $("<i/>")
                .attr("class", "fa fa-long-arrow-right fa-lg")
                .addClass("nbtutor-prev-line");
            if (line-1 >= 0) {
                that.codemirror.setGutterMarker(
                    line-1,
                    "nbtutor-linemarkers",
                    $prevLineMarker.toArray()[0]
                );
            }
        });

        let $nextLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-next-line");
        if (nextLine-1 >= 0) {
            this.codemirror.setGutterMarker(
                nextLine-1,
                "nbtutor-linemarkers",
                $nextLineMarker.toArray()[0]
            );
        }
    }

    showLegend(){
        this.$legend.removeClass("nbtutor-hidden");
    }

    hideLegend(){
        this.$legend.addClass("nbtutor-hidden");
    }

    clearMarkers(){
        this.codemirror.clearGutter("nbtutor-linemarkers");
    }

    destroy(){
        this.clearMarkers();
        this.$legend.remove();
    }
}
