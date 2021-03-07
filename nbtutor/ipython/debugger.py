from bdb import Bdb as StdDebugger
from bdb import BdbQuit
from io import StringIO
from types import FrameType
from typing import Any, Dict, Iterable, List, Optional, Tuple, Type

from .constants.ignore import ignore_vars
from .factories.heap_object_factory import reduce_heap_objects
from .factories.stack_frame_factory import create_stack_frame
from .factories.trace_step_factory import create_trace_step
from .helpers.dictionary import filter_dict
from .helpers.output import redirect_stdout
from .models.heap_object import HeapObject
from .models.stack_frame import StackFrame
from .models.trace_step import TraceStep
from .models.types import EventType
from .models.options import Options

_ExcInfo = Tuple[Type[BaseException], BaseException, FrameType]


class Debugger(StdDebugger):
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

    STEP_LIMIT = 100

    def __init__(self, ipy_shell, cell: str, options: Options, skip: Optional[Iterable[str]] = None) -> None:
        super().__init__(skip if skip else list())

        self.step = 0
        self.cell = cell
        self.ipy_shell = ipy_shell
        self.options = options

        self.code_error = False
        self.stdout = StringIO()

        self.vars_to_ignore = list(self.ipy_shell.user_ns_hidden.keys()) + list(ignore_vars)
        self.trace_history: List[TraceStep] = list()

    def __is_notebook_frame(self, frame: FrameType) -> bool:
        """Return True if the current frame belongs to the notebook, else
        False"""
        return "__ipy_scope__" in frame.f_globals.keys()

    def __is_other_cell_frame(self, frame: FrameType) -> bool:
        """Return True if the current frame belongs to the Cell, else
        False"""
        return frame.f_code.co_filename.startswith("<ipython-input-")

    def __generate_trace_step(self, current_py_frame: FrameType, event_type: EventType) -> None:
        """Get the stack frames data at each of the hooks above (Ie. for each
        line of the Python code)"""
        depth = 0
        skip_stack = False

        py_frames, _ = self.get_stack(current_py_frame, None)
        heap_objects: Dict[str, HeapObject] = dict()
        stack_frames: List[StackFrame] = list()
        line_numbers: List[int] = list()

        for frame_ind, (py_frame, _) in enumerate(py_frames):
            # Skip the self.run calling frame (first frame)
            if frame_ind == 0:
                continue

            # Skip stack when frames don't belong to the current notebook or current cell
            # I.e. the frames are another global scope altogether or the frames are in another cell
            is_current_cell = (self.__is_notebook_frame(py_frame) and not self.__is_other_cell_frame(py_frame))
            if not is_current_cell and not self.options.step_all:
                skip_stack = True
                break

            depth += 1

            # Skip stack after a certain stack frame depth or max step limit reached
            if depth > self.options.depth or self.step >= self.STEP_LIMIT:
                skip_stack = True
                break

            # Filter out ignored names from the frame locals
            user_locals = filter_dict(py_frame.f_locals, self.vars_to_ignore)

            # Add frame and heap data
            reduce_heap_objects(user_locals.values(), heap_objects, self.options)
            stack_frame = create_stack_frame(py_frame, event_type, user_locals)

            if self.options.debug:
                print(frame_ind, py_frame.f_code.co_name, current_py_frame.f_lineno, py_frame.f_lineno, event_type)
                print(user_locals)

            self.step += 1
            if not stack_frame:
                continue

            stack_frames.append(stack_frame)
            if is_current_cell:
                line_numbers.append(py_frame.f_lineno)

        if not skip_stack and stack_frames:
            stdout = self.stdout.getvalue()
            trace_step = create_trace_step(stack_frames, heap_objects, line_numbers, stdout)
            self.trace_history.append(trace_step)

    def user_call(self, frame: FrameType, argument_list: Any) -> None:
        """This method is called when there is the remote possibility that we
        ever need to stop in this function."""
        self.__generate_trace_step(frame, 'call')

    def user_line(self, frame: FrameType) -> None:
        """This function is called when we stop or break at this line."""
        self.__generate_trace_step(frame, 'line')

    def user_return(self, frame: FrameType, return_value: Any) -> None:
        """This function is called when a return trap is set here."""
        self.__generate_trace_step(frame, 'return')

    def user_exception(self, frame: FrameType, exc_info: _ExcInfo) -> None:
        """This function is called if an exception occurs,
        but only if we are to stop at or just below this level."""
        pass

    def run_cell(self) -> None:
        """Run the Cell code using the IPython globals and locals

        Args:
            cell (str): Python code to be executed
        """
        locals = self.ipy_shell.user_ns
        globals = self.ipy_shell.user_global_ns
        globals.update({"__ipy_scope__": None})

        try:
            with redirect_stdout(self.stdout):
                self.run(self.cell, globals, locals)

        except Exception:
            self.code_error = True

            if self.options.debug:
                raise BdbQuit

            print("Visualization failed. Re-run with the --debug flag for more information.")
