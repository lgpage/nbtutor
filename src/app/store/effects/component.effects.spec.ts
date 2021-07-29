import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { ComponentRef, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanvasComponent, MainButtonGroupComponent } from '@app/components';
import { LegendComponent } from '@app/components/legend/legend.component';
import { CodeCell } from '@app/models';
import { CellService, DomService, NotebookService } from '@app/services';
import { provideMockActions } from '@ngrx/effects/testing';
import { ComponentActions, VisualizationActions } from '../actions';
import { ComponentEffects } from './component.effects';

@Injectable()
export class ComponentEffectsExposed extends ComponentEffects {
  addMainToolbarButtonsToNotebook(): void {
    return super.addMainToolbarButtonsToNotebook();
  }

  createLegendComponent(cell: CodeCell, cellSvc: CellService): void {
    return super.createLegendComponent(cell, cellSvc);
  }

  createCanvasComponent(cell: CodeCell): void {
    return super.createCanvasComponent(cell);
  }

  addComponentToCodeCell(createComponentFn: (cell: CodeCell) => void, cellId?: string): Observable<CodeCell> {
    return super.addComponentToCodeCell(createComponentFn, cellId);
  }

  addCanvasComponentToCodeCell(cellId?: string): Observable<CodeCell> {
    return super.addCanvasComponentToCodeCell(cellId);
  }
}

describe('ComponentEffects', () => {
  let exposed: ComponentEffectsExposed;
  let service: ComponentEffects;
  let domServiceSpy: jasmine.SpyObj<DomService>;
  let notebookServiceSpy: jasmine.SpyObj<NotebookService>;
  let actions$: Observable<any>;

  beforeEach(() => {
    domServiceSpy = jasmine.createSpyObj<DomService>('DomService', ['createChildComponent']);
    notebookServiceSpy = jasmine.createSpyObj<NotebookService>('NotebookService', ['getSelectedCell', 'getCellById']);

    TestBed.configureTestingModule({
      providers: [
        ComponentEffectsExposed,
        { provide: DomService, useValue: domServiceSpy },
        { provide: NotebookService, useValue: notebookServiceSpy },
        provideMockActions(() => actions$),
      ]
    });

    exposed = TestBed.inject(ComponentEffectsExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addMainToolbarButtonsToNotebook', () => {
    it('should call the expected method', () => {
      exposed.addMainToolbarButtonsToNotebook();
      expect(domServiceSpy.createChildComponent).toHaveBeenCalledWith(
        MainButtonGroupComponent,
        '#nbtutor-main-btn-group',
        '#maintoolbar-container'
      );
    });
  });

  describe('createLegendComponent', () => {
    it('should call expected methods', () => {
      const childElementSpy = jasmine.createSpyObj<JQuery<HTMLElement>>('JQuery<HTMLElement>', ['find']);
      const elementSpy = jasmine.createSpyObj<JQuery<HTMLElement>>('JQuery<HTMLElement>', ['find']);
      const cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
      const legendComponentSpy = jasmine.createSpyObj<LegendComponent>('LegendComponent', ['setCellService']);
      const componentRefSpy = jasmine.createSpyObj<ComponentRef<any>>('ComponentRef', [], { 'instance': legendComponentSpy });

      const output_area: OutputArea = { clear_output() { }, handle_output() { } };
      const cell: CodeCell = { cell_id: 'id', cell_type: 'code', element: elementSpy, metadata: {}, output_area, code_mirror: null };

      elementSpy.find.and.returnValue(childElementSpy);
      domServiceSpy.createChildComponent.and.returnValue(componentRefSpy);

      // ACT
      exposed.createLegendComponent(cell, cellServiceSpy);

      expect(elementSpy.find).toHaveBeenCalledWith('.inner_cell');
      expect(domServiceSpy.createChildComponent).toHaveBeenCalledWith(LegendComponent, null, childElementSpy);
      expect(legendComponentSpy.setCellService).toHaveBeenCalledWith(cellServiceSpy);
    });
  });

  describe('createCanvasComponent', () => {
    it('should call expected methods', () => {
      const cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
      const childElementSpy = jasmine.createSpyObj<JQuery<HTMLElement>>('JQuery<HTMLElement>', ['find']);
      const elementSpy = jasmine.createSpyObj<JQuery<HTMLElement>>('JQuery<HTMLElement>', ['find']);
      const canvasComponentSpy = jasmine.createSpyObj<CanvasComponent>('Component', [], { 'cellSvc': cellServiceSpy });
      const componentRefSpy = jasmine.createSpyObj<ComponentRef<any>>('ComponentRef', [], { 'instance': canvasComponentSpy });
      const createLegendComponentSpy = spyOn(exposed, 'createLegendComponent');
      const output_area: OutputArea = { clear_output() { }, handle_output() { } };
      const cell: CodeCell = { cell_id: 'id', cell_type: 'code', element: elementSpy, metadata: {}, output_area, code_mirror: null };

      elementSpy.find.and.returnValue(childElementSpy);
      domServiceSpy.createChildComponent.and.returnValue(componentRefSpy);

      // ACT
      exposed.createCanvasComponent(cell);

      expect(elementSpy.find).toHaveBeenCalledWith('.inner_cell > .input_area');
      expect(domServiceSpy.createChildComponent).toHaveBeenCalledWith(CanvasComponent, null, childElementSpy);
      expect(createLegendComponentSpy).toHaveBeenCalledWith(cell, cellServiceSpy);
      expect(cellServiceSpy.setCodeCell).toHaveBeenCalledWith(cell);
      expect(cell.nbtutor).toBe(canvasComponentSpy);
    });
  });

  describe('addComponentToCodeCell', () => {
    describe('when cell id is provided', () => {
      describe('when cell is a code cell', () => {
        describe('when cell has nbtutor instance', () => {
          it('should return the expected result', () => {
            const cell: CodeCell = { cell_id: 'id', cell_type: 'code', nbtutor: {} } as CodeCell;
            const createFnSpy = jasmine.createSpy('createComponentFn');
            notebookServiceSpy.getCellById.and.returnValue(cold('0', [cell]));

            const cell$ = exposed.addComponentToCodeCell(createFnSpy, 'id');

            expect(cell$).toBeObservable(cold('(0|)', [cell]));
            expect(notebookServiceSpy.getCellById).toHaveBeenCalledWith('id');
            expect(createFnSpy).not.toHaveBeenCalled();
          });
        });

        describe('when cell does not have nbtutor instance', () => {
          it('should return the expected result', () => {
            const cell: CodeCell = { cell_id: 'id', cell_type: 'code' } as CodeCell;
            const createFnSpy = jasmine.createSpy('createComponentFn');
            notebookServiceSpy.getCellById.and.returnValue(cold('0', [cell]));

            const cell$ = exposed.addComponentToCodeCell(createFnSpy, 'id');

            expect(cell$).toBeObservable(cold('(0|)', [cell]));
            expect(notebookServiceSpy.getCellById).toHaveBeenCalledWith('id');
            expect(createFnSpy).toHaveBeenCalledWith(cell);
          });
        });
      });

      describe('when cell is not a code cell', () => {
        it('should return the expected result', () => {
          const cell: CodeCell = { cell_id: 'id', nbtutor: {} } as CodeCell;
          const createFnSpy = jasmine.createSpy('createComponentFn');
          notebookServiceSpy.getCellById.and.returnValue(cold('0', [cell]));

          const cell$ = exposed.addComponentToCodeCell(createFnSpy, 'id');

          expect(cell$).toBeObservable(cold('(0|)', [null]));
          expect(notebookServiceSpy.getCellById).toHaveBeenCalledWith('id');
          expect(createFnSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('when cell id is not provided', () => {
      it('should return the expected result', () => {
        const cell: CodeCell = { cell_id: 'id', cell_type: 'code', nbtutor: {} } as CodeCell;
        const createFnSpy = jasmine.createSpy('createComponentFn');
        notebookServiceSpy.getSelectedCell.and.returnValue(cold('0', [cell]));

        const cell$ = exposed.addComponentToCodeCell(createFnSpy);

        expect(cell$).toBeObservable(cold('(0|)', [cell]));
        expect(notebookServiceSpy.getSelectedCell).toHaveBeenCalled();
        expect(createFnSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('addCanvasComponentToCodeCell', () => {
    it('should call the expected method', () => {
      const cell: CodeCell = { cell_id: 'id', cell_type: 'code', nbtutor: {} } as CodeCell;
      const addComponentToCodeCellSpy = spyOn(exposed, 'addComponentToCodeCell').and.returnValue(cold('0', [cell]));

      const cell$ = exposed.addCanvasComponentToCodeCell('id');

      expect(cell$).toBeObservable(cold('0', [cell]));
      expect(addComponentToCodeCellSpy).toHaveBeenCalled();
    });
  });

  describe('effects', () => {
    let addMainToolbarButtonsToNotebookSpy: jasmine.Spy;
    let addCanvasComponentToCodeCellSpy: jasmine.Spy;

    beforeEach(() => {
      addMainToolbarButtonsToNotebookSpy = spyOn(exposed, 'addMainToolbarButtonsToNotebook');
      addCanvasComponentToCodeCellSpy = spyOn(exposed, 'addCanvasComponentToCodeCell');
    });

    describe('addMainToolbarButtonsToNotebook$', () => {
      beforeEach(() => actions$ = hot('--0', [ComponentActions.addMainToolbarButtonsToNotebook()]));
      it('should call expected methods', () => {
        expect(service.addMainToolbarButtonsToNotebook$).toBeObservable(hot(
          '--0',
          [ComponentActions.addMainToolbarButtonsToNotebook()]
        ));
        expect(addMainToolbarButtonsToNotebookSpy).toHaveBeenCalled();
      });
    });

    describe('addCanvasComponentToCodeCell$', () => {
      let createCanvasComponentSpy: jasmine.Spy;
      beforeEach(() => {
        addCanvasComponentToCodeCellSpy.and.callThrough();
        createCanvasComponentSpy = spyOn(exposed, 'createCanvasComponent');
      });

      it('should call expected methods', () => {
        const cell = { cell_id: 'id', cell_type: 'code' } as CodeCell;
        notebookServiceSpy.getSelectedCell.and.returnValue(cold('0', [cell]));

        expect(exposed.addCanvasComponentToCodeCell()).toBeObservable(cold('(0|)', [cell]));
        expect(createCanvasComponentSpy).toHaveBeenCalledWith(cell);
      });

      describe('when canvas component already exists', () => {
        it('should call expected methods', () => {
          const cell = { cell_id: 'id', cell_type: 'code', nbtutor: {} } as CodeCell;
          notebookServiceSpy.getCellById.and.returnValue(cold('0', [cell]));

          expect(exposed.addCanvasComponentToCodeCell('id')).toBeObservable(cold('(0|)', [cell]));
          expect(createCanvasComponentSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('toggleCanvasComponentDisplay$', () => {
      let cell: CodeCell;
      beforeEach(() => {
        cell = { cell_id: 'id', cell_type: 'code' } as CodeCell;
        actions$ = hot('--0', [ComponentActions.toggleCanvasComponentDisplay()]);
        addCanvasComponentToCodeCellSpy.and.returnValue(cold('0', [cell]));
      });

      it('should call expected methods', () => {
        expect(service.toggleCanvasComponentDisplay$).toBeObservable(hot(
          '--0',
          [VisualizationActions.toggleVisualize({ id: 'id' })]
        ));
        expect(addCanvasComponentToCodeCellSpy).toHaveBeenCalledWith();
      });
    });
  });
});
