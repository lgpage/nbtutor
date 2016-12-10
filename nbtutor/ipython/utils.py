# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import sys
import types
from contextlib import contextmanager

import six

try:
    import numpy
except ImportError:
    numpy = None


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

float_types = [
    float,
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

array_types = [
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
            if _type.__name__ in name or isinstance(np_types[i], (_type, )):
                new_types.append(np_types[i])

    for i, name in enumerate(np_type_names):
        if 'float' in name or isinstance(np_types[i], (float, )):
            float_types.append(np_types[i])

    primitive_types.extend(new_types)
    array_types.append(numpy.ndarray)

float_types = tuple(float_types)
primitive_types = tuple(primitive_types)
sequence_types = tuple(sequence_types)
array_types = tuple(array_types)
key_value_types = tuple(key_value_types)


def filter_dict(d, exclude):
    """Return a new dict with specified keys excluded from the origional dict

    Args:
        d (dict): origional dict
        exclude (list): The keys that are excluded
    """
    ret = {}
    for key, value in d.items():
        if key not in exclude:
            ret.update({key: value})
    return ret


@contextmanager
def redirect_stdout(new_stdout):
    """Redirect the stdout

    Args:
        new_stdout (io.StringIO): New stdout to use instead
    """
    old_stdout, sys.stdout = sys.stdout, new_stdout
    try:
        yield None
    finally:
        sys.stdout = old_stdout


def format(obj, options):
    """Return a string representation of the Python object

    Args:
        obj: The Python object
        options: Format options
    """
    formatters = {
        float_types: lambda x: '{:.{}g}'.format(x, options.digits),
    }
    for _types, fmtr in formatters.items():
        if isinstance(obj, _types):
            return fmtr(obj)
    try:
        if six.PY2 and isinstance(obj, six.string_types):
            return str(obj.encode('utf-8'))
        return str(obj)
    except:
        return 'OBJECT'


def get_type_info(obj):
    """Get type information for a Python object

    Args:
        obj: The Python object

    Returns:
        tuple: (object type "catagory", object type name)
    """
    if isinstance(obj, primitive_types):
        return ('primitive', type(obj).__name__)
    if isinstance(obj, sequence_types):
        return ('sequence', type(obj).__name__)
    if isinstance(obj, array_types):
        return ('array', type(obj).__name__)
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
            cls_name = type(obj).__name__
            if cls_name == 'classobj':
                cls_name = obj.__name__
                return ('class', '{}'.format(cls_name))
            if cls_name == 'instance':
                cls_name = obj.__class__.__name__
            return ('instance', '{} instance'.format(cls_name))

    return ('unknown', type(obj).__name__)
