import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JupyterPlatform } from '@app/constants';
import { filterTruthy, shareReplayFirst } from '@app/helpers/observables';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class JupyterService {
  protected _name = 'JupyterService';
  protected _jupyterPlatformSubject$ = new BehaviorSubject<JupyterPlatform>('none');
  protected _notebookNamespaceSubject$ = new BehaviorSubject<NotebookNamespace>(null);
  protected _notebookEventsSubject$ = new BehaviorSubject<NotebookEvents>(null);

  protected _jupyterPlatformObservable$ = this._jupyterPlatformSubject$.asObservable();
  protected _notebookNamespaceObservable$ = this._notebookNamespaceSubject$.asObservable();
  protected _notebookEventsObservable$ = this._notebookEventsSubject$.asObservable();

  get jupyterPlatform$(): Observable<JupyterPlatform> {
    return this._jupyterPlatformObservable$;
  }

  get notebookNamespace$(): Observable<NotebookNamespace> {
    return this._notebookNamespaceObservable$.pipe(
      filterTruthy(),
      shareReplayFirst(),
    );
  }

  get notebookEvents$(): Observable<NotebookEvents> {
    return this._notebookEventsObservable$.pipe(
      filterTruthy(),
      shareReplayFirst(),
    );
  }

  get notebook$(): Observable<Notebook> {
    return this.notebookNamespace$.pipe(
      map(namespace => namespace.notebook),
    );
  }

  constructor(
    protected _loggerSvc: LoggerService,
  ) { }

  initNotebookNamespace(jupyter: NotebookNamespace, events: NotebookEvents): void {
    if (!!jupyter) {
      this._notebookNamespaceSubject$.next(jupyter);
    }

    if (!!events) {
      this._notebookEventsSubject$.next(events);
    }

    this._jupyterPlatformSubject$.next('notebook');
    this._loggerSvc.logDebug(`${this._name} >> Notebook platform`, { platform: 'notebook', jupyter, events });
  }
}
