import { Component, Input } from '@angular/core';
import { StackFrame, TraceStep, Variable } from '@app/models';
import { CellService, LoggerService } from '@app/services';

@Component({
  selector: 'nbtutor-frame',
  templateUrl: './frame.component.html',
})
export class FrameComponent {
  protected _name = 'FrameComponent';

  @Input() traceStep: TraceStep;
  @Input() frame: StackFrame;

  constructor(
    protected _cellSvc: CellService,
    protected _loggerSvc: LoggerService,
  ) { }

  getObjectValue(variable: Variable): string {
    const heapObject = this.traceStep.heap.entities[variable.id];
    if (!!heapObject && !!heapObject.hideReferences) {
      return !!heapObject ? heapObject.value : null;
    }

    return null;
  }
}
