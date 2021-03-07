from typing import Any, Collection, Dict, Union, Optional

from ..models.heap_object import HeapObject, RenderOptions
from ..models.options import Options
from ..models.unique_identifier import UniqueIdentifier
from .base_heap_object_factory import HeapObjectFactory


class KvpHeapObjectFactory(HeapObjectFactory):
    def __init__(self, obj: Dict, options: Options = None) -> None:
        super().__init__(obj, options)

        self._items = obj.items()
        self._object_id = self.get_object_id(obj)
        self._max_len = (self.options.max_size or len(self._items)) if self.options is not None else len(obj)

        self._render_options: Optional[RenderOptions] = None

        if (len(self._items) > self._max_len):
            self._render_options = RenderOptions(True)
            self._object = {k: v for (k, v) in list(self._items)[:self._max_len]}

    def get_id(self) -> str:
        return self._object_id

    def get_value(self) -> str:
        return self.get_type()

    def get_objects_to_reduce(self) -> Union[None, Collection[Any]]:
        return self._object.values()

    def create(self) -> HeapObject:
        heap_obj = HeapObject(self.get_id(), self.get_type(), self.get_value(), 'kvp', self._render_options)

        heap_obj.immutable = False
        heap_obj.references = {k: UniqueIdentifier(HeapObjectFactory.get_object_id(v)) for k, v in self._object.items()}

        return heap_obj
