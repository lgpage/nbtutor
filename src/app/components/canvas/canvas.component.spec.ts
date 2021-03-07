import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CodeCell } from '@app/models';
import { VisualizationData } from '@app/models/visualization';
import { CellDataService, CellService, CodeMirrorService, JsPlumbService } from '@app/services';
import { HeapComponent } from '../heap/heap.component';
import { StackComponent } from '../stack/stack.component';
import { CanvasComponent } from './canvas.component';

class CanvasComponentExposed extends CanvasComponent {
  _observables: Observable<any>[];

  documentContains(other: Node | null): boolean {
    return super.documentContains(other);
  }

  getElement$(cell$: Observable<CodeCell>): Observable<JQuery<HTMLElement>> {
    return super.getElement$(cell$);
  }

  getJsPlumbSetupEffect$(): Observable<any> {
    return super.getJsPlumbSetupEffect$();
  }

  getIsOrphanedTimer$(cell$: Observable<CodeCell>): Observable<boolean> {
    return super.getIsOrphanedTimer$(cell$);
  }

  getDetectChangesTimer$(): Observable<number> {
    return super.getDetectChangesTimer$();
  }

  subscribeToObservables(): void { }
}

describe('CanvasComponent', () => {
  let fixture: ComponentFixture<CanvasComponentExposed>;
  let exposed: CanvasComponentExposed;
  let component: CanvasComponent;

  let nativeElement: HTMLElement;

  let cellServiceSpy: jasmine.SpyObj<CellService>;
  let cellDataServiceSpy: jasmine.SpyObj<CellDataService>;
  let jsPlumbServiceSpy: jasmine.SpyObj<JsPlumbService>;
  let codeMirrorServiceSpy: jasmine.SpyObj<CodeMirrorService>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(waitForAsync(() => {
    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell', 'ngOnDestroy']);
    cellDataServiceSpy = jasmine.createSpyObj<CellDataService>('CellDataService', ['ngOnDestroy']);
    codeMirrorServiceSpy = jasmine.createSpyObj<CodeMirrorService>('CodeMirrorService', ['ngOnDestroy']);
    changeDetectorRefSpy = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);
    jsPlumbServiceSpy = jasmine.createSpyObj<JsPlumbService>(
      'JsPlumbService',
      ['setupJsPlumb', 'drawConnectors', 'repaintConnectors', 'ngOnDestroy']
    );

    cellServiceSpy.cell$ = of({} as CodeCell);
    cellServiceSpy.visualization$ = of({ error: 'whoops' } as VisualizationData);

    TestBed.configureTestingModule({
      declarations: [
        CanvasComponentExposed,
        MockComponent(HeapComponent),
        MockComponent(StackComponent),
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
      ]
    }).overrideComponent(
      CanvasComponentExposed,
      {
        set: {
          providers: [
            { provide: CellService, useValue: cellServiceSpy },
            { provide: CellDataService, useValue: cellDataServiceSpy },
            { provide: JsPlumbService, useValue: jsPlumbServiceSpy },
            { provide: CodeMirrorService, useValue: codeMirrorServiceSpy },
          ]
        }
      }
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponentExposed);

    nativeElement = fixture.nativeElement;

    exposed = fixture.componentInstance;
    component = exposed;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  describe('canvasDiv', () => {
    describe('when showVisualization is false', () => {
      it('should be hidden', () => {
        const showVisualizationSpy = spyOn(component, 'showVisualization').and.returnValue(false);
        fixture.detectChanges();

        const canvasDiv = nativeElement.querySelector('.canvas.d-flex-grow');

        expect(canvasDiv).toBeFalsy();
        expect(showVisualizationSpy).toHaveBeenCalled();
      });
    });

    describe('when showVisualization is false', () => {
      it('should be shown with children', () => {
        const showVisualizationSpy = spyOn(component, 'showVisualization').and.returnValue(true);
        fixture.detectChanges();

        const canvasDiv = nativeElement.querySelector('.canvas.d-flex-grow');
        const stackElement = nativeElement.querySelector('.stack.d-flex');
        const heapElement = nativeElement.querySelector('.heap.d-flex');

        expect(canvasDiv).toBeTruthy();
        expect(stackElement).toBeTruthy();
        expect(heapElement).toBeTruthy();

        expect(showVisualizationSpy).toHaveBeenCalled();
      });
    });
  });

  describe('errorMessageDiv', () => {
    describe('when there is no error message', () => {
      it('should be hidden', () => {
        const showErrorSpy = spyOn(component, 'showError').and.returnValue(false);

        fixture.detectChanges();
        const errorMessageDiv = nativeElement.querySelector('.canvas.error-message');

        expect(errorMessageDiv).toBeFalsy();
        expect(showErrorSpy).toHaveBeenCalled();
      });
    });

    describe('when there is an error message', () => {
      it('should be shown with children', () => {
        const showErrorSpy = spyOn(component, 'showError').and.returnValue(true);

        fixture.detectChanges();
        const errorMessageDiv = nativeElement.querySelector('.canvas.error-message');
        const pElement = nativeElement.querySelector('.canvas.error-message > p');

        expect(errorMessageDiv).toBeTruthy();
        expect(pElement).toBeTruthy();
        expect(pElement.textContent).toEqual('whoops');

        expect(showErrorSpy).toHaveBeenCalledWith({ error: 'whoops' } as VisualizationData);
      });
    });
  });

  describe('cellElement$', () => {
    describe('when cell in falsy', () => {
      it('should call expected methods and return expected results', () => {
        const cell$ = cold('0', [null]);

        const cellElement$ = exposed.getElement$(cell$);

        expect(cellElement$).toBeTruthy();
        getTestScheduler().run(({ expectObservable }) => {
          expectObservable(cellElement$).toBe('0', [null]);
        });
      });
    });

    describe('when cell in truthy', () => {
      it('should call expected methods and return expected results', () => {
        const element = {} as JQuery<HTMLElement>;
        const cell$ = cold('0', [{ element }]);

        const cellElement$ = exposed.getElement$(cell$);

        expect(cellElement$).toBeTruthy();
        getTestScheduler().run(({ expectObservable }) => {
          expectObservable(cellElement$).toBe('0', [element]);
        });
      });
    });
  });

  describe('setupJsPlumb$', () => {
    it('should call expected methods and return expected results', () => {
      const canvasRef = { nativeElement: {} } as ElementRef<HTMLElement>;
      component.canvasElementRef = canvasRef;

      const setupJsPlumb$ = exposed.getJsPlumbSetupEffect$();

      expect(setupJsPlumb$).toBeTruthy();
      getTestScheduler().run(({ expectObservable }) => {
        expectObservable(setupJsPlumb$).toBe('10ms 0', [canvasRef]);
      });

      expect(jsPlumbServiceSpy.setupJsPlumb).toHaveBeenCalledWith(canvasRef.nativeElement);
    });
  });

  describe('isOrphaned$', () => {
    let documentContainsSpy: jasmine.Spy;
    let getElementSpy$: jasmine.Spy;
    let ngOnDestroySpy: jasmine.Spy;

    beforeEach(() => {
      documentContainsSpy = spyOn(exposed, 'documentContains');
      getElementSpy$ = spyOn(exposed, 'getElement$');
      ngOnDestroySpy = spyOn(component, 'ngOnDestroy');
    });

    describe('when element$ is falsy', () => {
      it('should call expected methods and return expected results', () => {
        const cell$ = cold('0', [null]);
        getElementSpy$.and.returnValue(cold('0', [null]));

        const isOrphaned$ = exposed.getIsOrphanedTimer$(cell$).pipe(take(3));

        expect(isOrphaned$).toBeTruthy();
        getTestScheduler().run(({ expectObservable }) => {
          expectObservable(isOrphaned$).toBe('300000ms 0 299999ms 1 299999ms (2|)', [true, true, true]);
        });

        expect(getElementSpy$).toHaveBeenCalledWith(cell$);
        expect(documentContainsSpy).not.toHaveBeenCalled();
        expect(ngOnDestroySpy).toHaveBeenCalledTimes(3);
      });
    });

    describe('when element$ is truthy', () => {
      let element: JQuery<HTMLElement>;
      let cell$: Observable<CodeCell>;

      beforeEach(() => {
        element = {} as JQuery<HTMLElement>;
        cell$ = cold('0', [{ element }]);

        getElementSpy$.and.returnValue(cold('0', [element]));
      });

      describe('when document contains the element', () => {
        it('should call expected methods and return expected results', () => {
          documentContainsSpy.and.returnValue(true);

          const isOrphaned$ = exposed.getIsOrphanedTimer$(cell$).pipe(take(3));

          expect(isOrphaned$).toBeTruthy();
          getTestScheduler().run(({ expectObservable }) => {
            expectObservable(isOrphaned$).toBe('300000ms 0 299999ms 1 299999ms (2|)', [false, false, false]);
          });

          expect(getElementSpy$).toHaveBeenCalledWith(cell$);
          expect(documentContainsSpy).toHaveBeenCalled();
          expect(ngOnDestroySpy).not.toHaveBeenCalled();
        });
      });

      describe('when document does not contain the element', () => {
        it('should call expected methods and return expected results', () => {
          documentContainsSpy.and.returnValue(false);

          const isOrphaned$ = exposed.getIsOrphanedTimer$(cell$).pipe(take(3));

          expect(isOrphaned$).toBeTruthy();
          getTestScheduler().run(({ expectObservable }) => {
            expectObservable(isOrphaned$).toBe('300000ms 0 299999ms 1 299999ms (2|)', [true, true, true]);
          });

          expect(getElementSpy$).toHaveBeenCalledWith(cell$);
          expect(documentContainsSpy).toHaveBeenCalled();
          expect(ngOnDestroySpy).toHaveBeenCalledTimes(3);
        });
      });
    });
  });

  describe('detectChanges$', () => {
    it('should call expected methods and return expected results', () => {
      const detectChanges$ = exposed.getDetectChangesTimer$().pipe(take(3));

      expect(detectChanges$).toBeTruthy();
      getTestScheduler().run(({ expectObservable }) => {
        expectObservable(detectChanges$).toBe('100ms 0 99ms 1 99ms (2|)', [0, 1, 2]);
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call expected methods', () => {
      const obs$ = cold('0', [null]);

      const getJsPlumbSetupEffectSpy$ = spyOn(exposed, 'getJsPlumbSetupEffect$').and.returnValue(obs$);
      const getIsOrphanedTimerSpy$ = spyOn(exposed, 'getIsOrphanedTimer$').and.returnValue(obs$);
      const getDetectChangesTimerSpy$ = spyOn(exposed, 'getDetectChangesTimer$').and.returnValue(obs$);
      const subscribeToObservablesSpy = spyOn(exposed, 'subscribeToObservables');

      component.ngOnInit();

      expect(getJsPlumbSetupEffectSpy$).toHaveBeenCalled();
      expect(getIsOrphanedTimerSpy$).toHaveBeenCalledWith(cellServiceSpy.cell$);
      expect(getDetectChangesTimerSpy$).toHaveBeenCalled();
      expect(subscribeToObservablesSpy).toHaveBeenCalled();

      expect(exposed._observables).toEqual([obs$, obs$, obs$]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call expected methods', () => {
      component.ngOnDestroy();

      expect(cellServiceSpy.setCodeCell).toHaveBeenCalledWith(null);

      expect(jsPlumbServiceSpy.ngOnDestroy).toHaveBeenCalled();
      expect(codeMirrorServiceSpy.ngOnDestroy).toHaveBeenCalled();
      expect(cellServiceSpy.ngOnDestroy).toHaveBeenCalled();
      expect(cellDataServiceSpy.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('onWindowResize', () => {
    it('should call repaintConnectors', () => {
      component.onWindowResize();
      expect(jsPlumbServiceSpy.repaintConnectors).toHaveBeenCalled();
    });
  });
});
