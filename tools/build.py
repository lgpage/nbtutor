#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copied and modified from
# https://github.com/Anaconda-Platform/nbpresent/tree/master/nbpresent/tasks
from __future__ import absolute_import, print_function

import sys

from importlib import import_module
from multiprocessing import Pool, cpu_count

from tools import clean
from tools import requirejs


try:
    CPU_COUNT = cpu_count()
except NotImplementedError:
    CPU_COUNT = 1


def _run(mod_opt, *args, **opts):
    print("started {0} with {1}".format(*mod_opt))
    task = import_module("tools.{}".format(mod_opt[0]))
    task.main(**mod_opt[1])
    print("...completed {}".format(mod_opt[0]))
    return 0


def main(**opts):
    tasks = [
        "less",
        "deps",
        "index",
        "notebook",
    ]

    clean.main()
    pool = Pool(processes=CPU_COUNT)
    pool.map(_run, zip(tasks, [opts] * len(tasks)))
    requirejs.main(**opts)
    return 0


if __name__ == "__main__":
    opts = {}
    args = sys.argv[1:]
    if "release" in args:
        opts.update(
            browserify=["-g", "uglifyify"],
        )
    if "dev" in args:
        opts.update(
            browserify=["--debug"],
            less=["--source-map-map-inline"],
        )
    sys.exit(main(**opts))
