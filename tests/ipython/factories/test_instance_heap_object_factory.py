import json

from typing import Dict, cast

from nbtutor.ipython.factories.instance_heap_object_factory import InstanceHeapObjectFactory
from nbtutor.ipython.models.unique_identifier import UniqueIdentifier


class PyObj():
    def __init__(self, a: int) -> None:
        self.a = a


class TestInstanceHeapObjectFactory(object):
    def test_create_class_instance_returns_expected_result(self):
        py_obj = PyObj(12)
        heap_obj = InstanceHeapObjectFactory(py_obj).create()
        references = cast(Dict[str, UniqueIdentifier], heap_obj.references)

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == '(PyObj) instance'
        assert heap_obj.value == 'PyObj'
        assert heap_obj.render_type == 'kvp'
        assert heap_obj.render_options is None
        assert not heap_obj.immutable

        assert len(references) == 1
        assert references['a'].id == "{0}".format(id(py_obj.a))
        assert json.dumps(heap_obj.to_dict())  # can serialize
