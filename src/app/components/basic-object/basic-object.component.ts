import { Component } from '@angular/core';
import { BaseObjectDirective } from '../base-object-directive';

@Component({
  selector: 'nbtutor-basic-object',
  templateUrl: './basic-object.component.html',
})
export class CodeObjectComponent extends BaseObjectDirective {
  protected _name = 'CodeObjectComponent';
}
