import { Observable, Subscription } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

@Directive()
export class HasSubscriptionsDirective implements OnDestroy {
  protected _observables: Observable<any>[] = [];
  protected _subscriptions: Subscription[] = [];

  protected unsubscribe(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  subscribeToObservables(): void {
    this.unsubscribe();
    this._subscriptions = this._observables.map(obs$ => obs$.subscribe());
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
