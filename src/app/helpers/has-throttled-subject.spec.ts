import { cold, getTestScheduler } from 'jasmine-marbles';
import { HasThrottledSubject } from './has-throttled-subject';

describe('HasThrottledSubject', () => {
  let helper: HasThrottledSubject<any>;
  beforeEach(() => {
    helper = new HasThrottledSubject<any>();
  });

  describe('clickThrottled$', () => {
    it('should emit expected values', () => {
      const valueSpy = spyOnProperty(helper, 'value$', 'get');
      valueSpy.and.returnValue(cold('aaaa 261ms b'));

      getTestScheduler().run(({ expectObservable }) => {
        const obs$ = helper.valueThrottled$;
        expect(obs$).toBeTruthy();
        expectObservable(obs$).toBe('a 300ms b');
      });
    });
  });
});
