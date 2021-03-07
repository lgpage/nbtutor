import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeCell, LineMarker, LineMarkerType, TraceStep } from '@app/models';
import { VisualizationData } from '@app/models/visualization';
import { CodeMirrorActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CellDataService } from './cell-data.service';
import { CodeMirrorService } from './code-mirror.service';

@Injectable()
class CodeMirrorServiceExposed extends CodeMirrorService {
  _observables: Observable<any>[];

  initObservables(): void {
    return super.initObservables();
  }

  getEditorOnEvent(event: string): Observable<CodeMirror.Editor> {
    return super.getEditorOnEvent(event);
  }

  getHasLineNumbers(): Observable<boolean> {
    return super.getHasLineNumbers();
  }

  getToggleMarkers(hasLineNumbers$: Observable<boolean>): Observable<boolean> {
    return super.getToggleMarkers(hasLineNumbers$);
  }

  getCellDataSetter(hasLineNumbers$: Observable<boolean>): Observable<boolean> {
    return super.getCellDataSetter(hasLineNumbers$);
  }

  getDispatchCodeChanged(): Observable<CodeCell> {
    return super.getDispatchCodeChanged();
  }

  setGuttersOption(editor: CodeMirror.Editor): void {
    return super.setGuttersOption(editor);
  }

  toggleLineMarkers(hasMarkers: boolean, editor: CodeMirror.Editor, lineMarkers: LineMarker[]): boolean {
    return super.toggleLineMarkers(hasMarkers, editor, lineMarkers);
  }

  createMarkerElement(type: LineMarkerType): HTMLElement {
    return super.createMarkerElement(type);
  }

  subscribeToObservables(): void { }
}

describe('CodeMirrorService', () => {
  let exposed: CodeMirrorServiceExposed;
  let service: CodeMirrorService;

  let cell: CodeCell;
  let traceStep: TraceStep;
  let data: VisualizationData;
  let lineMarkers: LineMarker[];
  let store: MockStore<NbtutorState>;

  let getEditorOnEventSpy: jasmine.Spy;
  let editorSpy: jasmine.SpyObj<CodeMirror.Editor>;
  let cellDataServiceSpy: jasmine.SpyObj<CellDataService>;

  beforeEach(() => {
    cellDataServiceSpy = jasmine.createSpyObj<CellDataService>('CellDataService', ['setCodeCell', 'setHasLineNumbers']);
    editorSpy = jasmine.createSpyObj<CodeMirror.Editor>(
      'Editor',
      ['getOption', 'setOption', 'clearGutter', 'on', 'off', 'setGutterMarker']
    );

    lineMarkers = [];
    traceStep = { heap: {}, stdout: 'stdout', lineMarkers } as TraceStep;
    data = { cellId: 'id', step: 0, maxSteps: 4, visualize: true, data: [traceStep] };
    cell = {
      cell_id: 'id',
      cell_type: 'code',
      element: null,
      metadata: { nbtutor: data },
      output_area: null,
      code_mirror: editorSpy,
    };

    cellDataServiceSpy.cell$ = cold('0', [cell]);
    cellDataServiceSpy.traceStep$ = cold('0', [traceStep]);
    cellDataServiceSpy.visualization$ = cold('0', [data]);

    TestBed.configureTestingModule({
      providers: [
        CodeMirrorServiceExposed,
        provideMockStore<NbtutorState>(),
        { provide: CellDataService, useValue: cellDataServiceSpy },
      ]
    });

    store = TestBed.inject(MockStore);
    exposed = TestBed.inject(CodeMirrorServiceExposed);
    service = exposed;

    getEditorOnEventSpy = spyOn(exposed, 'getEditorOnEvent').and.returnValue(cold('0', [editorSpy]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('property observables', () => {
    it('should emit expected values', () => {
      expect(service.editor$).toBeObservable(cold('0', [editorSpy]));
      expect(service.visualization$).toBeObservable(cold('0', [data]));
      expect(service.lineMarkers$).toBeObservable(cold('0', [lineMarkers]));
    });
  });

  describe('getHasLineNumbers', () => {
    it('should emit expected result and call expected methods', () => {
      editorSpy.getOption.and.returnValue(true);

      expect(exposed.getHasLineNumbers()).toBeObservable(cold('0', [true]));

      expect(getEditorOnEventSpy).toHaveBeenCalled();
      expect(editorSpy.getOption).toHaveBeenCalledWith('lineNumbers');
    });
  });

  describe('getToggleMarkers', () => {
    it('should emit expected result and call expected methods', () => {
      const hasLineNumbers$ = cold('0', [true]);
      const toggleLineMarkersSpy = spyOn(exposed, 'toggleLineMarkers').and.returnValue(true);

      expect(exposed.getToggleMarkers(hasLineNumbers$)).toBeObservable(cold('0', [true]));

      expect(toggleLineMarkersSpy).toHaveBeenCalledWith(true, editorSpy, lineMarkers);
    });
  });

  describe('getCellDataSetter', () => {
    it('should emit expected result and call expected methods', () => {
      const hasLineNumbers$ = cold('0', [true]);

      expect(exposed.getCellDataSetter(hasLineNumbers$)).toBeObservable(cold('0', [true]));
      expect(cellDataServiceSpy.setHasLineNumbers).toHaveBeenCalledWith(true);
    });
  });

  describe('getDispatchCodeChanged', () => {
    it('should emit expected result and call expected methods', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const dipatchCodeChanges$ = exposed.getDispatchCodeChanged();

      expect(dipatchCodeChanges$).toBeTruthy();
      getTestScheduler().run(({ expectObservable }) => {
        expectObservable(dipatchCodeChanges$).toBe('0', [cell]);
      });

      expect(dispatchSpy).toHaveBeenCalledWith(CodeMirrorActions.codeChanged({ id: 'id' }));
    });
  });

  describe('initObservables', () => {
    it('should call expected methods', () => {
      const hasLineNumber$ = cold('0', [true]);

      const getHasLineNumbersSpy = spyOn(exposed, 'getHasLineNumbers').and.returnValue(hasLineNumber$);
      const getToggleMarkersSpy = spyOn(exposed, 'getToggleMarkers').and.returnValue(cold('0', [true]));
      const getCellDataSetterSpy = spyOn(exposed, 'getCellDataSetter').and.returnValue(cold('0', [true]));
      const getDispatchCodeChangedSpy = spyOn(exposed, 'getDispatchCodeChanged').and.returnValue(cold('0', [cell]));

      exposed.initObservables();

      expect(getHasLineNumbersSpy).toHaveBeenCalled();
      expect(getToggleMarkersSpy).toHaveBeenCalledWith(hasLineNumber$);
      expect(getCellDataSetterSpy).toHaveBeenCalledWith(hasLineNumber$);
      expect(getDispatchCodeChangedSpy).toHaveBeenCalled();
    });

    describe('setGutterOptions$', () => {
      it('should call expected methods', () => {
        const setGuttersOptionSpy = spyOn(exposed, 'setGuttersOption');

        exposed.initObservables();
        const setGutterOptions$ = exposed._observables[3];

        expect(setGutterOptions$).toBeObservable(cold('(0|)', [editorSpy]));
        expect(setGuttersOptionSpy).toHaveBeenCalledWith(editorSpy);
      });
    });
  });

  describe('setGuttersOption', () => {
    describe('when gutters has nbtutor line markers', () => {
      it('should call expected methods', () => {
        editorSpy.getOption.and.returnValue(['nbtutor-linemarkers']);

        exposed.setGuttersOption(editorSpy);

        expect(editorSpy.getOption).toHaveBeenCalledWith('gutters');
        expect(editorSpy.setOption).not.toHaveBeenCalled();
      });
    });

    describe('when gutters does not have nbtutor line markers', () => {
      it('should call expected methods', () => {
        editorSpy.getOption.and.returnValue([]);

        exposed.setGuttersOption(editorSpy);

        expect(editorSpy.getOption).toHaveBeenCalledWith('gutters');
        expect(editorSpy.setOption).toHaveBeenCalledWith('lineNumbers', true);
        expect(editorSpy.setOption).toHaveBeenCalledWith('gutters', ['nbtutor-linemarkers']);
      });
    });
  });

  describe('toggleLineMarkers', () => {
    describe('when has markers is true', () => {
      it('should call expected methods', () => {
        const marker: LineMarker = { type: 'current', lineNumber: 2 };
        const createMarkerElementSpy = spyOn(exposed, 'createMarkerElement').and.returnValue({} as HTMLElement);

        expect(exposed.toggleLineMarkers(true, editorSpy, [marker])).toBeTrue();

        expect(editorSpy.clearGutter).toHaveBeenCalled();
        expect(editorSpy.setGutterMarker).toHaveBeenCalledWith(2, 'nbtutor-linemarkers', {} as HTMLElement);
        expect(createMarkerElementSpy).toHaveBeenCalledWith('current');
      });
    });

    describe('when has markers is false', () => {
      it('should call expected methods', () => {
        expect(exposed.toggleLineMarkers(false, editorSpy, [])).toBeFalse();

        expect(editorSpy.clearGutter).toHaveBeenCalled();
        expect(editorSpy.setGutterMarker).not.toHaveBeenCalled();
      });
    });
  });

  describe('createMarkerElement', () => {
    it('should return the expected result', () => {
        const element = exposed.createMarkerElement('current');
        expect(element.nodeName).toEqual('I');
        expect(element.classList).toContain('fa');
        expect(element.classList).toContain('fa-lg');
        expect(element.classList).toContain('fa-long-arrow-right');
        expect(element.classList).toContain('nbtutor');
    });

    describe('when type is previous', () => {
      it('should return the expected result', () => {
        const element = exposed.createMarkerElement('previous');
        expect(element.classList).toContain('previous-line');
      });
    });

    describe('when type is current', () => {
      it('should return the expected result', () => {
        const element = exposed.createMarkerElement('current');
        expect(element.classList).toContain('current-line');
      });
    });

    describe('when type is next', () => {
      it('should return the expected result', () => {
        const element = exposed.createMarkerElement('next');
        expect(element.classList).toContain('next-line');
      });
    });
  });
});
