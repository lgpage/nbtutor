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

        // XXX This feels a bit hacky
        events.on('kernel_ready.Kernel', function(){
            var comm_manager = Jupyter.notebook.kernel.comm_manager;
            comm_manager.register_target('nbtutor_comm', function(comm, msg){
                comm.on_msg(function(msg){
                    var msg_id = msg.parent_header.msg_id;
                    var cell = Jupyter.notebook.get_msg_cell(msg_id);
                    if (!cell.nbtutor){
                        CellToolbar.global_show();
                        CellToolbar.activate_preset("Visualize");
                        Jupyter.notebook.metadata.celltoolbar = "Visualize";
                    }
                    // Wait a little bit for the toolbar to load
                    setTimeout(function(){
                        cell.nbtutor.updateData(msg.content.data);
                        console.log("Updated data");
                    }, 500);
                });
            });
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
