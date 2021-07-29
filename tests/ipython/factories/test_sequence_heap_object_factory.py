import json

from typing import List, cast

from nbtutor.ipython.models.options import Options
from nbtutor.ipython.factories.sequence_heap_object_factory import SequenceHeapObjectFactory
from nbtutor.ipython.models.unique_identifier import UniqueIdentifier


class TestSequenceHeapObjectFactory(object):
    def test_create_tuple_returns_expected_result(self):
        py_obj = tuple([4, 3])

        factory = SequenceHeapObjectFactory(py_obj)
        heap_obj = factory.create()
        references = cast(List[UniqueIdentifier], heap_obj.references)

        assert str(id(py_obj)) == factory.get_id()
        assert isinstance(factory._object, (tuple,))

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'tuple'
        assert heap_obj.value == 'tuple'
        assert heap_obj.render_type == 'sequence'
        assert heap_obj.render_options is None
        assert heap_obj.immutable

        assert references[0].id == "{0}".format(id(py_obj[0]))
        assert references[1].id == "{0}".format(id(py_obj[1]))

        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_tuple_with_max_size_returns_expected_result(self):
        py_obj = tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        options = Options(max_size=5)

        factory = SequenceHeapObjectFactory(py_obj, options)
        heap_obj = factory.create()
        references = cast(List[UniqueIdentifier], heap_obj.references)

        assert str(id(py_obj)) == factory.get_id()
        assert isinstance(factory._object, (tuple,))

        assert len(factory._object) == 5
        assert len(references) == 5

        assert heap_obj.render_options.concat == True
        for i, v in enumerate([1, 2, 3, 4, 5]):
            assert factory._object[i] == v
            assert references[i].id == "{0}".format(id(py_obj[i]))

        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_list_returns_expected_result(self):
        py_obj = list([4, 3])

        factory = SequenceHeapObjectFactory(py_obj)
        heap_obj = factory.create()
        references = cast(List[UniqueIdentifier], heap_obj.references)

        assert str(id(py_obj)) == factory.get_id()
        assert isinstance(factory._object, (list,))

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'list'
        assert heap_obj.value == 'list'
        assert heap_obj.render_type == 'sequence'
        assert heap_obj.render_options is None
        assert not heap_obj.immutable

        assert references[0].id == "{0}".format(id(py_obj[0]))
        assert references[1].id == "{0}".format(id(py_obj[1]))

        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_list_with_max_size_returns_expected_result(self):
        py_obj = list([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        options = Options(max_size=5)

        factory = SequenceHeapObjectFactory(py_obj, options)
        heap_obj = factory.create()
        references = cast(List[UniqueIdentifier], heap_obj.references)

        assert str(id(py_obj)) == factory.get_id()
        assert isinstance(factory._object, (list,))

        assert len(factory._object) == 5
        assert len(references) == 5

        assert heap_obj.render_options.concat == True
        for i, v in enumerate([1, 2, 3, 4, 5]):
            assert factory._object[i] == v
            assert references[i].id == "{0}".format(id(py_obj[i]))

        assert json.dumps(heap_obj.to_dict())  # can serialize
