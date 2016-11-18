# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from bdb import BdbQuit
from bdb import Bdb as StdBdb

from .history import Heap, StackFrames, TraceHistory


ignore_vars = [
    "__name__",
    "__builtin__",
    "__builtins__",
]


def filter_dict(d, exclude):
    ret = {}
    for key, value in d.items():
        if key not in exclude:
            ret.update({key: value})
    return ret


class Bdb(StdBdb):

    def __init__(self, ipy_shell):
        super(Bdb, self).__init__()
        self.ipy_shell = ipy_shell
        self.trace_history = TraceHistory()
        self.tracestep = 0

    def run_cell(self, cell, globals=None, locals=None):
        globals = globals or self.ipy_shell.user_global_ns
        locals = locals or self.ipy_shell.user_ns
        try:
            self.run(cell, globals, locals)
        except SystemExit:
            raise BdbQuit
        finally:
            self.finalize()

    def user_call(self, frame, argument_list):
        """This method is called when there is the remote possibility that we
        ever need to stop in this function."""
        pass

    def user_line(self, frame):
        """This function is called when we stop or break at this line."""
        self.get_stack_data(frame, None, 'step_line')

    def user_return(self, frame, return_value):
        """This function is called when a return trap is set here."""
        self.get_stack_data(frame, None, 'return')

    def user_exception(self, frame, exc_info):
        """This function is called if an exception occurs,
        but only if we are to stop at or just below this level."""
        pass

    def get_stack_data(self, frame, traceback, event_type):
        stack_data = StackFrames()
        heap_data = Heap()

        stack_frames, cur_frame_ind = self.get_stack(frame, traceback)
        for frame_ind, (frame, lineno) in enumerate(stack_frames):

            if frame_ind <= 0:
                continue

            user_locals = filter_dict(
                frame.f_locals,
                ignore_vars + list(self.ipy_shell.user_ns_hidden.keys())
            )

            stack_data.add(frame, frame_ind-1, lineno, user_locals)
            heap_data.add(user_locals)

            self.trace_history.append_stackframes(stack_data)
            self.trace_history.append_heap(heap_data)

        self.tracestep += 1

    def finalize(self):
        self.trace_history.sort_frame_locals()

