import sys

from io import StringIO

from nbtutor.ipython.helpers.output import redirect_stdout


def test_redirect_stdout():
    stdout = StringIO()
    sys_stdout = sys.stdout

    with redirect_stdout(stdout):
        assert sys.stdout is stdout

    assert sys.stdout is sys_stdout
