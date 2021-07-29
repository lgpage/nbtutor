import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LogLevel } from '@app/constants';
import { LoggerService } from './logger.service';

@Injectable()
class LoggerServiceExposed extends LoggerService {
  get logLevel(): LogLevel {
    return this._logLevel;
  }

  set logLevel(value: LogLevel) {
    this._logLevel = value;
  }

  logWith(
    logFunc: (message?: any, ...optionalParams: any[]) => void,
    logLevel: LogLevel,
    message?: any,
    ...optionalParams: any[]
  ): void {
    super.logWith(logFunc, logLevel, message, ...optionalParams);
  }
}

describe('LoggerService', () => {
  let exposed: LoggerServiceExposed;
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggerServiceExposed,
      ]
    });

    exposed = TestBed.inject(LoggerServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to warning log level', () => {
    expect(exposed.logLevel).toEqual(LogLevel.Warning);
  });

  describe('logWith', () => {
    let logFuncSpy: jasmine.Spy;
    beforeEach(() => {
      logFuncSpy = jasmine.createSpy('logFunc');
      exposed.logLevel = LogLevel.Debug;
    });

    it('should swallow logFunc errors', () => {
      logFuncSpy.and.throwError('whoops');
      exposed.logWith(logFuncSpy, LogLevel.Debug, 'message', 'a', 'b');
      expect(logFuncSpy).toHaveBeenCalledWith('message', 'a', 'b');
    });

    describe('when log level greate than config log level', () => {
      it('should log messages', () => {
        exposed.logWith(logFuncSpy, LogLevel.Debug, 'message', 'a', 'b');
        expect(logFuncSpy).toHaveBeenCalledWith('message', 'a', 'b');
      });
    });

    describe('when log level less than config log level', () => {
      it('should not log messages', () => {
        exposed.logLevel = LogLevel.Warning;
        exposed.logWith(logFuncSpy, LogLevel.Debug, 'message', 'a', 'b');
        expect(logFuncSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('log methods', () => {
    let logWithSpy: jasmine.Spy;
    beforeEach(() => {
      logWithSpy = spyOn(exposed, 'logWith');
    });

    describe('logTrace', () => {
      it('should call expected methods', () => {
        service.logTrace('message', 'a', 'b');
        expect(logWithSpy).toHaveBeenCalledWith(console.log, LogLevel.Trace, 'message', 'a', 'b');
      });
    });

    describe('logInfo', () => {
      it('should call expected methods', () => {
        service.logInfo('message', 'a', 'b');
        expect(logWithSpy).toHaveBeenCalledWith(console.log, LogLevel.Info, 'message', 'a', 'b');
      });
    });

    describe('logDebug', () => {
      it('should call expected methods', () => {
        service.logDebug('message', 'a', 'b');
        expect(logWithSpy).toHaveBeenCalledWith(console.log, LogLevel.Debug, 'message', 'a', 'b');
      });
    });

    describe('logWarning', () => {
      it('should call expected methods', () => {
        service.logWarning('message', 'a', 'b');
        expect(logWithSpy).toHaveBeenCalledWith(console.warn, LogLevel.Warning, 'message', 'a', 'b');
      });
    });

    describe('logError', () => {
      it('should call expected methods', () => {
        service.logError('message', 'a', 'b');
        expect(logWithSpy).toHaveBeenCalledWith(console.error, LogLevel.Error, 'message', 'a', 'b');
      });
    });
  });
});
