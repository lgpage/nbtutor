import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { LogLevel } from '../constants';

export const LOGLEVEL = new InjectionToken<LogLevel>('LogLevel');

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(@Inject(LOGLEVEL) @Optional() protected _logLevel: LogLevel) {
    if (this._logLevel === null || this._logLevel === undefined) {
      this._logLevel = LogLevel.Warning;
    }
  }

  protected logWith(
    logFunc: (message?: any, ...optionalParams: any[]) => void,
    logLevel: LogLevel,
    message?: any,
    ...optionalParams: any[]
  ): void {
    if (logLevel >= this._logLevel) {
      try {
        logFunc(message, ...optionalParams);
      } catch { }
    }
  }

  logTrace(message?: any, ...optionalParams: any[]): void {
    this.logWith(console.log, LogLevel.Trace, message, ...optionalParams);
  }

  logDebug(message?: any, ...optionalParams: any[]): void {
    this.logWith(console.log, LogLevel.Debug, message, ...optionalParams);
  }

  logInfo(message?: any, ...optionalParams: any[]): void {
    this.logWith(console.log, LogLevel.Info, message, ...optionalParams);
  }

  logWarning(message?: any, ...optionalParams: any[]): void {
    this.logWith(console.warn, LogLevel.Warning, message, ...optionalParams);
  }

  logError(message?: any, ...optionalParams: any[]): void {
    this.logWith(console.error, LogLevel.Error, message, ...optionalParams);
  }
}
