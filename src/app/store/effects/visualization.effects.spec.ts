import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NotebookService } from '@app/services';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { VisualizationActions } from '../actions';
import { NbtutorState } from '../reducers';
import { selectVisualizationIds } from '../selectors/visualization.selectors';
import { VisualizationEffects } from './visualization.effects';

@Injectable()
class VisualizationEffectsExposed extends VisualizationEffects {
  getIdsToRemove(): Observable<string[]> {
    return super.getIdsToRemove();
  }
}

describe('VisualizationEffects', () => {
  let actions$: Observable<any>;
  let exposed: VisualizationEffectsExposed;
  let effects: VisualizationEffects;

  let store: MockStore<NbtutorState>;

  let notebookServiceSpy: jasmine.SpyObj<NotebookService>;

  beforeEach(() => {
    notebookServiceSpy = jasmine.createSpyObj<NotebookService>('NotebookService', ['getCells']);

    TestBed.configureTestingModule({
      providers: [
        VisualizationEffectsExposed,
        provideMockStore<NbtutorState>(),
        provideMockActions(() => actions$),
        { provide: NotebookService, useValue: notebookServiceSpy },
      ]
    });

    actions$ = cold('0', []);

    store = TestBed.inject(MockStore);
    exposed = TestBed.inject(VisualizationEffectsExposed);
    effects = exposed;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getIdsToRemove', () => {
    afterAll(() => store.resetSelectors());

    beforeEach(() => {
      store.overrideSelector(selectVisualizationIds, ['id']);
    });

    it('should call the expected methods and return expected results', () => {
      const cell: NotebookCell = { cell_id: 'id' } as NotebookCell;
      notebookServiceSpy.getCells.and.returnValue(cold('--0', [[cell]]));

      expect(exposed.getIdsToRemove()).toBeObservable(cold('--0', [['id']]));
    });
  });

  describe('effects', () => {
    let getIdsToRemoveSpy: jasmine.Spy;

    beforeEach(() => {
      getIdsToRemoveSpy = spyOn(exposed, 'getIdsToRemove');
    });

    describe('syncData$', () => {
      beforeEach(() => actions$ = hot('--0', [VisualizationActions.syncData()]));
      it('should call expected methods', () => {
        const ids: string[] = ['id'];
        getIdsToRemoveSpy.and.returnValue(cold('0', [ids]));

        expect(effects.syncData$).toBeObservable(hot('--0', [VisualizationActions.removeData({ ids })]));
        expect(getIdsToRemoveSpy).toHaveBeenCalled();
      });
    });
  });
});
