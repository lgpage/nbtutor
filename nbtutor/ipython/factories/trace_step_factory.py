from typing import Dict, List, Optional

from ..factories.stack_frame_factory import create_stack
from ..models.heap_object import HeapObject
from ..models.stack import StackFrame
from ..models.trace_step import TraceStep


def create_trace_step(
        stack_frames: List[StackFrame],
        heap: Dict[str, HeapObject],
        line_numbers: List[int],
        stdout: Optional[str] = None,
        stderr: Optional[str] = None) -> TraceStep:

    stack = create_stack(stack_frames)
    trace_step = TraceStep(stack, heap)
    trace_step.line_numbers = line_numbers
    trace_step.stdout = stdout
    trace_step.stderr = stderr

    return trace_step
