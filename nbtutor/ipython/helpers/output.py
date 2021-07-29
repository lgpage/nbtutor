import sys
from contextlib import contextmanager
from typing import TextIO


@contextmanager
def redirect_stdout(new_stdout: TextIO):
    old_stdout, sys.stdout = sys.stdout, new_stdout
    try:
        yield None
    finally:
        sys.stdout = old_stdout
