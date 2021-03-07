from typing import Any, Collection, Union

from ..constants.ignore import ignore_vars
from ..models.heap_object import HeapObject
from ..models.options import Options
from ..models.unique_identifier import UniqueIdentifier
from ..helpers.dictionary import filter_dict
from .base_heap_object_factory import HeapObjectFactory


class ClassHeapObjectFactory(HeapObjectFactory):
    def __init__(self, obj: Any, options: Options = None) -> None:
        super().__init__(obj, options)

        self._dict = filter_dict(self._object.__dict__, ignore_vars)

    def get_type(self) -> str:
        return '({0}) class'.format(self.get_value())

    def get_value(self) -> str:
        return self._object.__name__

    def get_objects_to_reduce(self) -> Union[None, Collection[Any]]:
        return self._dict.values()

    def create(self) -> HeapObject:
        heap_obj = HeapObject(self.get_id(), self.get_type(), self.get_value(), 'kvp')

        heap_obj.immutable = False
        heap_obj.references = {k: UniqueIdentifier(HeapObjectFactory.get_object_id(v))
                               for k, v in self._dict.items()}

        return heap_obj
