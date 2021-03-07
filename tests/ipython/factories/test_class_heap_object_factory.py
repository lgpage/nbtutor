import json

from typing import Dict, cast

from nbtutor.ipython.factories.class_heap_object_factory import ClassHeapObjectFactory
from nbtutor.ipython.models.unique_identifier import UniqueIdentifier

class PyObj():
    def __init__(self, a: int) -> None:
        self.a = a


class TestClassHeapObjectFactory(object):
    def test_create_class_returns_expected_result(self):
        factory = ClassHeapObjectFactory(PyObj)
        heap_obj = factory.create()
        references = cast(Dict[str, UniqueIdentifier], heap_obj.references)

        assert heap_obj.id == "{0}".format(id(PyObj))
        assert heap_obj.value == 'PyObj'
        assert heap_obj.type == '(PyObj) class'
        assert heap_obj.render_type == 'kvp'
        assert heap_obj.render_options is None
        assert not heap_obj.immutable

        assert references['__init__'].id == "{0}".format(id(PyObj.__init__))

        assert json.dumps(heap_obj.to_dict())  # can serialize
