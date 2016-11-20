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

    var initEvents = function(){
        var CellToolbar = celltoolbar.CellToolbar;

        // Trigger event on toolbar rebuild
        CellToolbar.prototype._rebuild = CellToolbar.prototype.rebuild;
        CellToolbar.prototype.rebuild = function(){
            if (this.cell.nbtutor) {
                this.cell.nbtutor.destroy();
            }
            this._rebuild();
        };

        // Trigger event when toolbar is (globally) hidden
        CellToolbar._global_hide = CellToolbar.global_hide;
        CellToolbar.global_hide = function(){
            events.trigger('global_hide.CellToolBar');
            this._global_hide();
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

        // XXX This feels like such a hack, I'm pretty sure I don't understand
        // comms properly. I am also pretty sure this can fall over due to
        // async updates.
        var cellToUpdate = null;
        events.on('kernel_ready.Kernel', function(){
            var comm_manager = Jupyter.notebook.kernel.comm_manager;
            comm_manager.register_target('nbtutor_comm', function(comm, msg){
                comm.on_msg(function(msg){
                    var nbtutor_data = JSON.parse(msg.content.data);
                    if (!cellToUpdate){
                        throw Error("Comm update fell over.")
                    }
                    cellToUpdate.nbtutor.updateData(nbtutor_data);
                });
            });
        });

        events.on('execute.CodeCell', function(event, data){
            cellToUpdate = data.cell;
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
