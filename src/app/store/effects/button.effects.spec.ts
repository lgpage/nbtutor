import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CodeCell } from '@app/models';
import { NotebookService } from '@app/services';
import { provideMockActions } from '@ngrx/effects/testing';
import { ButtonActions, ComponentActions, VisualizationActions } from '../actions';
import { ButtonEffects } from './button.effects';

describe('ButtonEffects', () => {
  let service: ButtonEffects;
  let notebookServiceSpy: jasmine.SpyObj<NotebookService>;
  let actions$: Observable<any>;

  beforeEach(() => {
    notebookServiceSpy = jasmine.createSpyObj<NotebookService>('NotebookService', ['getSelectedCell']);

    TestBed.configureTestingModule({
      providers: [
        ButtonEffects,
        { provide: NotebookService, useValue: notebookServiceSpy },
        provideMockActions(() => actions$),
      ]
    });

    service = TestBed.inject(ButtonEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('effects', () => {
    let cell: CodeCell;
    beforeEach(() => {
      cell = { cell_id: 'id', cell_type: 'code' } as CodeCell;
      notebookServiceSpy.getSelectedCell.and.returnValue(cold('(0|)', [cell]));
    });

    describe('first$', () => {
      beforeEach(() => actions$ = hot('--0--0-', [ButtonActions.first()]));
      it('should call expected methods', () => {
        expect(service.first$).toBeObservable(hot(
          '--0--0-',
          [VisualizationActions.updateStep({ id: 'id', step: 'first' })]
        ));
      });
    });

    describe('previous$', () => {
      beforeEach(() => actions$ = hot('--0--0-', [ButtonActions.previous()]));
      it('should call expected methods', () => {
        expect(service.previous$).toBeObservable(hot(
          '--0--0-',
          [VisualizationActions.updateStep({ id: 'id', step: 'previous' })]
        ));
      });
    });

    describe('next$', () => {
      beforeEach(() => actions$ = hot('--0--0-', [ButtonActions.next()]));
      it('should call expected methods', () => {
        expect(service.next$).toBeObservable(hot(
          '--0--0-',
          [VisualizationActions.updateStep({ id: 'id', step: 'next' })]
        ));
      });
    });

    describe('last$', () => {
      beforeEach(() => actions$ = hot('--0--0-', [ButtonActions.last()]));
      it('should call expected methods', () => {
        expect(service.last$).toBeObservable(hot(
          '--0--0-',
          [VisualizationActions.updateStep({ id: 'id', step: 'last' })]
        ));
      });
    });

    describe('toggleVisualize$', () => {
      beforeEach(() => actions$ = hot('--0--0-', [ButtonActions.toggleVisualization()]));
      it('should call expected methods', () => {
        expect(service.toggleVisualize$).toBeObservable(hot(
          '--0--0-',
          [ComponentActions.toggleCanvasComponentDisplay()]
        ));
      });
    });
  });
});
