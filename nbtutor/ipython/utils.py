# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function
from __future__ import unicode_literals

import six
import sys
import types

try:
    import numpy
except ImportError:
    numpy = None

from contextlib import contextmanager


ignore_vars = [
    "__ipy_scope__",  # Added by nbtutor to the calling frame globals
    "__name__",
    "__builtin__",
    "__builtins__",
    "__module__",
    "__qualname__",
    "__doc__",
    "__dict__",
    "__package__",
    "__weakref__",
]

primitive_types = [
    int,
    float,
    bool,
    type(None),
    complex,
]

sequence_types = [
    set,
    tuple,
    list,
]

key_value_types = [
    dict,
]

primitive_types.extend(list(six.string_types))

if numpy is not None:
    new_types = []
    np_types = list(set(numpy.typeDict.values()))
    np_type_names = [t.__name__ for t in np_types]
    for _type in primitive_types:
        for i, name in enumerate(np_type_names):
            if _type.__name__ in name:
                new_types.append(np_types[i])
    primitive_types.extend(new_types)

primitive_types = tuple(primitive_types)
sequence_types = tuple(sequence_types)
key_value_types = tuple(key_value_types)


def filter_dict(d, exclude):
    ret = {}
    for key, value in d.items():
        if key not in exclude:
            ret.update({key: value})
    return ret


@contextmanager
def redirect_stdout(new_stdout):
    old_stdout, sys.stdout = sys.stdout, new_stdout
    try:
        yield None
    finally:
        sys.stdout = old_stdout


def format(obj, options):
    formatters = {
        float: lambda x: '{:.{}g}'.format(x, options.digits),
    }
    for _type, fmtr in formatters.items():
        if isinstance(obj, (_type, )):
            return fmtr(obj)
    try:
        if six.PY2:
            return str(obj.encode('utf-8'))
        return str(obj)
    except:
        return 'OBJECT'


def get_type_info(obj):
    if isinstance(obj, primitive_types):
        return ('primitive', type(obj).__name__)
    if isinstance(obj, sequence_types):
        return ('sequence', type(obj).__name__)
    if isinstance(obj, key_value_types):
        return ('key-value', type(obj).__name__)
    if isinstance(obj, types.ModuleType):
        return ('module', type(obj).__name__)
    if isinstance(obj, (types.FunctionType, types.MethodType)):
        return ('function', type(obj).__name__)
    if isinstance(obj, type):
        if hasattr(obj, '__dict__'):
            return ('class', obj.__name__)
    if isinstance(type(obj), type):
        if hasattr(obj, '__dict__'):
            return ('instance', '{} instance'.format(type(obj).__name__))

    return ('unknown', type(obj).__name__)
