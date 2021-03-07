import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Directive, HostBinding, Input } from '@angular/core';
import { HasSubscriptionsDirective } from '@app/helpers/has-subscriptions';
import { HasUniqueIdentifier } from '@app/models';
import { CellService } from '@app/services';

@Directive({
  selector: '[nbtutorAnchorTo]'
})
export class AnchorToDirective extends HasSubscriptionsDirective {
  @Input('nbtutorAnchorTo') to: HasUniqueIdentifier;
  @HostBinding('class.hover') hover: boolean;

  constructor(
    protected _cellSvc: CellService,
  ) {
    super();
    this.initObservables();
    this.subscribeToObservables();
  }

  protected initObservables(): void {
    const hover$ = this._cellSvc.hover$.pipe(
      map((hover) => !!hover ? hover.to.id : null),
      map((id) => !!this.to && id === this.to.id),
      distinctUntilChanged(),
      tap((hover) => this.hover = hover),
    );

    this._observables = [hover$];
  }
}
