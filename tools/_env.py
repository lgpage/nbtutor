#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copied and modified from
# https://github.com/Anaconda-Platform/nbpresent/tree/master/nbpresent/tasks
import os
import platform


PKG = "nbtutor"

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PKG_ROOT = os.path.join(REPO_ROOT, PKG)
SRC = os.path.join(REPO_ROOT, "src")
DIST = os.path.join(PKG_ROOT, "static", PKG)

IS_WIN = "Windows" in platform.system()


def node_bin(*it):
    return os.path.join(REPO_ROOT, "node_modules", ".bin", *it)


def external(*modules):
    # browserify --external
    return sum([["--external", m] for m in modules], [])

transform = [
    "--transform", "[", "babelify", "--sourceMapRelative", ".", "]",
]

extension = ["--extension", "es6"]
