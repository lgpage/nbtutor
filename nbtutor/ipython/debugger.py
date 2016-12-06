# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from io import StringIO
from bdb import BdbQuit
from bdb import Bdb as StdBdb

from .history import Heap, StackFrames, TraceHistory
from .utils import ignore_vars, filter_dict
from .utils import redirect_stdout


class Bdb(StdBdb):

    def __init__(self, ipy_shell, options):
        super(Bdb, self).__init__()
        self.ipy_shell = ipy_shell
        self.options = options
        self.code_error = False
        self.stdout = StringIO()
        self.trace_history = TraceHistory(options)

    def run_cell(self, cell):
        globals = self.ipy_shell.user_global_ns
        locals = self.ipy_shell.user_ns
        globals.update({
            "__ipy_scope__": None,
        })
        try:
            with redirect_stdout(self.stdout):
                self.run(cell, globals, locals)
        except:
            self.code_error = True
            if self.options.debug:
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

    def is_notebook_frame(self, frame):
        return "__ipy_scope__" in frame.f_globals.keys()

    def is_other_cell_frame(self, frame):
        return frame.f_code.co_filename.startswith("<ipython-input-")
    def get_stack_data(self, frame, traceback, event_type):
        heap_data = Heap(self.options)
        stack_data = StackFrames(self.options)
        stack_frames, cur_frame_ind = self.get_stack(frame, traceback)

        skip_this_frame = True
        for frame, lineno in stack_frames:
            # Skip the self.run calling frame (first frame)
            if skip_this_frame:
                skip_this_frame = False
                continue

            # Skip frames after a certain depth
            skip_this_stack = False
            if len(stack_data) > self.options.depth:
                skip_this_stack = True
                break

            user_locals = filter_dict(
                frame.f_locals,
                ignore_vars + list(self.ipy_shell.user_ns_hidden.keys())
            )

            lineno += 1  # Add 1 because cell magics is actually line 1
            # FIXME: This is wrong for any/all frame code objects not created
            # with cell magic.
            # FIXME: Linenos from any/all frame code objects not created in
            # Jupyter (the IPython shell) should be ignored (set to 0).
            stack_data.add(frame, lineno, event_type, user_locals)
            heap_data.add(user_locals)

        if not skip_this_stack and not stack_data.is_empty():
            self.trace_history.append(
                    stack_data,
                    heap_data,
                    self.stdout.getvalue()
            )

    def finalize(self):
        self.trace_history.sort_frame_locals()
