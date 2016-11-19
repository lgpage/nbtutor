

export class GutterMarkers {
    constructor(cell){
        this.codemirror = cell.code_mirror;
        this.codemirror.setOption('lineNumbers', true);

        // Create codemirror gutter id for nbtutor
        let gutters = this.codemirror.options.gutters;
        if (gutters.indexOf("nbtutor-linemarkers") < 0){
            gutters.push("nbtutor-linemarkers");
        }
    }

    setMarkers(curLines, nextLine){
        // First clear current gutter markers
        this.codemirror.clearGutter("nbtutor-linemarkers");

        console.log(curLines, nextLine);

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

    destroy(){
        this.codemirror.clearGutter("nbtutor-linemarkers");
    }
}
