from setuptools import setup, find_packages
from os import path

version = {}
this_directory = path.abspath(path.dirname(__file__))

with open(path.join(this_directory, 'README.md'), encoding='utf-8') as readme_file:
    long_description = readme_file.read()

with open(path.join(this_directory, 'nbtutor', 'version.py'), encoding='utf-8') as version_file:
    exec(version_file.read(), version)

setup(
    name="nbtutor",
    version=version['__version__'],
    description="Visualize Python code execution in Jupyter Notebook cells",
    long_description=long_description,
    long_description_content_type='text/markdown',
    author="Logan Page",
    author_email="page.lg@gmail.com",
    license="BSD 3-Clause",
    url='https://github.com/lgpage/nbtutor',
    keywords="ipython jupyter notebook python tutor visualize code execution",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Framework :: IPython",
        "Programming Language :: Python",
        "License :: OSI Approved :: BSD License"
    ],
    packages=find_packages(include=["nbtutor"]),
    install_requires=["notebook"],
    include_package_data=True,
)
