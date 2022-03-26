from ipykernel.comm import Comm  # type: ignore
from IPython.core import magic_arguments  # type: ignore
from IPython.core.magic import Magics, cell_magic, magics_class  # type: ignore
from IPython.core.magics.namespace import NamespaceMagics  # type: ignore

from .debugger import Debugger


@magics_class
class NbtutorMagics(Magics):

    def __init__(self, shell=None, **kwargs) -> None:
        super().__init__(shell, **kwargs)
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
        '-d', '--depth', metavar='N', type=int, default=3,
        help="The stack frame visualization depth (default: 3)."
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
        '--debug', action='store_true', default=False,
        help="Debug nbtutor."
    )
    @cell_magic
    def nbtutor(self, line, cell) -> None:
        opts = magic_arguments.parse_argstring(self.nbtutor, line)

        if opts.reset:
            params = '-f' if opts.force else ''
            NamespaceMagics(self.shell).reset(params)

        debugger = Debugger(self.shell, cell, opts)
        debugger.run_cell()

        # FIXME: This pointless re-running the cell again via IPython is needed to get the
        # "<ipython-input-{0}-{1}>" f_code.co_filename set and the code cached.
        # I don't know enough about IPython to do this better inside the debugger.
        self.shell.run_cell(cell)

        if not debugger.code_error or opts.debug:
            self.comm.send([x.to_dict() for x in debugger.trace_history])
