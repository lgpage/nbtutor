from abc import ABC, abstractmethod
from typing import Any, Collection, Union

from ..helpers.object import get_str_id
from ..models.heap_object import HeapObject
from ..models.options import Options


class HeapObjectFactory(ABC):
    def __init__(self, obj: Any, options: Options = None) -> None:
        self._object = obj
        self.options = options

    @classmethod
    def get_object_id(cls, obj: Any) -> str:
        return get_str_id(obj)

    def get_id(self) -> str:
        return self.get_object_id(self._object)

    def get_type(self) -> str:
        return type(self._object).__name__

    def get_objects_to_reduce(self) -> Union[None, Collection[Any]]:
        return None

    @abstractmethod
    def get_value(self) -> str:
        pass

    @abstractmethod
    def create(self) -> HeapObject:
        pass
