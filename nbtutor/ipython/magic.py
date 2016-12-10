# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from ipykernel.comm import Comm
from IPython.core import magic_arguments
from IPython.core.magic import Magics, cell_magic, magics_class
from IPython.core.magics.namespace import NamespaceMagics

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
        '--digits', metavar='D', type=int, default=3,
        help="The number of significant digits for floats (default: 3)."
    )
    @magic_arguments.argument(
        '--max_size', metavar='S', type=int, default=5,
        help="The number of sequence object elements to visualize (default: 5)."
    )
    @magic_arguments.argument(
        '--step_all', action='store_true', default=False,
        help="Step through all frames (including other global scope frames)"
    )
    @magic_arguments.argument(
        '--expand_arrays', action='store_true', default=False,
        help="Expand numpy arrays to show underlying data"
    )
    @magic_arguments.argument(
        '--nolies', action='store_true', default=False,
        help="No inlined keys, attributes or primitive objects"
    )
    @magic_arguments.argument(
        '--debug', action='store_true', default=False,
        help="Debug nbtutor."
    )
    @cell_magic
    def nbtutor(self, line, cell):
        opts = magic_arguments.parse_argstring(self.nbtutor, line)
        if opts.reset:
            params = '-f' if opts.force else ''
            NamespaceMagics(self.shell).reset(params)
        if opts.nolies:
            opts.inline = False

        bdb = Bdb(self.shell, opts)
        bdb.run_cell(cell)

        self.shell.run_cell(cell)
        # FIXME: This pointless re-running the cell again via ipython is needed
        # to get the "<ipython-input-{0}-{1}>" f_code.co_filename set and the
        # code cached. I don't know enough about the IPython API to do this
        # better inside the debugger.

        if not bdb.code_error or opts.debug:
            self.comm.send(bdb.trace_history.clean())
