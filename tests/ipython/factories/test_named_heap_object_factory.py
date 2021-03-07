import json

from nbtutor.ipython.factories.named_heap_object_factory import NamedHeapObjectFactory


class TestNamedHeapObjectFactory(object):
    def test_create_module_returns_expected_result(self):
        import math as py_obj

        heap_obj = NamedHeapObjectFactory(py_obj).create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'module'
        assert heap_obj.value == 'math'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert not heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_function_returns_expected_result(self):
        def py_obj():
            pass

        heap_obj = NamedHeapObjectFactory(py_obj).create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'function'
        assert heap_obj.value == 'py_obj'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert not heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize
