# -*- coding: utf-8 -*-
from __future__ import absolute_import

from os.path import join

from ._version import __version__
from ._version import __version_info__


# IPython Extension points
def load_ipython_extension(ip):
    from .kernel.IpythonMagic import NbtutorMagics  # pylint: disable=cyclic-import
    ip.register_magics(NbtutorMagics)


# Jupyter Extension points
def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        src=join("static", "nbtutor"),
        dest="nbtutor",
        require="nbtutor/js/nbtutor.min")]

