import { Observable, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { HasSubscriptionsDirective } from './has-subscriptions';

export class HasThrottledSubject<T> extends HasSubscriptionsDirective {
  protected _throttleTime = 300;
  protected _subject$ = new Subject<T>();

  get value$(): Observable<T> {
    return this._subject$.asObservable();
  }

  get valueThrottled$(): Observable<T> {
    return this.value$.pipe(throttleTime(this._throttleTime));
  }
}
