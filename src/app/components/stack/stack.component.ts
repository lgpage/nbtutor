import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { CellService, LoggerService } from '@app/services';

@Component({
  selector: 'nbtutor-stack',
  templateUrl: './stack.component.html',
})
export class StackComponent {
  protected _name = 'StackComponent';

  traceStep$ = this._cellSvc.traceStep$;
  frames$ = this.traceStep$.pipe(map(ts => ts.stack.frames));

  constructor(
    protected _cellSvc: CellService,
    protected _loggerSvc: LoggerService,
  ) { }
}
