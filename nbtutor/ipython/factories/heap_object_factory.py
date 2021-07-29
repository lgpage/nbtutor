from typing import Any, Collection, Dict

from ..constants.types import basic_types, key_value_types, named_types, sequence_types
from ..models.heap_object import HeapObject
from ..models.options import Options
from .base_heap_object_factory import HeapObjectFactory
from .basic_heap_object_factory import BasicHeapObjectFactory
from .class_heap_object_factory import ClassHeapObjectFactory
from .instance_heap_object_factory import InstanceHeapObjectFactory
from .kvp_heap_object_factory import KvpHeapObjectFactory
from .named_heap_object_factory import NamedHeapObjectFactory
from .sequence_heap_object_factory import SequenceHeapObjectFactory
from .unknown_heap_object_factory import UnknownHeapObjectFactory


def resolve_heap_object_factory(obj: Any, options: Options = None) -> HeapObjectFactory:
    if isinstance(obj, basic_types):
        return BasicHeapObjectFactory(obj, options)

    if isinstance(obj, sequence_types):
        return SequenceHeapObjectFactory(obj, options)

    if isinstance(obj, key_value_types):
        return KvpHeapObjectFactory(obj, options)

    if isinstance(obj, named_types):
        return NamedHeapObjectFactory(obj, options)

    if isinstance(obj, type) and hasattr(obj, '__dict__'):
        return ClassHeapObjectFactory(obj, options)

    if isinstance(type(obj), type) and hasattr(obj, '__dict__'):
        return InstanceHeapObjectFactory(obj, options)

    return UnknownHeapObjectFactory(obj, options)


def create_heap_object(obj: Any, options: Options = None) -> HeapObject:
    return resolve_heap_object_factory(obj, options).create()


def reduce_heap_objects(objects: Collection[Any], heap: Dict[str, HeapObject], options: Options = None) -> None:
    for obj in objects:
        obj_id = HeapObjectFactory.get_object_id(obj)
        if heap.get(obj_id, None) is not None:
            continue

        factory = resolve_heap_object_factory(obj, options)
        heap[obj_id] = factory.create()

        objects_to_reduce = factory.get_objects_to_reduce()
        if objects_to_reduce is not None and len(objects_to_reduce) > 0:
            reduce_heap_objects(objects_to_reduce, heap, options)


def create_heap_objects(objects: Collection[Any], options: Options = None) -> Dict[str, HeapObject]:
    heap: Dict[str, HeapObject] = dict()
    reduce_heap_objects(objects, heap, options)
    return heap
