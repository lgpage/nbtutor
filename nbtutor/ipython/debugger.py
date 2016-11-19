# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import sys
from contextlib import contextmanager

from io import StringIO
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


@contextmanager
def redirect_stdout(new_stdout):
    old_stdout, sys.stdout = sys.stdout, new_stdout
    try:
        yield None
    finally:
        sys.stdout = old_stdout


class Bdb(StdBdb):

    def __init__(self, ipy_shell, options):
        super(Bdb, self).__init__()
        self.ipy_shell = ipy_shell
        self.options = options
        self.trace_history = TraceHistory()
        self.stdout = StringIO()
        self.tracestep = 0

    def run_cell(self, cell):
        globals = self.ipy_shell.user_global_ns
        locals = self.ipy_shell.user_ns
        try:
            with redirect_stdout(self.stdout):
                self.run(cell, globals, locals)
        except SystemExit:
            raise BdbQuit
        finally:
            self.finalize()

    def user_call(self, frame, argument_list):
        """This method is called when there is the remote possibility that we
        ever need to stop in this function."""
        self.get_stack_data(frame, None, 'call')

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

            # Skip the self.run calling frame
            if frame_ind <= 0:
                continue

            user_locals = filter_dict(
                frame.f_locals,
                ignore_vars + list(self.ipy_shell.user_ns_hidden.keys())
            )

            # Add 1 because cell magics is actually line 1
            lineno += 1

            stack_data.add(frame, frame_ind-1, lineno, event_type, user_locals)
            heap_data.add(user_locals, **self.options)

        self.trace_history.append_stackframes(stack_data)
        self.trace_history.append_heap(heap_data)
        self.trace_history.append_output(self.stdout.getvalue())
        self.tracestep += 1

    def finalize(self):
        self.trace_history.sort_frame_locals()

