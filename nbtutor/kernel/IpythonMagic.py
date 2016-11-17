# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from IPython.core import display
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic


@magics_class
class NbtutorMagics(Magics):

    def __init__(self, shell):
        super(NbtutorMagics, self).__init__(shell)

    @magic_arguments.magic_arguments()
    @magic_arguments.argument(
        '-r', '--reset', action='store_true', default=False,
        help="Reset (clear) the IPython global namespace."
    )
    @magic_arguments.argument(
        '-f', '--force', action='store_true', default=False,
        help="Forced reset (clear) of the IPython global namespace "
             "(no confirmation message)."
    )
    @magic_arguments.argument(
        '-d', '--depth', metavar='N', type=int, default=1,
        help="The stack frame visualization depth (default: 1)."
    )
    @cell_magic
    def nbtutor(self, line, cell):
        args = magic_arguments.parse_argstring(self.nbtutor, line)
        print(args)
        pass

