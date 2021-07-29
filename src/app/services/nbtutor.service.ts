import { environment } from 'environments/environment';
import { Injectable, Optional } from '@angular/core';
import { CommActions, ComponentActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockTraceStepData } from '@app/testing/mock-tracestep-data';
import { Store } from '@ngrx/store';
import { EventService } from './event.service';
import { JupyterService } from './jupyter.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class NbtutorService {
  protected _name = 'NbtutorService';
  protected _production = environment.production;

  constructor(
    protected _jupyterSvc: JupyterService,
    protected _eventSvc: EventService,
    protected _loggerSvc: LoggerService,
    protected _store: Store<NbtutorState>,
    @Optional() protected _mockTraceStepData: MockTraceStepData,
  ) {
    this._loggerSvc.logWarning('nbtutor version', environment.version);
    this._loggerSvc.logDebug(`${this._name} >> constructor`);
  }

  initForNotebook(jupyter: NotebookNamespace, events: NotebookEvents): void {
    this._jupyterSvc.initNotebookNamespace(jupyter, events);
    this._store.dispatch(ComponentActions.addMainToolbarButtonsToNotebook());

    if (!environment.production && !!this._mockTraceStepData) {
      const traceSteps = this._mockTraceStepData.traceStepdata;
      this._loggerSvc.logDebug(`${this._name} >> initForNotebook >> using mock data`, { data: traceSteps });
      this._store.dispatch(CommActions.setData({ msgId: 'id', traceSteps }));
    }
  }
}
