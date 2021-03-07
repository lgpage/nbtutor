import { map, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { StepButtonGroupId } from '@app/constants';
import { HasThrottledSubject } from '@app/helpers';
import { StepType } from '@app/models';
import { LoggerService } from '@app/services';
import { ButtonActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { Action, Store } from '@ngrx/store';

@Component({
  selector: 'nbtutor-step-button-group',
  templateUrl: './step-button-group.component.html',
})
export class StepButtonGroupComponent extends HasThrottledSubject<StepType> implements OnInit {
  protected _name = 'StepButtonGroupComponent';
  protected _throttleTime = 50;

  id = StepButtonGroupId;

  constructor(
    protected _loggerSvc: LoggerService,
    protected _store: Store<NbtutorState>,
  ) {
    super();
  }

  ngOnInit(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnInit`);

    const setStep$ = this.valueThrottled$.pipe(
      map<StepType, Action>((step) => {
        switch (step) {
          case 'first':
            return ButtonActions.first();
          case 'previous':
            return ButtonActions.previous();
          case 'next':
            return ButtonActions.next();
          case 'last':
            return ButtonActions.last();
        }
      }),
      tap((action) => this._loggerSvc.logDebug(`${this._name} >> setStep$`, { action })),
      tap((action) => this._store.dispatch(action)),
    );

    this._observables = [setStep$];
    this.subscribeToObservables();
  }

  setStep(step: StepType): void {
    this._loggerSvc.logDebug(`${this._name} >> setStep`, { step });
    this._subject$.next(step);
  }
}
