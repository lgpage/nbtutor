from types import FrameType
from typing import Any, Dict, List

from ..helpers.object import get_str_id
from ..models.stack import Stack
from ..models.stack_frame import StackFrame
from ..models.types import EventType
from ..models.variable import Variable


def create_stack_frame(frame: FrameType, event_type: EventType, user_locals: Dict[str, Any]) -> StackFrame:
    name = frame.f_code.co_name
    name = "Global frame" if name == "<module>" else name
    stack_frame = StackFrame(get_str_id(frame), name, event_type)

    for name, obj in user_locals.items():
        var = Variable(get_str_id(obj), name)
        stack_frame.variables.append(var)

    return stack_frame


def create_stack(frames: List[StackFrame]) -> Stack:
    return Stack(frames)
