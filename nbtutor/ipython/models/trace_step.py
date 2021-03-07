from typing import Dict, Optional, List

from .heap_object import HeapObject
from .serializable import Serializable
from .stack import Stack


class TraceStep(Serializable):
    def __init__(self, stack: Stack, heap: Dict[str, HeapObject]) -> None:
        self.stack = stack
        self.heap = heap

        self.line_numbers: List[int] = list()

        self.stdout: Optional[str] = None
        self.stderr: Optional[str] = None
