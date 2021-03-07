import json

from nbtutor.ipython.factories.basic_heap_object_factory import BasicHeapObjectFactory


class TestBasicHeapObjectFactory(object):
    def test_create_bool_returns_expected_result(self):
        py_obj = True
        factory = BasicHeapObjectFactory(py_obj)
        heap_obj = factory.create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'bool'
        assert heap_obj.value == 'True'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_int_returns_expected_result(self):
        py_obj = 12
        heap_obj = BasicHeapObjectFactory(py_obj).create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'int'
        assert heap_obj.value == '12'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_float_returns_expected_result(self):
        py_obj = 12.123
        heap_obj = BasicHeapObjectFactory(py_obj).create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'float'
        assert heap_obj.value == '12.123'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_str_returns_expected_result(self):
        py_obj = "hello world"
        heap_obj = BasicHeapObjectFactory(py_obj).create()

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'str'
        assert heap_obj.value == 'hello world'
        assert heap_obj.render_type == 'basic'
        assert heap_obj.references is None
        assert heap_obj.render_options is None
        assert heap_obj.immutable
        assert json.dumps(heap_obj.to_dict())  # can serialize
