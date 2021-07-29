import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommTraceStep } from '@app/models';
import { CommActions, VisualizationActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EventService } from './event.service';
import { JupyterService } from './jupyter.service';
import { NotebookService } from './notebook.service';

@Injectable()
class EventServiceExposed extends EventService {
  _observables: Observable<any>[];

  getInitCommManager(kernelReady$: Observable<boolean>): Observable<CommManager> {
    return super.getInitCommManager(kernelReady$);
  }

  initObservables(): void {
    return super.initObservables();
  }

  getNotebookEventsOnEvent(event: string): Observable<NotebookEvents> {
    return super.getNotebookEventsOnEvent(event);
  }

  getSyncData(): Observable<boolean> {
    return super.getSyncData();
  }

  getKernelReady(): Observable<boolean> {
    return super.getKernelReady();
  }

  subscribeToObservables(): void { }
}

describe('EventService', () => {
  let exposed: EventServiceExposed;
  let service: EventService;
  let store: MockStore<NbtutorState>;

  let getNotebookEventsOnEventSpy: jasmine.Spy;
  let jupyterServiceSpy: jasmine.SpyObj<JupyterService>;
  let notebookEventsSpy: jasmine.SpyObj<NotebookEvents>;
  let notebookServiceSpy: jasmine.SpyObj<NotebookService>;

  beforeEach(() => {
    notebookEventsSpy = jasmine.createSpyObj<NotebookEvents>('NotebookEvents', ['on', 'off']);
    notebookServiceSpy = jasmine.createSpyObj<NotebookService>('NotebookService', ['getMsgCell', 'getCommManager']);
    jupyterServiceSpy = jasmine.createSpyObj<JupyterService>(
      'JupyterService',
      ['initNotebookNamespace'],
      // eslint-disable-next-line
      { 'notebookEvents$': cold('0', [notebookEventsSpy]) }
    );

    TestBed.configureTestingModule({
      providers: [
        EventServiceExposed,
        provideMockStore<NbtutorState>(),
        { provide: NotebookService, useValue: notebookServiceSpy },
        { provide: JupyterService, useValue: jupyterServiceSpy },
      ]
    });

    store = TestBed.inject(MockStore);
    exposed = TestBed.inject(EventServiceExposed);
    service = exposed;

    getNotebookEventsOnEventSpy = spyOn(exposed, 'getNotebookEventsOnEvent').and.returnValue(cold('0', [notebookEventsSpy]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSyncData', () => {
    it('should call expected methods and emit expected result', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const syncData$ = exposed.getSyncData().pipe(take(2));

      expect(syncData$).toBeTruthy();
      getTestScheduler().run(({ expectObservable }) => {
        expectObservable(syncData$).toBe('0 599999ms (0|)', [true]);
      });

      expect(getNotebookEventsOnEventSpy).toHaveBeenCalledWith('notebook_saved.Notebook');
      expect(dispatchSpy).toHaveBeenCalledWith(VisualizationActions.syncData());
    });
  });

  describe('getKernelReady', () => {
    it('should call expected methods and emit expected result', () => {
      expect(exposed.getKernelReady()).toBeObservable(cold('(00)', [true]));
      expect(getNotebookEventsOnEventSpy).toHaveBeenCalledWith('kernel_ready.Kernel');
    });
  });

  describe('getInitCommManager', () => {
    it('should return expected observable', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const commTraceSteps: CommTraceStep[] = [];
      const commMessage: CommMessage = { content: { data: commTraceSteps }, parent_header: { msg_id: 'msgId' } };
      const commSpy = jasmine.createSpyObj<Comm>('Comm', ['on_msg']);
      const commManagerSpy = jasmine.createSpyObj<CommManager>('CommManager', ['unregister_target', 'register_target']);
      notebookServiceSpy.getCommManager.and.returnValue(cold('0', [commManagerSpy]));

      // ACT 1/3
      const result$ = exposed.getInitCommManager(cold('0', [true]));

      expect(result$).toBeObservable(cold('0', [commManagerSpy]));
      expect(notebookServiceSpy.getCommManager).toHaveBeenCalled();
      expect(commManagerSpy.unregister_target).toHaveBeenCalledWith('nbtutor_comm');
      expect(commManagerSpy.register_target).toHaveBeenCalledWith('nbtutor_comm', jasmine.any(Function));

      const registerArgs = commManagerSpy.register_target.calls.mostRecent().args;
      expect(registerArgs[0]).toEqual('nbtutor_comm');
      expect(registerArgs[1]).toBeTruthy();

      // ACT 2/3
      registerArgs[1](commSpy);

      const onMsgArgs = commSpy.on_msg.calls.mostRecent().args;
      expect(commSpy.on_msg).toHaveBeenCalledWith(jasmine.any(Function));
      expect(onMsgArgs[0]).toBeTruthy();

      // ACT 3/3
      onMsgArgs[0](commMessage);

      expect(dispatchSpy).toHaveBeenCalledWith(CommActions.setData({ msgId: 'msgId', traceSteps: commTraceSteps }));
    });
  });

  describe('initObservables', () => {
    it('should set observables as expected', () => {
      const kernelReady$ = cold('0', [true]);

      const getSyncDataSpy = spyOn(exposed, 'getSyncData').and.returnValue(cold('0', [true]));
      const getKernelReadySpy = spyOn(exposed, 'getKernelReady').and.returnValue(kernelReady$);
      const getInitCommManagerSpy = spyOn(exposed, 'getInitCommManager').and.returnValue(cold('0', [{} as CommManager]));

      exposed.initObservables();

      expect(getSyncDataSpy).toHaveBeenCalled();
      expect(getKernelReadySpy).toHaveBeenCalled();
      expect(getInitCommManagerSpy).toHaveBeenCalledWith(kernelReady$);
    });
  });
});
