import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UpdateEvent } from '@app/models';
import { CommActions, ComponentActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockTraceStepData } from '@app/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EventService } from './event.service';
import { JupyterService } from './jupyter.service';
import { LoggerService } from './logger.service';
import { NbtutorService } from './nbtutor.service';

@Injectable()
class NbtutorServiceExposed extends NbtutorService {
  _name: string;
  _production: boolean;
}

describe('NbtutorService', () => {
  let exposed: NbtutorServiceExposed;
  let service: NbtutorService;
  let store: MockStore<NbtutorState>;

  let cell: NotebookCell;
  let action: UpdateEvent;

  let jupyterServiceSpy: jasmine.SpyObj<JupyterService>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const output_area: OutputArea = { clear_output() { }, handle_output() { } };

    action = { action: 'toggleVisualization', cell: null };
    cell = { cell_id: 'id', cell_type: 'code', element: null, metadata: {}, output_area };

    jupyterServiceSpy = jasmine.createSpyObj<JupyterService>('JupyterService', ['initNotebookNamespace']);
    loggerServiceSpy = jasmine.createSpyObj<LoggerService>('LoggerService', ['logDebug', 'logWarning']);

    TestBed.configureTestingModule({
      providers: [
        NbtutorServiceExposed,
        provideMockStore<NbtutorState>(),
        { provide: JupyterService, useValue: jupyterServiceSpy },
        { provide: EventService, useValue: {} },
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: MockTraceStepData, useValue: { traceStepdata: [] } },
      ]
    });

    store = TestBed.inject(MockStore);
    exposed = TestBed.inject(NbtutorServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the correct name', () => {
    expect(`${exposed._name}Exposed`).toEqual(service.constructor.name);
  });

  it('should log the version', () => {
    expect(loggerServiceSpy.logWarning).toHaveBeenCalledWith('nbtutor version', environment.version);
  });

  describe('initForNotebook', () => {
    it('should call expected methods', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const jupyter = {} as NotebookNamespace;
      const events = {} as NotebookEvents;
      exposed._production = false;

      service.initForNotebook(jupyter, events);

      expect(jupyterServiceSpy.initNotebookNamespace).toHaveBeenCalledWith(jupyter, events);
      expect(dispatchSpy).toHaveBeenCalledWith(ComponentActions.addMainToolbarButtonsToNotebook());
      expect(dispatchSpy).toHaveBeenCalledWith(CommActions.setData({ msgId: 'id', traceSteps: [] }));
    });
  });
});
