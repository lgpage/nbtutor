import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { HasUniqueIdentifier, Heap } from '@app/models';
import { CellService, JsPlumbService } from '@app/services';

@Directive({
  selector: '[nbtutorAnchorFrom]'
})
export class AnchorFromDirective {
  @Input() heap: Heap;
  @Input('nbtutorAnchorFrom') from: HasUniqueIdentifier;

  constructor(
    protected _cellSvc: CellService,
    protected _jsPlumbSvc: JsPlumbService,
    protected _elementRef: ElementRef<any>,
  ) { }

  @HostListener('mouseenter')
  onMouseOver(): void {
    this._cellSvc.setHover({ from: this.from, to: this.heap.entities[this.from.id] });
    this._jsPlumbSvc.toggleHoverClass(this.from.uuid);
  }

  @HostListener('mouseleave')
  onMouseOut(): void {
    this._cellSvc.setHover(null);
    this._jsPlumbSvc.toggleHoverClass(this.from.uuid);
  }
}
