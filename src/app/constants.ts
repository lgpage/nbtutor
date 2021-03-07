import * as _NotebookActions from './constants/notebook-actions';
import * as _NotebookEvents from './constants/notebook-events';

export type JupyterPlatform = 'none' | 'notebook' | 'lab';

export * from './constants/visualization-method';
export * from './constants/log-level';

export const NotebookActions = _NotebookActions;
export const NotebookEvents = _NotebookEvents;

export const NotebookMainToolbarContainerId = 'maintoolbar-container';
export const CellInputAreaSelector = '.inner_cell > .input_area';
export const CellInnerSelector = '.inner_cell';

export const LineMarkerClassPrevious = 'nbtutor previous-line';
export const LineMarkerClassCurrent = 'nbtutor current-line';
export const LineMarkerClassNext = 'nbtutor next-line';
export const CodeMirrorGutterId = 'nbtutor-linemarkers';

export const MainButtonGroupId = 'nbtutor-main-btn-group';
export const StepButtonGroupId = 'nbtutor-step-btn-group';
