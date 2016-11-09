# coding: utf-8
# flake8: noqa
from os.path import join

from ._version import __version__
from ._version import __version_info__


# Jupyter Extension points
def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        src=join("static", "nbtutor"),
        dest="nbtutor",
        require="nbtutor/js/nbtutor.min")]


# def _jupyter_server_extension_paths():
#     return [dict(module="nbtutor")]


# serverextension
# def load_jupyter_server_extension(nbapp):
#     nbapp.log.info("✓ nbtutor HTML export ENABLED")
#     exporter_map.update(
#         nbtutor=PresentExporter,
#     )

#     if pdf_import_error:
#         nbapp.log.warn(
#             "✗ nbtutor PDF export DISABLED: {}"
#             .format(pdf_import_error)
#         )
#     else:
#         nbapp.log.info("✓ nbtutor PDF export ENABLED")
#         exporter_map.update(
#             nbpresent_pdf=PDFPresentExporter
#         )
