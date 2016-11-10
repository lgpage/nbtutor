/* global requirejs define */
define([
    "jquery",
    "require",
    "base/js/events",
    "base/js/namespace",
    "notebook/js/celltoolbar",

], function($, require, events, Jupyter, celltoolbar){
    "use strict";

    var initStylesheet = function(){
        var modulePath = requirejs.toUrl("nbtutor-notebook")
            .split("?")[0].split("/")
            .slice(0, -2).join("/");
        var head = $("head");
        var id = "nbtutor-css";
        var stylesheet = modulePath + "/css/nbtutor.min.css";
        if (head.find("link#" + id).length === 0){
            var link = $("<link/>", {
                id: id,
                type: "text/css",
                rel: "stylesheet",
                href: stylesheet,
            });
            head.append(link);
        }
    };

    var initVisualizedCell = function(div, cell, celltoolbar){
        if (cell.cell_type != "code"){
            // Not a CodeCell so nothing to do
            return ;
        }

        requirejs(["nbtutor-deps"], function(deps){
            requirejs(["nbtutor-notebook"], function(nb){
                cell.nbtutor = new nb.VisualizedCell(cell);
            });
        });
    };

    // XXX Find a better way of doing this
    var processCellOutput = function(cell){
        var maxTry = 5;
        var wait = window.setTimeout(function(){
            // Wait for cell output.
            // Kernel extension should return only 1 output
            if (cell.output_area.outputs.length > 0){
                window.clearTimeout(wait);
                cell.nbtutor.updateData(cell);
            }
            maxTry -= 1;
            if (maxTry === 0){
                // Give up after max tries reached, probably running a normal
                // CodeCell with no outputs or long execution time or both.
                window.clearTimeout(wait);
            }
        }, 300);
    };

    var initEvents = function(){
        var CellToolbar = celltoolbar.CellToolbar;

        // Trigger event when toolbar is (globally) hidden
        CellToolbar._global_hide = CellToolbar.global_hide;
        CellToolbar.global_hide = function(){
            events.trigger('global_hide.CellToolBar');
            this._global_hide();
        };

        // Trigger event on toolbar rebuild
        CellToolbar.prototype._rebuild = CellToolbar.prototype.rebuild;
        CellToolbar.prototype.rebuild = function(){
            events.trigger('rebuild.CellToolBar', this.cell);
            this._rebuild();
        };

        CellToolbar.register_callback(
            "nbtutor.visualize_type",
            initVisualizedCell
        );

        CellToolbar.register_preset(
            "Visualize",
            ["nbtutor.visualize_type"],
            Jupyter.notebook
        );

        // XXX Find a better way of doing this
        events.on('execute.CodeCell', function(event, data){
            processCellOutput(data.cell);
        });

        requirejs(["nbtutor-deps"], function(deps){
            $(window).resize(function(){
                deps.jsplumb.repaintEverything();
            });
        });
    };

    var loadNbtutor = function(){
        requirejs.config({
            paths: {
                "nbtutor-deps": require.toUrl("./nbtutor.deps.min.js"),
                "nbtutor-notebook": require.toUrl("./nbtutor.notebook.min.js"),
            }
        });

        initStylesheet();
        initEvents();
    };

    return {
        load_ipython_extension: loadNbtutor,
    };
});
