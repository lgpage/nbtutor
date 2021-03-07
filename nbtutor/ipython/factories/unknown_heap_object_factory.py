from ..models.heap_object import HeapObject
from .base_heap_object_factory import HeapObjectFactory


class UnknownHeapObjectFactory(HeapObjectFactory):
    def get_value(self) -> str:
        return self.get_type()

    def create(self) -> HeapObject:
        return HeapObject(self.get_id(), self.get_type(), self.get_value(), 'basic')
