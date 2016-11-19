

export class GutterMarkers {
    constructor(cell){
        this.codemirror = cell.code_mirror;
        this.codemirror.setOption('lineNumbers', true);

        this.$curLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-current-line");
        this.$nextLineMarker = $("<i/>")
            .attr("class", "fa fa-long-arrow-right fa-lg")
            .addClass("nbtutor-next-line");

        // Create codemirror gutter id for nbtutor
        let gutters = this.codemirror.options.gutters;
        if (gutters.indexOf("nbtutor-linemarkers") < 0){
            gutters.push("nbtutor-linemarkers");
        }
    }

    setMarkers(curLines, nextLine){
        // First clear current gutter markers
        this.codemirror.clearGutter("nbtutor-linemarkers");

        // Update CodeMirror line markers
        let that = this;
        curLines.map((line) => {
            if (line-1 >= 0) {
                that.codemirror.setGutterMarker(
                    line-1,
                    "nbtutor-linemarkers",
                    that.$curLineMarker.toArray()[0]
                );
            }
        });

        if (nextLine-1 >= 0) {
            this.codemirror.setGutterMarker(
                nextLine-1,
                "nbtutor-linemarkers",
                this.$nextLineMarker.toArray()[0]
            );
        }
    }

    destroy(){
        this.codemirror.clearGutter("nbtutor-linemarkers");
    }
}
