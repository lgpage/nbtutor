import { merge, Observable, timer } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HasSubscriptionsDirective, switchMapNodeEvent } from '@app/helpers';
import { CommActions, VisualizationActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { Store } from '@ngrx/store';
import { NotebookEvents } from '../constants';
import { JupyterService } from './jupyter.service';
import { LoggerService } from './logger.service';
import { NotebookService } from './notebook.service';

@Injectable({
  providedIn: 'root',
})
export class EventService extends HasSubscriptionsDirective {
  protected _name = 'EventService';
  protected _pollTime = 10 * 60 * 1000;  // 10 minutes

  constructor(
    protected _jupyterSvc: JupyterService,
    protected _notebookSvc: NotebookService,
    protected _loggerSvc: LoggerService,
    protected _store: Store<NbtutorState>,
  ) {
    super();
    this.initObservables();
    this.subscribeToObservables();
    this._loggerSvc.logDebug(`${this._name} >> constructor`);
  }

  protected getNotebookEventsOnEvent(event: string): Observable<NotebookEvents> {
    return this._jupyterSvc.notebookEvents$.pipe(
      switchMapNodeEvent(event),
    );
  }

  protected getSyncData(): Observable<boolean> {
    const notebookSaved$ = this.getNotebookEventsOnEvent(NotebookEvents.NotebookSaved).pipe(
      tap((events) => this._loggerSvc.logDebug(`${this._name} >> notebookSaved$`, { events })),
      map(() => true),
    );

    return merge(notebookSaved$, timer(this._pollTime, this._pollTime)).pipe(
      tap((args) => this._loggerSvc.logDebug(`${this._name} >> syncData$`, { args })),
      tap(() => this._store.dispatch(VisualizationActions.syncData())),
      map(() => true),
    );
  }

  protected getKernelReady(): Observable<boolean> {
    return this.getNotebookEventsOnEvent(NotebookEvents.KernelReady).pipe(
      startWith('Start With Ready'),
      tap((events) => this._loggerSvc.logDebug(`${this._name} >> kernelReady$`, { events })),
      map(() => true),
    );
  }

  protected getInitCommManager(kernelReady$: Observable<boolean>): Observable<CommManager> {
    return kernelReady$.pipe(
      tap((kernelReady) => this._loggerSvc.logDebug(`${this._name} >> getInitCommManager`, { kernelReady })),
      switchMap(() => this._notebookSvc.getCommManager()),
      tap((commManager) => {
        this._loggerSvc.logDebug(`${this._name} >> getInitCommManager`, { commManager });
        commManager.unregister_target('nbtutor_comm');
        commManager.register_target('nbtutor_comm', (comm) => {
          comm.on_msg((msg) => {
            this._loggerSvc.logDebug(`${this._name} >> getInitCommManager`, { msg, comm });
            const msgId = msg.parent_header.msg_id;
            const traceSteps = msg.content.data;
            this._store.dispatch(CommActions.setData({ msgId, traceSteps }));
          });
        });
      }),
    );
  }

  protected initObservables(): void {
    const syncData$ = this.getSyncData();
    const kernelReady$ = this.getKernelReady();
    const commManager$ = this.getInitCommManager(kernelReady$);

    this._observables = [syncData$, commManager$];
  }
}
