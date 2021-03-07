import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { CellService, LoggerService } from '@app/services';

@Component({
  selector: 'nbtutor-heap',
  templateUrl: './heap.component.html',
})
export class HeapComponent {
  protected _name = 'HeapComponent';

  heap$ = this._cellSvc.heap$;
  heapObjects$ = this.heap$.pipe(
    map(heap => heap.ids.map((id) => heap.entities[id])),
  );

  constructor(
    protected _cellSvc: CellService,
    protected _loggerSvc: LoggerService,
  ) { }
}
