import json

from typing import Dict, OrderedDict, cast

from nbtutor.ipython.models.options import Options
from nbtutor.ipython.factories.kvp_heap_object_factory import KvpHeapObjectFactory
from nbtutor.ipython.models.unique_identifier import UniqueIdentifier


class TestDictionaryHeapObjectFactory(object):
    def test_create_dictionary_returns_expected_result(self):
        py_obj = dict({'a': 12})
        heap_obj = KvpHeapObjectFactory(py_obj).create()
        references = cast(Dict[str, UniqueIdentifier], heap_obj.references)

        assert heap_obj.id == "{0}".format(id(py_obj))
        assert heap_obj.type == 'dict'
        assert heap_obj.value == 'dict'
        assert heap_obj.render_type == 'kvp'
        assert heap_obj.render_options is None
        assert not heap_obj.immutable

        assert references['a'].id == "{0}".format(id(py_obj['a']))
        assert json.dumps(heap_obj.to_dict())  # can serialize

    def test_create_dictionary_with_max_size_returns_expected_result(self):
        options = Options(max_size=3)
        py_obj = OrderedDict({
            'a': 1,
            'c': 3,
            'd': 4,
            'b': 2,
        })

        factory = KvpHeapObjectFactory(py_obj, options)
        heap_obj = factory.create()
        references = cast(Dict[str, UniqueIdentifier], heap_obj.references)

        assert str(id(py_obj)) == factory.get_id()
        assert isinstance(factory._object, (dict,))

        assert len(factory._object.keys()) == 3
        assert len(references) == 3

        assert heap_obj.render_options.concat == True
        for (k, v) in [('a', 1), ('c', 3), ('d', 4)]:
            assert factory._object[k] == v
            assert references[k].id == "{0}".format(id(py_obj[k]))

        assert json.dumps(heap_obj.to_dict())  # can serialize
