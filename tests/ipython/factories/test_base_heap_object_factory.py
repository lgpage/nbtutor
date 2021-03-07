from nbtutor.ipython.factories.base_heap_object_factory import HeapObjectFactory, HeapObject
from unittest.mock import Mock

HeapObjectMock = Mock(name='HeapObject')


class HeapObjectFactoryTest(HeapObjectFactory):
    def get_value(self) -> str:
        return 'value'

    def create(self) -> HeapObject:
        return HeapObjectMock


class TestHeapObjectFactory(object):
    py_obj = 12

    def test_get_object_id_returns_expected_result(self):
        assert HeapObjectFactoryTest.get_object_id(self.py_obj) == str(id(self.py_obj))

    def test_get_id_returns_expected_result(self):
        result = HeapObjectFactoryTest(self.py_obj).get_id()
        assert result == str(id(self.py_obj))

    def test_get_type_returns_expected_result(self):
        assert HeapObjectFactoryTest(12).get_type() == 'int'

    def test_get_objects_to_reduce_returns_expected_result(self):
        assert HeapObjectFactoryTest(12).get_objects_to_reduce() is None

    def test_get_value_returns_expected_result(self):
        assert HeapObjectFactoryTest(12).get_value() == 'value'

    def test_create_returns_expected_result(self):
        assert HeapObjectFactoryTest(12).create() is HeapObjectMock
