import { Observable, Subscription } from 'rxjs';
import { HasSubscriptionsDirective } from './has-subscriptions';

class HasSubscriptionsExposed extends HasSubscriptionsDirective {
  _observables: Observable<any>[];
  _subscriptions: Subscription[];

  unsubscribe(): void {
    return super.unsubscribe();
  }

  addSubscription(sub: Subscription): void {
    this._subscriptions.push(sub);
  }
}

describe('HasSubscriptions', () => {
  let exposed: HasSubscriptionsExposed;
  let helper: HasSubscriptionsDirective;

  beforeEach(() => {
    exposed = new HasSubscriptionsExposed();
    helper = exposed;
  });

  describe('subscribeToObservables', () => {
    it('call unsubscribe and reset subscriptions', () => {
      const unsubscribeSpy = spyOn(exposed, 'unsubscribe').and.callThrough();
      const subSpy = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);

      exposed.addSubscription(subSpy);
      expect(exposed._subscriptions).toEqual([subSpy]);

      helper.subscribeToObservables();

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(exposed._subscriptions).toEqual([]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      const unsubscribeSpy = spyOn(exposed, 'unsubscribe').and.callThrough();
      const subSpy = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
      exposed.addSubscription(subSpy);

      helper.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(subSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
