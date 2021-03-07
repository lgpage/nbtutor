import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { filterTruthy, shareReplayFirst } from './observables';

describe('observables', () => {
  describe('shareReplayFirst', () => {
    // https://github.com/ReactiveX/rxjs/issues/3336
    // https://github.com/ReactiveX/rxjs/commit/0fd87073df0baa5819140c9a5fbd4208a3bd7cac
    it('should emit expected values', () => {
      getTestScheduler().run(({ expectObservable }) => {
        const source$ = hot('-a-b-c-d');
        const sub1 = '^---!';
        const sub2 = '------^';

        const result$ = source$.pipe(shareReplayFirst());
        expect(result$).toBeTruthy();
        expectObservable(result$, sub1).toBe('-(a|)');
        expectObservable(result$, sub2).toBe('------(a|)');
      });
    });
  });

  describe('filterTruthy', () => {
    it('should emit expected values', () => {
      const values = { a: 'foo', n: null, u: undefined, f: false, e: '', t: true, r: [], o: {} };
      const source$ = hot('-naufetro-', values);

      const result$ = source$.pipe(filterTruthy());
      expect(result$).toBeObservable(cold('--a---tro-', { a: 'foo', t: true, r: [], o: {} }));
    });
  });
});
