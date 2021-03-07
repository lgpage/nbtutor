
# Develop

This assumes you have cloned this repository locally:

```shell
git clone https://github.com/lgpage/nbtutor.git
cd nbtutor
```

## Repo Architecture

- `./nbtutor/ipython`: Contains the `nbtutor` Jupyter server extension Python code
- `./nbtutor/static`: The Angular project, in `./src`, is build and bundled into this folder:
  - `nbtutor.min.css`: styles
  - `nbtutor.min.js`: runtime Javascript
  - `nbtutor.notebook.js`: This is the entry code / point for `nbtutor` Jupyter nbextension that loads and bootstraps
    the `nbtutor` elements, styles and runtime Javascript

## Getting Started

It is highly recommended to setup a virtual Python environment either via `venv` or `conda`.
For example, setting up a virtual Python environment using `venv`:

```shell
python -m venv .venv
```

After which the environment can be activated from one of the relevant (depending on your OS) activation scripts
in `.venv/Scripts`. For example using PowerShell in Windows:

```ps
.\.venv\Scripts\Activate.ps1
```

The commonly use command for linting, building, testing, ect. are saved as scripts in the `package.json` file and can
be run using `npm`, for example:

- `npm run test:all` will run the tests for the Angular code as well as the tests for the Python code

## Angular

### Dependencies

The Angular package dependencies can be installed with `npm`:

```shell
npm install
```

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
Use the `--prod` flag for a production build.

Running `npm run build:ui` will create a production build and bundle the build into `nbtutor/static`.

### Test

Run `ng test` to execute the unit tests via [Karma].

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you
change any of the source files.

### Code Scaffolding

The Angular side of the project was generated with the [Angular CLI] version 7.1.4.
Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README].

## Python

### Test

Run `npm run test:python` to execute the unit tests via [pytest].

### Installing the nbextension

Run `python setup.py develop` to install the Jupyter server extension. This should only be needed once.

Run `npm run extension:update` to create a production build of the Angular code, bundle the build files into
`nbtutor/static` and install / update the Jupyter nbextension. This needs to be done after every Angular code change to
test in Jupyter Notebook. Python code changes won't require this.

If you are using a Unix base OS or running your shell / IDE with elevated privileges on Windows then you should rather
use the following to ensure that you always get the right assets (for development) without needing to re-run the
`npm run extension:update` command with each Angular code change:

```shell
jupyter nbextension install --overwrite --symlink --sys-prefix --py nbtutor
jupyter nbextension enable --sys-prefix --py nbtutor
```

The `--sym-link` option creates a symbolic link to the `nbtutor/static` folder and as such any Angular code changes
will then only need the `run npm build:ui` command to be run.

[Angular CLI]: https://github.com/angular/angular-cli
[Angular CLI README]: https://github.com/angular/angular-cli/blob/master/README.md
[Karma]: https://karma-runner.github.io
[pytest]: https://docs.pytest.org/en/stable/
