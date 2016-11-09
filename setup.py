#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import setup


# should be loaded below
__version__ = None

with open('nbtutor/_version.py') as version:
    exec(version.read())

try:
    import pypandoc
    long_description = pypandoc.convert("./README.md", "rst")
    long_description = long_description.replace("\r", "")

except ImportError:
    print("pypandoc not found, Long description conversion failure.")
    import io
    with io.open("./README.md", encoding="utf-8") as fh:
        long_description = fh.read()


setup(
    name="nbtutor",
    version=__version__,
    description="Visualize Python code execution in Jupyter Notebooks",
    long_description=long_description,
    author="Logan Page",
    author_email="",
    license="MIT",
    url="",
    keywords="ipython jupyter python tutor visualize code exection",
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Framework :: IPython",
        "Programming Language :: Python",
        "License :: OSI Approved :: MIT License"
    ],
    packages=["nbtutor"],
    setup_requires=["notebook"],
    tests_require=["nose", "requests", "coverage"],
    include_package_data=True,
    entry_points={
        # 'console_scripts': ['nbtutor=nbtutor.export:main'],
    }
)
