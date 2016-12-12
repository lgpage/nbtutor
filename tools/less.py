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
        _env.node_bin("lessc"),
        "--autoprefix",
        "--clean-css",
        "--include-path={}".format(_env.node_bin("..")),
        os.path.join(_env.SRC, "less", "index.less"),
        os.path.join(_env.DIST, "css", "nbtutor.min.css")
    ] + opts.get("less", [])
    return Popen(args, shell=_env.IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
