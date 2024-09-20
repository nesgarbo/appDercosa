import { Directive, Input, TemplateRef } from '@angular/core';
import { CrudColumn } from '../../components/crud-base/crud-base.component';

export type TableColumnTemplates =
  | 'header'
  | 'headerLeft'
  | 'headerRight'
  | 'headerTitle'
  | 'headerSort'
  | 'rowContent'
  | 'bodyToolbarDocumentButtonTemplate';

@Directive({
  selector: '[appTableColumnTemplate]',
  standalone: true,
})
export class TableColumnTemplateDirective {
  @Input() appTableColumnTemplate: TableColumnTemplates;
  @Input() col: CrudColumn;
  @Input() field: string;

  constructor(public templateRef: TemplateRef<any>) {} // Don't remove from constructor
}
