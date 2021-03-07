import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CellService } from '@app/services';
import { AnchorToDirective } from './anchor-to.directive';

class AnchorToDirectiveExposed extends AnchorToDirective {
  _observables: Observable<any>[];
}

describe('AnchorToDirective', () => {
  let exposed: AnchorToDirectiveExposed;
  let directive: AnchorToDirective;

  let cellServiceSpy: jasmine.SpyObj<CellService>;

  beforeEach(() => {
    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
    cellServiceSpy.hover$ = cold('0', [{ to: { id: 'id' } }]);

    exposed = new AnchorToDirectiveExposed(cellServiceSpy);
    directive = exposed;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('initObservables', () => {
    describe('hover$', () => {
      describe('when hover to id equals directive to id', () => {
        it('should return expected results', () => {
          directive.to = { id: 'id' };

          const hover$ = exposed._observables[0];
          expect(hover$).toBeObservable(cold('0', [true]));
        });
      });

      describe('when hover to id is not equal to directive to id', () => {
        it('should return expected results', () => {
          directive.to = { id: 'foo' };

          const hover$ = exposed._observables[0];
          expect(hover$).toBeObservable(cold('0', [false]));
        });
      });
    });
  });
});
