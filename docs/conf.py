#!/usr/bin/env python
# encoding: utf-8
import os

from nbtutor._version import __version__


extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.coverage',
    'sphinx.ext.doctest',
    'sphinx.ext.extlinks',
    'sphinx.ext.ifconfig',
    'sphinx.ext.intersphinx',
    'sphinx.ext.mathjax',
    'sphinx.ext.napoleon',
    'sphinx.ext.todo',
    'sphinx.ext.viewcode',
]

if os.getenv('SPELLCHECK'):
    extensions += 'sphinxcontrib.spelling',
    spelling_show_suggestions = True
    spelling_lang = 'en_US'

source_suffix = '.rst'
master_doc = 'index'
project = 'nbtutor'
year = '2016'
author = 'Logan Page'
copyright = '{0}, {1}'.format(year, author)
version = __version__
release = __version__

language = None
todo_include_todos = True
pygments_style = 'sphinx'
templates_path = ['_templates']

napoleon_google_docstring = True
napoleon_include_private_with_doc = True
napoleon_include_special_with_doc = True
napoleon_use_ivar = True
napoleon_use_rtype = True
napoleon_use_param = True

htmlhelp_basename = 'nbtutordoc'

html_theme = 'alabaster'
html_use_smartypants = True
html_last_updated_fmt = '%b %d, %Y'
html_split_index = False
html_sidebars = {
   '**': ['searchbox.html', 'globaltoc.html', 'sourcelink.html'],
}
html_short_title = '%s-%s' % (project, version)

latex_elements = {}
latex_documents = [
    (master_doc, 'nbtutor.tex', 'nbtutor Documentation',
     'Logan Page', 'manual'),
]
man_pages = [(master_doc, 'nbtutor', 'nbtutor Documentation', [author], 1)]
texinfo_documents = [
    (master_doc, 'nbtutor', 'nbtutor Documentation', author, 'nbtutor',
     'One line description of project.', 'Miscellaneous'),
]
intersphinx_mapping = {
    'python': ('https://docs.python.org/3.5', None),
    'numpy': ('http://docs.scipy.org/doc/numpy/', None),
}


def run_apidoc(_):
    from sphinx.apidoc import main

    src_dir = os.path.abspath('nbtutor')
    if os.getcwd().endswith('docs'):  # hack to get rtfd to work
        src_dir = os.path.abspath('../nbtutor')

    docs_dir = os.path.abspath(os.path.dirname(__file__))
    api_dir = os.path.join(docs_dir, 'api')
    main(['-f', '-P', '-e', '-o', api_dir, src_dir, '--force'])


def setup(app):
    app.connect('builder-inited', run_apidoc)
