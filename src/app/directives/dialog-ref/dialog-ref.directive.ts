import { Directive } from '@angular/core';

@Directive({
  selector: '[dialogRef]',
  exportAs: 'dialogRef',
  standalone: true,
})
export class DialogRefDirective {
  constructor() {}
}
