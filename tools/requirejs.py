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
        _env.node_bin("r.js{}".format(".cmd" if _env.IS_WIN else "")),
        "-o", os.path.join(_env.SRC, "js", "build.js"),
    ] + opts.get("requirejs", [])
    return Popen(args, shell=_env.IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
