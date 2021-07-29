from ..models.heap_object import HeapObject
from .base_heap_object_factory import HeapObjectFactory


class BasicHeapObjectFactory(HeapObjectFactory):
    def get_value(self) -> str:
        return str(self._object)

    def create(self) -> HeapObject:
        heap_obj = HeapObject(self.get_id(), self.get_type(), self.get_value(), 'basic')
        heap_obj.immutable = True
        return heap_obj
