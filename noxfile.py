import nox


@nox.session(python=["3.7", "3.8", "3.9", "3.10"])
def test(session):
    session.install("ipykernel")

    session.install("pytest")
    session.install("pytest-cov")
    session.install("pytest-mock")
    session.install("coverage")

    session.run("pytest", "--cov", "--cov-report=term-missing", "-vv", "tests", "nbtutor")
