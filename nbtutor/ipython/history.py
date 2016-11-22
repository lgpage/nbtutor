# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import json

from ipykernel import jsonutil


def format(type_name, value, **kwargs):
    formatter = {
        'float': lambda x: '{:.{}g}'.format(x, kwargs.get('digits', 6)),
    }
    if type_name not in formatter.keys():
        return '{}'.format(value)
    return formatter[type_name](value)


class StackFrames(object):

    def __init__(self):
        self.data = list()

    def clear(self):
        self.__init__()

    def add_frame(self, frame, lineno, event):
        name = frame.f_code.co_name
        self.data.append(dict({
            "id": id(frame),
            "name": "Global" if name == "<module>" else name,
            "lineno": lineno,
            "event": event,
            "vars": list(),
        }))

    def add_frame_locals(self, frame_ind, filtered_locals):
        frame_data = self.data[frame_ind]
        for name, obj in filtered_locals.items():
            frame_data["vars"].append(dict({
                "name": name,
                "id": id(obj),
            }))

    def add(self, frame, frame_ind, lineno, event, filtered_locals):
        self.add_frame(frame, lineno, event)
        self.add_frame_locals(frame_ind, filtered_locals)

    def json_dumps(self):
        return json.dumps(self.data)

    def json_clean(self):
        return jsonutil.json_clean(self.data)

    def __iter__(self):
        return iter(self.data)


class Heap(object):

    def __init__(self):
        self.seq_types = (list, tuple, dict)
        self.data = list()

    def clear(self):
        self.__init__()

    @property
    def object_ids(self):
        ret = list()
        for obj in self.data:
            ret.append(obj['id'])
        return ret

    def has_object(self, obj_id):
        return obj_id in self.object_ids

    def _add_object(self, obj, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return
        type_name = type(obj).__name__
        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "inplace": kwargs.get("inline", False),
            "value": format(type_name, obj, **kwargs),
        }))

    def _add_seq(self, obj, **kwargs):
        obj_id = id(obj)
        if self.has_object(obj_id):
            return

        keys = None
        values = obj
        if isinstance(obj, (dict, )):
            keys = sorted(obj.keys())
            values = [obj[k] for k in keys]

        data_values = []
        type_name = type(obj).__name__
        for i, val in enumerate(values):
            if isinstance(val, self.seq_types):
                self._add_seq(val, **kwargs)
            else:
                self._add_object(val, **kwargs)

            data_values.append(dict({
                "id": id(val),
                "key": None if not keys else keys[i],
                "inplace": kwargs.get("inline", False),
                "value": None,
            }))

        self.data.append(dict({
            "id": obj_id,
            "type": type_name,
            "value": data_values,
        }))

    def add(self, filtered_locals, **kwargs):
        for _, obj in filtered_locals.items():
            if isinstance(obj, self.seq_types):
                self._add_seq(obj, **kwargs)
            else:
                self._add_object(obj, **kwargs)

    def json_dumps(self):
        return json.dumps(self.data)

    def json_clean(self):
        return jsonutil.json_clean(self.data)

    def __iter__(self):
        return iter(self.data)


class TraceHistory(object):

    def __init__(self):
        self.stack_history = list()
        self.heap_history = list()
        self.output_history = list()

    def clear(self):
        self.__init__()

    def append_stackframes(self, stackframes):
        self.stack_history.append(stackframes)

    def append_heap(self, heap):
        self.heap_history.append(heap)

    def append_output(self, output):
        self.output_history.append(output)

    def sort_frame_locals(self):
        ids_sort_order = list()
        for heap in self.heap_history:
            for obj in heap:
                if obj['id'] not in ids_sort_order:
                    ids_sort_order.append(obj['id'])

        def id_sort_key(x):
            return ids_sort_order.index(x['id'])

        for stackframes in self.stack_history:
            for frame in stackframes:
                frame['vars'].sort(key=id_sort_key)

        for heap in self.heap_history:
            heap.data.sort(key=id_sort_key)

    def json_dumps(self):
        return json.dumps({
            "stack_history": [x.data for x in self.stack_history],
            "heap_history": [x.data for x in self.heap_history],
            "output_history": self.output_history,
        })

    def json_clean(self):
        return jsonutil.json_clean({
            "stack_history": [x.data for x in self.stack_history],
            "heap_history": [x.data for x in self.heap_history],
            "output_history": self.output_history,
        })

