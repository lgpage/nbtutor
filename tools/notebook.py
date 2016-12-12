#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copied and modified from
# https://github.com/Anaconda-Platform/nbpresent/tree/master/nbpresent/tasks
from __future__ import absolute_import

import os
import sys

from subprocess import Popen

from tools import _env


def main(**opts):
    args = [
        _env.node_bin("browserify"),
        "--standalone", "nbtutor-notebook",
    ] + _env.extension + _env.external(
        "d3",
        "uuid",
        "jquery",
        "jsplumb",
        "nbtutor-deps",
        "base/js/events",
        "base/js/dialog",
        "base/js/namespace",
        "notebook/js/celltoolbar",
    ) + _env.transform + [
        "--outfile", os.path.join(_env.DIST, "js", "nbtutor.notebook.min.js"),
        os.path.join(_env.SRC, "es6", "notebook", "notebook.es6")
    ] + opts.get("browserify", [])
    return Popen(args, shell=_env.IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
