from typing import List

from .types import EventType
from .unique_identifier import UniqueIdentifier
from .variable import Variable


class StackFrame(UniqueIdentifier):
    def __init__(self, id: str, name: str, event: EventType) -> None:
        super().__init__(id)
        self.name = name
        self.event = event
        self.variables: List[Variable] = list()
