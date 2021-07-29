import { cold, hot } from 'jasmine-marbles';
import { combineLatest, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JupyterPlatform } from '@app/constants';
import { JupyterService } from './jupyter.service';

@Injectable()
class JupyterServiceExposed extends JupyterService {
  get name(): string {
    return this._name;
  }

  get jupyterPlatformObservable$(): Observable<JupyterPlatform> {
    return this._jupyterPlatformObservable$;
  }

  set jupyterPlatformObservable$(value$: Observable<JupyterPlatform>) {
    this._jupyterPlatformObservable$ = value$;
  }

  get notebookNamespaceObservable$(): Observable<NotebookNamespace> {
    return this._notebookNamespaceObservable$;
  }

  set notebookNamespaceObservable$(value$: Observable<NotebookNamespace>) {
    this._notebookNamespaceObservable$ = value$;
  }

  get notebookEventsObservable$(): Observable<NotebookEvents> {
    return this._notebookEventsObservable$;
  }

  set notebookEventsObservable$(value$: Observable<NotebookEvents>) {
    this._notebookEventsObservable$ = value$;
  }

  emitJupyterPlatform(value: JupyterPlatform): void {
    this._jupyterPlatformSubject$.next(value);
  }
}

describe('NotebookService', () => {
  let exposed: JupyterServiceExposed;
  let service: JupyterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JupyterServiceExposed,
      ]
    });

    exposed = TestBed.inject(JupyterServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the correct name', () => {
    expect(`${exposed.name}Exposed`).toEqual(service.constructor.name);
  });

  describe('jupyterPlatform$', () => {
    it('should emit values as expected', () => {
      exposed.jupyterPlatformObservable$ = hot('abc');
      expect(service.jupyterPlatform$).toBeObservable(cold('abc'));
    });
  });

  describe('notebookNamespace$', () => {
    it('should emit values as expected', () => {
      const ns1 = {} as NotebookNamespace;
      const ns2 = {} as NotebookNamespace;

      exposed.notebookNamespaceObservable$ = hot('nab', { n: null, a: ns1, b: ns2 });
      expect(service.notebookNamespace$).toBeObservable(cold('-(a|)', { a: ns1 }));
    });
  });

  describe('notebookEvents$', () => {
    it('should emit values as expected', () => {
      const e1 = {} as NotebookEvents;
      const e2 = {} as NotebookEvents;

      exposed.notebookEventsObservable$ = hot('nab', { n: null, a: e1, b: e2 });
      expect(service.notebookEvents$).toBeObservable(cold('-(a|)', { a: e1 }));
    });
  });

  describe('notebook$', () => {
    it('should emit values as expected', () => {
      const nb = {} as Notebook;
      const ns = { notebook: nb } as NotebookNamespace;
      const notebookNamespace$Spy = spyOnProperty(service, 'notebookNamespace$');

      notebookNamespace$Spy.and.returnValue(hot('aa', { a: ns }));
      expect(service.notebook$).toBeObservable(cold('nn', { n: nb }));
      expect(notebookNamespace$Spy).toHaveBeenCalled();
    });
  });

  describe('initNotebookNamespace$', () => {
    it('should emit values as expected', (done) => {
      const events = {} as NotebookEvents;
      const namespace = {} as NotebookNamespace;

      service.initNotebookNamespace(namespace, events);

      combineLatest([
        exposed.jupyterPlatformObservable$,
        exposed.notebookNamespaceObservable$,
        exposed.notebookEventsObservable$
      ]).pipe(
        first(),
      ).subscribe(([p, ns, e]) => {
        expect(p).toEqual('notebook');
        expect(ns).toBe(namespace);
        expect(e).toBe(events);
        done();
      });
    });
  });
});
