from typing import List

from ..models.serializable import Serializable
from .stack_frame import StackFrame


class Stack(Serializable):
    def __init__(self, frames: List[StackFrame]) -> None:
        self.frames = frames
