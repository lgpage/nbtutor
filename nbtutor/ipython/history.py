# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import json

from ipykernel import jsonutil

from .utils import filter_dict, format, get_type_info, ignore_vars


class StackFrames(object):

    def __init__(self, options):
        self.options = options
        self.data = list()

    def clear(self):
        self.__init__(self.options)

    def _add_frame(self, frame, lineno, event):
        name = frame.f_code.co_name
        name = "Global frame" if name == "<module>" else name
        self.data.append(dict({
            "id": id(frame),
            "name": name,
            "lineno": lineno,
            "event": event,
            "options": {
                "inline": self.options.inline,
            },
            "vars": list(),
        }))

    def _add_frame_locals(self, filtered_locals):
        frame_data = self.data[-1]
        for name, obj in filtered_locals.items():
            frame_data["vars"].append(dict({
                "id": id(obj),
                "name": name,
            }))

    def add(self, frame, lineno, event, filtered_locals):
        self._add_frame(frame, lineno, event)
        self._add_frame_locals(filtered_locals)

    def is_empty(self):
        return len(self) == 0

    def dumps(self):
        return json.dumps(self.data)

    def clean(self):
        return jsonutil.json_clean(self.data)

    def __iter__(self):
        return iter(self.data)

    def __len__(self):
        return len(self.data)


class Heap(object):

    def __init__(self, options):
        self.options = options
        self.data = list()
        self._new_ids = list()
        self._tmp_refs = dict()

    def clear(self):
        self.__init__(self.options)

    @property
    def object_ids(self):
        ret = list()
        for obj in self.data:
            ret.append(obj['id'])
        return ret

    def has_object(self, obj_id):
        return obj_id in self.object_ids

    def _add_object(self, obj, type_info, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        type_catagory, type_name = type_info
        position = kwargs.get('position', 'right')
        if type_catagory == 'primitive':
            position = 'right' if not self.options.nolies else position

        self._new_ids.append(obj_id)
        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "catagory": type_catagory,
            "options": {
                "position": position,
            },
            "value": format(obj, self.options),
        }))

    def _add_array_data_object(self, obj, type_info, **kwargs):
        type_catagory, type_name = type_info
        if type_name != 'ndarray':
            self._add_object(obj, type_info, **kwargs)
            return  # XXX: Only numpy ndarrays supported for now

        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        max_reached = False
        data_values = list()
        self._new_ids.append(obj_id)
        for ind, val in enumerate(obj.flatten()):
            if ind >= self.options.max_size:
                max_reached = True
                break
            data_values.append(format(val, self.options))

        self.data.append(dict({
            "id": obj_id,
            "type": '{} array ({} x {} bytes)'.format(
                obj.dtype,
                obj.size,
                obj.itemsize
            ),
            "catagory": type_catagory,
            "options": {
                "position": kwargs.get('position', 'right'),
                "ellipsis": max_reached,
            },
            "values": data_values,
        }))

    def _add_array_object(self, obj, type_info, **kwargs):
        type_catagory, type_name = type_info
        if type_name != 'ndarray':
            self._add_object(obj, type_info, **kwargs)
            return  # XXX: Only numpy ndarrays supported for now

        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        # Simply point to flat (inline) array data
        if not self.options.expand_arrays and obj.ndim == 1:
            self._add_array_data_object(obj, type_info, **kwargs)
            self.data[-1]['type'] = '{} ({})'.format(type_name, obj.dtype)
            return

        # Get the ndarray instance data
        shape = obj.shape  # actually a class property
        strides = obj.strides  # actually a class property

        # store ref so objects are not garbage collected until the end of
        # execution, so that the id cannot, on the off chance, be re-used
        self._tmp_refs.update({(obj_id, 'shape'): shape})
        self._tmp_refs.update({(obj_id, 'strides'): strides})

        # Get underlying data object
        base_obj = obj
        while base_obj.base is not None:
            base_obj = base_obj.base

        # Array pointer offset (bytes)
        offset = (
            obj.__array_interface__['data'][0] -
            base_obj.__array_interface__['data'][0]
        )

        # If obj.base is None
        if base_obj is obj:
            base_obj = base_obj.copy()  # To get a unique id
            self._tmp_refs.update({(obj_id, 'base'): base_obj})

        # If base_obj.base is None
        if (id(base_obj), 'base') in self._tmp_refs.keys():
            base_obj = self._tmp_refs[(id(base_obj), 'base')]

        # Add the ndarray instance data
        self._add_array_data_object(base_obj, type_info, **kwargs)
        self._new_ids.append(obj_id)
        self._add(shape)
        self._add(strides)

        class_vars = dict({
            'data': base_obj,
            'shape': shape,
            'strides': strides,
        })

        type_name = '{} ({} bytes offset)'.format(type_name, offset)
        type_info = ('key-value', type_name)
        self._add_key_value_object(class_vars, type_info, **kwargs)
        self.data[-1]["id"] = obj_id
        self._new_ids.remove(id(class_vars))

    def _add_sequence_object(self, obj, type_info, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        data_values = list()
        max_reached = False
        self._new_ids.append(obj_id)
        for ind, val in enumerate(obj):
            if ind >= self.options.max_size:
                max_reached = True
                break
            self._add(val)
            data_values.append(dict({
                "id": id(val),
            }))

        type_catagory, type_name = type_info
        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "catagory": type_catagory,
            "options": {
                "inline": self.options.inline,
                "position": kwargs.get('position', 'center'),
                "ellipsis": max_reached,
            },
            "values": data_values,
        }))

    def _add_class_object(self, obj, type_info, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        self._new_ids.append(obj_id)
        type_info = ('key-value', type_info[-1])
        class_vars = filter_dict(obj.__dict__, ignore_vars)
        self._add_key_value_object(class_vars, type_info, **kwargs)
        self.data[-1]["id"] = obj_id
        self._new_ids.remove(id(class_vars))

    def _add_key_value_object(self, obj, type_info, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id) or obj_id in self._new_ids:
            return

        obj_keys = obj.keys()
        try:
            obj_keys = sorted(obj_keys, key=lambda x: str(x))
        except:
            pass

        data_values = list()
        max_reached = False
        self._new_ids.append(obj_id)
        for ind, key in enumerate(obj_keys):
            if ind >= self.options.max_size:
                max_reached = True
                break
            value = obj[key]
            self._add(key, position='left')
            self._add(value)
            data_values.append(dict({
                "key_id": id(key),
                "val_id": id(value),
            }))

        type_catagory, type_name = type_info
        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "catagory": type_catagory,
            "options": {
                "inline_keys": not self.options.nolies,
                "inline_vals": self.options.inline,
                "position": kwargs.get('position', 'center'),
                "ellipsis": max_reached,
            },
            "values": data_values,
        }))

    def _add(self, obj, **kwargs):
        type_info = get_type_info(obj)
        if type_info[0] == 'key-value':
            self._add_key_value_object(obj, type_info, **kwargs)
        elif type_info[0] == 'sequence':
            self._add_sequence_object(obj, type_info, **kwargs)
        elif type_info[0] == 'array':
            self._add_array_object(obj, type_info, **kwargs)
        elif type_info[0] == 'class' or type_info[0].endswith('instance'):
            self._add_class_object(obj, type_info, **kwargs)
        else:
            self._add_object(obj, type_info, **kwargs)

    def add(self, filtered_locals):
        self._new_ids = list()
        for obj in filtered_locals.values():
            self._add(obj)

    def is_empty(self):
        return len(self) == 0

    def dumps(self):
        return json.dumps(self.data)

    def clean(self):
        return jsonutil.json_clean(self.data)

    def __iter__(self):
        return iter(self.data)

    def __len__(self):
        return len(self.data)


class TraceHistory(object):

    def __init__(self, options):
        self.options = options
        self.stack_history = list()
        self.heap_history = list()
        self.output_history = list()

    def clear(self):
        self.__init__(self.options)

    def append(self, stack_frames, heap_objects, output):
        self.stack_history.append(stack_frames)
        self.heap_history.append(heap_objects)
        self.output_history.append(output)

    def sort_frame_locals(self):
        # Collect all unique object id's
        ids_sort_order = list()
        for heap in self.heap_history:
            for obj in heap:
                if obj['id'] not in ids_sort_order:
                    ids_sort_order.append(obj['id'])

        def id_sort_key(x):
            # Sort according to the order of object creation in the heap
            return ids_sort_order.index(x['id'])

        for stackframes in self.stack_history:
            for frame in stackframes:
                frame['vars'].sort(key=id_sort_key)

        for heap in self.heap_history:
            heap.data.sort(key=id_sort_key)

    def is_empty(self):
        return len(self) == 0

    def _to_dict(self):
        return dict({
            "stack_history": [x.data for x in self.stack_history],
            "heap_history": [x.data for x in self.heap_history],
            "output_history": self.output_history,
        })

    def dumps(self):
        return json.dumps(self._to_dict())

    def clean(self):
        return jsonutil.json_clean(self._to_dict())

    def __len__(self):
        return len(self.stack_history)
