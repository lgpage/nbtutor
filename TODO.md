## TODO List:
- Render class and instance objects
- Add marker and table legends
- Args: Cutoff sequence size/length
- Test on python2.7
- Remove the word 'frame' ??
- Package (pip and conda)

## Long Term:
- Include docs, tests and CI
- Add numpy ndarray visualization
- Language agnostic
- JupyterLab

## Issues:
- lineno+1 is wrong for any/all frame code objects not created with cell magic.
- Issues with import functions / objects
    - Seemingly "duplicate" frames
    - Linenos from any/all frame code objects not created in Jupyter (the
      IPython shell) should be ignored (set to 0).
- Include IPythons `Out[]` output
- Handle outputs better using IPython API
- Kernel reset should clear all visualizations
- Some duplicate code that can be refactored (render memory)
- Run all cells triggers multiple toolbar re-builds
