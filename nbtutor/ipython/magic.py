# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from IPython.core import display
from IPython.core import magic_arguments
from IPython.core.magic import Magics, magics_class, cell_magic
from IPython.core.magics.namespace import NamespaceMagics

from ipykernel.comm import Comm

from .debugger import Bdb


@magics_class
class NbtutorMagics(Magics):

    def __init__(self, shell):
        super(NbtutorMagics, self).__init__(shell)
        self.comm = Comm(target_name='nbtutor_comm')

    @magic_arguments.magic_arguments()
    @magic_arguments.argument(
        '-r', '--reset', action='store_true', default=False,
        help="Reset (clear) the IPython global namespace."
    )
    @magic_arguments.argument(
        '-f', '--force', action='store_true', default=False,
        help="Suppress the reset confirmation message."
    )
    @magic_arguments.argument(
        '-i', '--inline', action='store_true', default=False,
        help="Inline primitive objects."
    )
    @magic_arguments.argument(
        '-d', '--depth', metavar='N', type=int, default=1,
        help="The stack frame visualization depth (default: 1)."
    )
    @magic_arguments.argument(
        '-s', '--digits', metavar='D', type=int, default=3,
        help="The number of significant digits for floats (default: 3)."
    )
    @cell_magic
    def nbtutor(self, line, cell):
        args = magic_arguments.parse_argstring(self.nbtutor, line)
        if args.reset:
            params = '-f' if args.force else ''
            NamespaceMagics(self.shell).reset(params)

        bdb = Bdb(self.shell, vars(args))
        bdb.run_cell(cell)
        if bdb.code_error:
            self.shell.run_cell(cell)
        else:
            self.comm.send(bdb.trace_history.json_clean())
