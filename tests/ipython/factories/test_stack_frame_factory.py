from unittest.mock import Mock, call, patch

from nbtutor.ipython.factories.stack_frame_factory import create_stack_frame


def test_create_stack_frame():
    user_locals = dict(a=10, b="hello")
    frame = Mock(name="Frame")

    stack_frame = create_stack_frame(frame, 'line', user_locals)

    assert stack_frame.event == 'line'
    assert stack_frame.name == frame.f_code.co_name
    assert len(stack_frame.variables) == 2

    assert stack_frame.variables[0].name == "a"
    assert stack_frame.variables[1].name == "b"

    assert stack_frame.variables[0].id == "{0}".format(id(user_locals["a"]))
    assert stack_frame.variables[1].id == "{0}".format(id(user_locals["b"]))
