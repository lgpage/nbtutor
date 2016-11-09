#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copied and modified from
# https://github.com/Anaconda-Platform/nbpresent/tree/master/nbpresent/tasks
import os
import sys

from subprocess import Popen

from . import _env


def main(**opts):
    args = [
        _env.node_bin("browserify"),
        "--standalone", "nbpresent-standalone",
    ] + _env.extension + _env.external(
        "jquery",
        "nbpresent-deps"
    ) + _env.transform + [
        "--outfile",
        os.path.join(_env.DIST, "js", "nbpresent.standalone.min.js"),
        os.path.join(_env.SRC, "es6", "mode", "standalone.es6")
    ] + opts.get("browserify", [])
    return Popen(args, shell=_env.IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
