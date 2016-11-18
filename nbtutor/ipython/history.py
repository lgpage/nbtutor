# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import json


class StackFrames(object):

    def __init__(self):
        self.data = list()

    def clear(self):
        self.__init__()

    def append_frame(self, frame, lineno):
        name = frame.f_code.co_name
        self.data.append(dict({
            "id": id(frame),
            "name": name,
            "lineno": lineno,
            "vars": list(),
        }))

    def append_frame_locals(self, frame_ind, filtered_locals):
        frame_data = self.data[frame_ind]
        for name, obj in filtered_locals.items():
            frame_data["vars"].append(dict({
                "name": name,
                "id": id(obj),
            }))

    def json_dumps(self):
        return json.dumps(self.data)


class Heap(object):

    def __init__(self):
        self.data = list()

    def clear(self):
        self.__init__()

    @property
    def object_ids(self):
        ret = list()
        for obj in self.data:
            ret.append(obj['id'])
        return ret

    def append_locals(self, filtered_locals):
        for name, obj in filtered_locals.items():
            if id(obj) not in self.object_ids:
                self.data.append(dict({
                    "id": id(obj),
                    "type": type(obj).__name__,
                    "value": str(obj),
                }))

    def json_dumps(self):
        return json.dumps(self.data)


class TraceHistory(object):

    def __init__(self):
        self.stack_history = list()
        self.heap_history = list()
        self.outputs = list()

    def clear(self):
        self.__init__()

    def append_stackframes(self, stackframes):
        self.stack_history.append(stackframes)

    def append_heap(self, heap):
        self.heap_history.append(heap)

    def append_output(self, output):
        self.outputs.append(output)

    def json_dumps(self):
        return json.dumps({
            "stack_history": [x.data for x in self.stack_history],
            "heap_history": [x.data for x in self.heap_history],
            "outputs": self.outputs,
        })
