from nbtutor.ipython.models.trace_step import TraceStep, Stack
from nbtutor.ipython.factories.trace_step_factory import create_trace_step


def test_create_trace_step():
    frames = list()
    heap = dict()
    line_numbers = list()

    trace_step = create_trace_step(frames, heap, line_numbers, 'stdout', 'stderr')

    assert isinstance(trace_step, (TraceStep,))
    assert isinstance(trace_step.stack, (Stack,))
    assert trace_step.heap is heap
    assert trace_step.line_numbers is line_numbers
    assert trace_step.stack.frames is frames
    assert trace_step.stdout == "stdout"
    assert trace_step.stderr == "stderr"
