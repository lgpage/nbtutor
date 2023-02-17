# Nbtutor

Visualize Python code execution (line-by-line) in [Jupyter Notebook] cells. Inspired by [Online Python Tutor]

![Usage Example](usage.gif)

[![PyPI latest release](https://img.shields.io/pypi/v/nbtutor.svg?style=flat)](https://pypi.org/project/nbtutor)
[![PyPI monthly downloads](https://img.shields.io/pypi/dm/nbtutor.svg?style=flat)](https://pypi.org/project/nbtutor)
[![PyPI wheel](https://img.shields.io/pypi/wheel/nbtutor.svg?style=flat)](https://pypi.org/project/nbtutor)
[![Supported versions](https://img.shields.io/pypi/pyversions/nbtutor.svg?style=flat)](https://pypi.org/project/nbtutor)
[![Supported implementations](https://img.shields.io/pypi/implementation/nbtutor.svg?style=flat)](https://pypi.org/project/nbtutor)
[![Conda version](https://img.shields.io/conda/vn/conda-forge/nbtutor.svg)](https://anaconda.org/conda-forge/nbtutor)
[![Conda downloads](https://img.shields.io/conda/dn/conda-forge/nbtutor.svg)](https://anaconda.org/conda-forge/nbtutor)

[![Angular test status](https://github.com/lgpage/nbtutor/actions/workflows/anguler-test.yml/badge.svg?branch=main)](https://github.com/lgpage/nbtutor/actions/workflows/angular-test.yml?query=branch%3Amain)
[![Python check status](https://github.com/lgpage/nbtutor/actions/workflows/python-check.yml/badge.svg?branch=main)](https://github.com/lgpage/nbtutor/actions/workflows/python-check.yml?query=branch%3Amain)
[![Python test status](https://github.com/lgpage/nbtutor/actions/workflows/python-test.yml/badge.svg?branch=main)](https://github.com/lgpage/nbtutor/actions/workflows/python-test.yml?query=branch%3Amain)

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/lgpage/nbtutor/HEAD)

## Install

Note: installing directly off this repo won't work, as we don't ship the built JavaScript and CSS assets.
See more about [developing](#developing) below.

### `pip`

```shell
pip install nbtutor
jupyter nbextension install --overwrite --py nbtutor
jupyter nbextension enable --py nbtutor
```

### `conda`

```shell
conda install -c conda-forge nbtutor
jupyter nbextension install --overwrite --py nbtutor
jupyter nbextension enable --py nbtutor
```

## Usage (Jupyter Notebook)

First load the `nbtutor` IPython kernel extension at top of the Notebook by executing the following magic in a
`CodeCell`:

```python
%load_ext nbtutor
```

Then to visualize the execute of code in a `CodeCell` add the following magic to the top of the `CodeCell`
and execute it again:

```python
%%nbtutor
```

### Optional Arguments

There are also optional arguments that can be used with the cell magic:

- Reset the IPython user namespace

  ```python
  %%nbtutor -r/--reset
  ```

- Suppress the confirmation message from `-r/--reset`

  ```python
  %%nbtutor -r/--reset -f/--force
  ```

- Specify the maximum frame depth to visualize (default: 3)

  ```python
  %%nbtutor -d/--depth N
  ```

- Specify the maximum number of elements to visualize for "sequence"
   type objects (default: 5)

  ```python
  %%nbtutor --max_size S
  ```

- Step through all frames (including frames from other cells and other
   global scopes altogether)

  ```python
  %%nbtutor --step_all
  ```

### Notes

- If you find a problem please feel free to submit a [GitHub Issue]

## Develop

Please see the [CONTRIBUTING](CONTRIBUTING.md) and [DEVELOPMENT.md](DEVELOPMENT.md) guides

[Jupyter Notebook]: https://jupyter.org
[Online Python Tutor]: http://pythontutor.com/index.html
[GitHub Issue]: https://github.com/lgpage/nbtutor/issues
