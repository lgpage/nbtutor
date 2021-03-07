import types
from typing import List, Tuple


_decimal_types: List[type] = list([
    float,
])

_basic_types: List[type] = list([
    int,
    float,
    bool,
    str,
    type(None),
    complex,
])

_array_types: List[type] = list()
_sequence_types: List[type] = list([
    tuple,
    list,
])

_key_value_types: List[type] = list([dict])

_named_types: List[type] = list([
    types.ModuleType,
    types.MethodType,
    types.FunctionType,
])


def extract_numpy_types(np) -> Tuple[List[type], List[type], type]:
    np_basic_types: List[type] = list()
    np_types: List[type] = list(set(np.typeDict.values()))
    np_type_names: List[str] = [t.__name__ for t in np_types]

    np_decimal_types: List[type] = list()

    for _type in _basic_types:
        for i, name in enumerate(np_type_names):
            if _type.__name__ in name or isinstance(np_types[i], (_type, )):
                np_basic_types.append(np_types[i])

    for i, name in enumerate(np_type_names):
        if 'float' in name or isinstance(np_types[i], (float, )):
            np_decimal_types.append(np_types[i])

    return np_decimal_types, np_basic_types, np.ndarray


try:
    import numpy  # type: ignore

    np_decimal_types, np_basic_types, np_type = extract_numpy_types(numpy)

    _decimal_types.extend(np_decimal_types)
    _basic_types.extend(np_basic_types)
    _array_types.append(np_type)

except ImportError:
    pass


basic_types = tuple(_basic_types)
decimal_types = tuple(_decimal_types)
array_types = tuple(_array_types)
sequence_types = tuple(_sequence_types)
key_value_types = tuple(_key_value_types)
named_types = tuple(_named_types)
