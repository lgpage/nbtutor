# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import json

from ipykernel import jsonutil

from .utils import ignore_vars, filter_dict
from .utils import primitive_types, sequence_types, key_value_types
from .utils import format, get_type_info


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

    def _add_object(self, obj, type_info, position='right', **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return

        type_catagory, type_name = type_info
        if type_catagory == 'primitive':
            position = 'right' if not self.options.nolies else position

        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "catagory": type_catagory,
            "options": {
                "position": position,
            },
            "value": format(obj, self.options),
        }))

    def _add_sequence_object(self, obj, type_info, position='center', **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return

        data_values = []
        for val in obj:
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
                "position": position,
            },
            "values": data_values,
        }))

    def _add_class_object(self, obj, type_info, position='center', **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return

        type_info = ('key-value', type_info[-1])
        class_vars = filter_dict(obj.__dict__, ignore_vars)
        self._add_key_value_object(class_vars, type_info)
        self.data[-1]["id"] = obj_id

    def _add_key_value_object(self, obj, type_info, position='center', **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return

        obj_keys = obj.keys()
        try:
            obj_keys = sorted(obj_keys, key=lambda x: str(x))
        except:
            pass

        data_values = []
        for key in obj_keys:
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
                "position": position,
            },
            "values": data_values,
        }))

    def _add(self, obj, **kwargs):
        type_info = get_type_info(obj)
        if type_info[0] == 'key-value':
            self._add_key_value_object(obj, type_info, **kwargs)
        elif type_info[0] == 'sequence':
            self._add_sequence_object(obj, type_info, **kwargs)
        elif type_info[0] == 'class' or type_info[0].endswith('instance'):
            if not hasattr(obj, '__dict__'):
                # Not all classes or class instances have a __dict__ attribute
                type_info = ('unknown', type_info[-1])
                self._add_object(obj, type_info, **kwargs)
            else:
                self._add_class_object(obj, type_info, **kwargs)
        else:
            self._add_object(obj, type_info, **kwargs)

    def add(self, filtered_locals):
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
