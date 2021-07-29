import {
  fromEventPattern, MonoTypeOperatorFunction, Observable, ObservedValueOf, OperatorFunction
} from 'rxjs';
// eslint-disable-next-line rxjs/no-internal
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';

export interface EventHandlers {
  on(eventName: string, addHandler: NodeEventHandler): void;
  off(eventName: string, removeHandler: NodeEventHandler): void;
}

export function shareReplayFirst<T>(): MonoTypeOperatorFunction<T> {
  return input$ => input$.pipe(
    first(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}

export function filterTruthy<T>(): MonoTypeOperatorFunction<T> {
  return filter(x => !!x);
}

export function switchMapNodeEvent<T extends EventHandlers>(
  action: string
): OperatorFunction<T, ObservedValueOf<Observable<T>>> {
  return switchMap<T, Observable<T>>((events) => fromEventPattern<T>(
    (h) => events.on(action, h),
    (h) => events.off(action, h),
  ).pipe(map(() => events)));
}
