import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CodeCell } from '@app/models';
import { VisualizationData } from '@app/models/visualization';
import { NotebookService, TraceStepService } from '@app/services';
import { provideMockActions } from '@ngrx/effects/testing';
import { CommActions, ComponentActions, VisualizationActions } from '../actions';
import { CellDataEffects } from './cell-data.effect';

describe('CellDataEffects', () => {
  let service: CellDataEffects;
  let notebookServiceSpy: jasmine.SpyObj<NotebookService>;
  let traceStepServiceSpy: jasmine.SpyObj<TraceStepService>;
  let actions$: Observable<any>;

  beforeEach(() => {
    notebookServiceSpy = jasmine.createSpyObj<NotebookService>('NotebookService', ['getMsgCell']);
    traceStepServiceSpy = jasmine.createSpyObj<TraceStepService>('TraceStepService', ['sanitize']);

    TestBed.configureTestingModule({
      providers: [
        CellDataEffects,
        { provide: NotebookService, useValue: notebookServiceSpy },
        { provide: TraceStepService, useValue: traceStepServiceSpy },
        provideMockActions(() => actions$),
      ]
    });

    service = TestBed.inject(CellDataEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('effects', () => {
    describe('setCellData$', () => {
      beforeEach(() => actions$ = hot('--0', [CommActions.setData({ msgId: 'msgId', traceSteps: [] })]));
      it('should call expected methods', () => {
        const data: VisualizationData = { cellId: 'id', step: 0, maxSteps: 0, visualize: true, data: [] };
        notebookServiceSpy.getMsgCell.and.returnValue(cold('0', [{ cell_id: 'id' } as CodeCell]));
        traceStepServiceSpy.sanitize.and.returnValue([]);

        // ACT
        expect(service.setCellData$).toBeObservable(hot('--(01)', [
          VisualizationActions.addData({ data }),
          ComponentActions.addCanvasComponentToCell({ cellId: 'id' }),
        ]));

        expect(notebookServiceSpy.getMsgCell).toHaveBeenCalledWith('msgId');
        expect(traceStepServiceSpy.sanitize).toHaveBeenCalledWith([]);
      });
    });
  });
});
