# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from bdb import Bdb as StdBdb
from bdb import BdbQuit
from io import StringIO

from .history import Heap, StackFrames, TraceHistory
from .utils import filter_dict, ignore_vars, redirect_stdout


class Bdb(StdBdb, object):
    """
    Args:
        ipy_shell: IPython interactive shell
        options: Cell magic options

    Attributes:
        ipy_shell: IPython interactive shell
        options: Cell magic options
        code_error (bool): True if the Cell code executed successfully, else False
        stdout (io.StringIO): The stdout used instead on the IPython stdout
        trace_history (:class:`~.history.TraceHistory`): The
            line-by-line trace history data
    """

    def __init__(self, ipy_shell, options):
        super(Bdb, self).__init__()
        self.ipy_shell = ipy_shell
        self.options = options
        self.code_error = False
        self.stdout = StringIO()
        self.trace_history = TraceHistory(options)

    def run_cell(self, cell):
        """Run the Cell code using the IPython globals and locals

        Args:
            cell (str): Python code to be executed
        """
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
        """Return True if the current frame belongs to the notebook, else
        False"""
        return "__ipy_scope__" in frame.f_globals.keys()

    def is_other_cell_frame(self, frame):
        """Return True if the current frame belongs to the Cell, else
        False"""
        return frame.f_code.co_filename.startswith("<ipython-input-")

    def get_stack_data(self, frame, traceback, event_type):
        """Get the stack frames data at each of the hooks above (Ie. for each
        line of the Python code)"""
        heap_data = Heap(self.options)
        stack_data = StackFrames(self.options)
        stack_frames, cur_frame_ind = self.get_stack(frame, traceback)

        for frame_ind, (frame, lineno) in enumerate(stack_frames):
            skip_this_stack = False

            # Skip the self.run calling frame (first frame)
            if frame_ind == 0:
                continue

            # Skip stack after a certain stack frame depth
            if len(stack_data) > self.options.depth:
                skip_this_stack = True
                break

            # Skip stack when frames dont belong to the current notebook or
            # current cell, I.e. frames in another global scope altogether
            # or frames in other cells
            if (not self.is_notebook_frame(frame) or
                    self.is_other_cell_frame(frame)):
                if not self.options.step_all:
                    skip_this_stack = True
                    break
                lineno = 0  # So line markers dont display for these frames
            else:
                lineno += 1  # Because cell magic is actually line 1

            # Filter out ignored names from the frame locals
            user_locals = filter_dict(
                frame.f_locals,
                ignore_vars + list(self.ipy_shell.user_ns_hidden.keys())
            )

            # Add frame and heap data
            stack_data.add(frame, lineno, event_type, user_locals)
            heap_data.add(user_locals)

        if not skip_this_stack and not stack_data.is_empty():
            self.trace_history.append(
                    stack_data,
                    heap_data,
                    self.stdout.getvalue()
            )

    def finalize(self):
        """Finalize the trace history data after execution is complete"""
        self.trace_history.sort_frame_locals()
