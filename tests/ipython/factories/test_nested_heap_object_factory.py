from nbtutor.ipython.factories.heap_object_factory import reduce_heap_objects


def test_reduce_nested_lists_heap_objects_returns_expected_result():
    py_obj = list([4, list([3, list([3, 2]), 2]), 1])

    heap_objects = dict()
    reduce_heap_objects([py_obj], heap_objects)
    assert len(heap_objects) == 7

    numbers = {}
    for x in heap_objects.values():
        if x.type == 'int':
            numbers[x.value] = x

    outer_list = heap_objects[str(id(py_obj))]
    inner_list = heap_objects[str(id(py_obj[1]))]
    inner_inner_list = heap_objects[str(id(py_obj[1][1]))]

    assert len(outer_list.references) == 3
    assert outer_list.references[0].id == numbers['4'].id
    assert outer_list.references[1].id == inner_list.id
    assert outer_list.references[2].id == numbers['1'].id

    assert len(inner_list.references) == 3
    assert inner_list.references[0].id == numbers['3'].id
    assert inner_list.references[1].id == inner_inner_list.id
    assert inner_list.references[2].id == numbers['2'].id

    assert len(inner_inner_list.references) == 2
    assert inner_inner_list.references[0].id == numbers['3'].id
    assert inner_inner_list.references[1].id == numbers['2'].id


def test_reduce_nested_dict_list_heap_objects_returns_expected_result():
    py_obj = dict({
        'a': 3,
        'b': list([3, 2]),
        'c': 2,
    })

    heap_objects = dict()
    reduce_heap_objects([py_obj], heap_objects)
    assert len(heap_objects) == 4

    numbers = {}
    for x in heap_objects.values():
        if x.type == 'int':
            numbers[x.value] = x

    outer_dict = heap_objects[str(id(py_obj))]
    inner_list = heap_objects[str(id(py_obj['b']))]

    assert len(outer_dict.references) == 3
    assert outer_dict.references['a'].id == numbers['3'].id
    assert outer_dict.references['b'].id == inner_list.id
    assert outer_dict.references['c'].id == numbers['2'].id

    assert len(inner_list.references) == 2
    assert inner_list.references[0].id == numbers['3'].id
    assert inner_list.references[1].id == numbers['2'].id


def test_reduce_recursive_nested_heap_objects_returns_expected_result():
    py_obj = list([])
    py_obj.append(py_obj)

    heap_objects = dict()
    reduce_heap_objects([py_obj], heap_objects)
    assert len(heap_objects) == 1

    entity = heap_objects[str(id(py_obj))]
    assert entity.references[0].id == entity.id
