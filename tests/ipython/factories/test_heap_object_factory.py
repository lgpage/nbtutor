import types
from typing import List, Optional
from unittest.mock import Mock, call, patch

from nbtutor.ipython.constants.types import basic_types, decimal_types, key_value_types, sequence_types
from nbtutor.ipython.factories.base_heap_object_factory import HeapObjectFactory
from nbtutor.ipython.factories.basic_heap_object_factory import BasicHeapObjectFactory
from nbtutor.ipython.factories.class_heap_object_factory import ClassHeapObjectFactory
from nbtutor.ipython.factories.heap_object_factory import (
    create_heap_object, create_heap_objects, reduce_heap_objects, resolve_heap_object_factory)
from nbtutor.ipython.factories.instance_heap_object_factory import InstanceHeapObjectFactory
from nbtutor.ipython.factories.kvp_heap_object_factory import KvpHeapObjectFactory
from nbtutor.ipython.factories.named_heap_object_factory import NamedHeapObjectFactory
from nbtutor.ipython.factories.sequence_heap_object_factory import SequenceHeapObjectFactory

# Setup Helpers


def py_func():
    pass


class PyObj(object):
    def __init__(self, foo: int) -> None:
        self.foo = foo

    def method(self):
        pass


def _setup_resolve_heap_object_factory():
    heap_object_mock = Mock(name='HeapObject')
    resolve_heap_object_factory_mock = Mock(name='resolve_heap_object_factory')
    heap_object_factories_mock = [Mock(name='HeapObjectFactory')]

    for heap_object_factory_mock in heap_object_factories_mock:
        heap_object_factory_mock.create.return_value = heap_object_mock
        heap_object_factory_mock.get_objects_to_reduce.return_value = None

    resolve_heap_object_factory_mock.side_effect = heap_object_factories_mock
    return heap_object_mock, heap_object_factories_mock, resolve_heap_object_factory_mock


# Tests

def test_resolve_basic_heap_object_factory_returns_expected_result():
    for obj_type in basic_types:
        assert isinstance(resolve_heap_object_factory(obj_type()), BasicHeapObjectFactory)

    for obj_type in decimal_types:
        assert isinstance(resolve_heap_object_factory(obj_type()), BasicHeapObjectFactory)


def test_resolve_sequence_heap_object_factory_returns_expected_result():
    for obj_type in sequence_types:
        assert isinstance(resolve_heap_object_factory(obj_type()), SequenceHeapObjectFactory)


def test_resolve_kvp_heap_object_factory_returns_expected_result():
    for obj_type in key_value_types:
        assert isinstance(resolve_heap_object_factory(obj_type()), KvpHeapObjectFactory)


def test_resolve_named_heap_object_factory_returns_expected_result():
    py_obj = PyObj(12)
    assert isinstance(resolve_heap_object_factory(py_func), NamedHeapObjectFactory)
    assert isinstance(resolve_heap_object_factory(py_obj.method), NamedHeapObjectFactory)
    assert isinstance(resolve_heap_object_factory(types.ModuleType('name')), NamedHeapObjectFactory)


def test_resolve_class_heap_object_factory_returns_expected_result():
    assert isinstance(resolve_heap_object_factory(PyObj), ClassHeapObjectFactory)


def test_resolve_instance_heap_object_factory_returns_expected_result():
    py_obj = PyObj(12)
    assert isinstance(resolve_heap_object_factory(py_obj), InstanceHeapObjectFactory)


def test_create_heap_object_calls_expected_methods():
    method_path = 'nbtutor.ipython.factories.heap_object_factory.resolve_heap_object_factory'
    heap_object_mock, heap_object_factories_mock, resolve_heap_object_factory_mock = _setup_resolve_heap_object_factory()

    with patch(method_path, resolve_heap_object_factory_mock):
        result = create_heap_object(12)

    resolve_heap_object_factory_mock.assert_called_once_with(12, None)
    heap_object_factories_mock[0].create.assert_called_once()
    assert result is heap_object_mock


@patch.object(HeapObjectFactory, 'get_object_id')
def test_reduce_heap_object_returns_expected_result(get_object_id):
    heap = dict()
    get_object_id.return_value = 'id'
    method_path = 'nbtutor.ipython.factories.heap_object_factory.resolve_heap_object_factory'
    heap_object_mock, heap_object_factories_mock, resolve_heap_object_factory_mock = _setup_resolve_heap_object_factory()

    # ACT
    with patch(method_path, resolve_heap_object_factory_mock):
        reduce_heap_objects([12], heap)

    resolve_heap_object_factory_mock.assert_called_once_with(12, None)
    heap_object_factories_mock[0].create.assert_called_once()
    assert heap == dict({'id': heap_object_mock})


@patch.object(HeapObjectFactory, 'get_object_id')
def test_reduce_heap_object_handles_recursive_references(get_object_id):
    heap = dict()
    py_obj = list()
    py_obj.append(py_obj)
    get_object_id.return_value = 'id'
    method_path = 'nbtutor.ipython.factories.heap_object_factory.resolve_heap_object_factory'
    heap_object_mock, heap_object_factories_mock, resolve_heap_object_factory_mock = _setup_resolve_heap_object_factory()

    # ACT
    with patch(method_path, resolve_heap_object_factory_mock):
        reduce_heap_objects([py_obj], heap)

    assert resolve_heap_object_factory_mock.call_args_list == [call(py_obj, None)]
    heap_object_factories_mock[0].create.assert_called()
    assert heap == dict({'id': heap_object_mock})


def test_create_heap_objects_call_expected_methods():
    reduce_heap_objects = Mock(name='reduce_heap_objects')
    method_path = 'nbtutor.ipython.factories.heap_object_factory.reduce_heap_objects'

    with patch(method_path, reduce_heap_objects):
        result = create_heap_objects([12])

    reduce_heap_objects.assert_called_once_with([12], dict(), None)
    assert result == dict()

def test_reduce_heap_objects_instance_returns_expected_result():
    py_obj = PyObj(12)
    heap_objects = dict()

    reduce_heap_objects([py_obj], heap_objects)

    assert len(heap_objects) == 2
    assert heap_objects[str(id(py_obj))].value == 'PyObj'
    assert heap_objects[str(id(py_obj.foo))].value == '12'
