import { tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MainButtonGroupId } from '@app/constants';
import { HasThrottledSubject } from '@app/helpers';
import { ButtonActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nbtutor-main-button-group',
  templateUrl: './main-button-group.component.html',
})
export class MainButtonGroupComponent extends HasThrottledSubject<Event> implements OnInit {
  id = MainButtonGroupId;

  constructor(
    protected _store: Store<NbtutorState>,
  ) {
    super();
  }

  ngOnInit(): void {
    const toggleSelectedCellVisualization$ = this.valueThrottled$.pipe(
      tap(() => this._store.dispatch(ButtonActions.toggleVisualization()))
    );

    this._observables = [toggleSelectedCellVisualization$];
    this.subscribeToObservables();
  }

  toggleVisualization(event: Event): void {
    this._subject$.next(event);
  }
}
