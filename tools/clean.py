#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copied and modified from
# https://github.com/Anaconda-Platform/nbpresent/tree/master/nbpresent/tasks
from __future__ import absolute_import

import os
import shutil
import sys

from tools import _env


def main(**opts):
    to_clean = [
        os.path.join(_env.DIST, "js"),
        os.path.join(_env.DIST, "css")
    ]
    for path in to_clean:
        if os.path.exists(path):
            shutil.rmtree(path)
        os.makedirs(path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
