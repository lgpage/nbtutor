from nbtutor.ipython.constants.ignore import ignore_vars
from nbtutor.ipython.helpers.dictionary import filter_dict


def test_filter_dict_returns_expected_result():
    ignore = ['b'] + list(ignore_vars)
    d = dict({'a': 12, 'b': 'hello', '__class__': None})

    result = filter_dict(d, ignore)

    assert result == dict({'a': 12})
