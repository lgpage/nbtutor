from typing import Any, Collection, Union

from ..models.heap_object import HeapObject
from ..models.unique_identifier import UniqueIdentifier
from .base_heap_object_factory import HeapObjectFactory


class InstanceHeapObjectFactory(HeapObjectFactory):
    def get_type(self) -> str:
        return '({0}) instance'.format(self.get_value())

    def get_value(self) -> str:
        return type(self._object).__name__

    def get_objects_to_reduce(self) -> Union[None, Collection[Any]]:
        return self._object.__dict__.values()

    def create(self) -> HeapObject:
        heap_obj = HeapObject(self.get_id(), self.get_type(), self.get_value(), 'kvp')

        heap_obj.immutable = False
        heap_obj.references = {k: UniqueIdentifier(HeapObjectFactory.get_object_id(v))
                               for k, v in self._object.__dict__.items()}

        return heap_obj
