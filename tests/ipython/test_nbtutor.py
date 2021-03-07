from nbtutor import _jupyter_server_extension_paths, _jupyter_nbextension_paths


def test_nbtutor_init():
    server_ext_paths = _jupyter_server_extension_paths()
    nbextension_paths = _jupyter_nbextension_paths()

    assert len(server_ext_paths) == 1
    assert server_ext_paths[0]["module"] == "nbtutor"

    assert len(nbextension_paths) == 1
    assert nbextension_paths[0]["section"] == "notebook"
    assert nbextension_paths[0]["src"] == "static"
    assert nbextension_paths[0]["dest"] == "nbtutor"
    assert nbextension_paths[0]["require"] == "nbtutor/nbtutor.notebook"
