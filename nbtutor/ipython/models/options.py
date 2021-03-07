from argparse import Namespace


class Options(Namespace):
    reset: bool
    force: bool
    depth: int
    max_size: int
    step_all: bool
    expand_arrays: bool
    debug: bool
