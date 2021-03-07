from .version import __version__  # noqa F401
from .version import __version_info__  # noqa F401


def _jupyter_server_extension_paths():
    return [dict(module="nbtutor")]


def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        src="static",
        dest="nbtutor",
        require="nbtutor/nbtutor.notebook",
    )]


def load_jupyter_server_extension(nbapp):
    pass


def load_ipython_extension(ip):
    from .ipython.magic import NbtutorMagics
    ip.register_magics(NbtutorMagics)
