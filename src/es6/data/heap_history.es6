
import {uuid} from "nbtutor-deps";


export class HeapHistory{
    constructor(data){
        this.data = data || [];
        this._setUUids();
    }

    _setUUids(){
        /**
         * Heap object ids may be unique for a given code cell, but may not be
         * unique for the entire notebook so we need to create unique ids.
         * Unique ids are needed for jsPlumb connectors.
         */
        let that = this;
        let object_ids = [];

        // Collect all unique heap object ids
        this.data.map((heap_objects) => {
            heap_objects.map((object) => {
                if (object_ids.indexOf(object.id) < 0){
                    object_ids.push(object.id);
                }
            });
        });

        // Set heap object uuids
        object_ids.map((id) => {
            // Make id identifier start with a letter, else d3 falls over
            let new_uuid = "h-" + uuid.v4();
            that.data.map((heap_objects) => {
                heap_objects.map((object) => {
                    if (object.id === id) {
                        object.uuid = new_uuid;
                    }
                });
            });
        });
    }

    getHeapObjects(tracestep){
        /*
         * Get the heap objects at a specified trace step in the history
         */
        return this.data[tracestep];
    }

    getObjectById(tracestep, id){
        /*
         * Get a single heap object at a specified trace step in the history
         * that matches a specified object id.
         */
        let objects = this.getHeapObjects(tracestep) || [];
        let ind = objects.map((d) => d.id).indexOf(id);
        return objects[ind];
    }
}
