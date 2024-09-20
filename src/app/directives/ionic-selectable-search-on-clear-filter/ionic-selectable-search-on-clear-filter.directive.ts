import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';

@Directive({
  selector: 'ionic-selectable[searchOnClearFilter]',
  standalone: true,
})
/**
 * Forces the selectables to filter the items when the search is cleared
 */
export class IonicSelectableSearchOnClearFilterDirective
  implements AfterViewInit
{
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    /**
     * Clear search does not fire onSearch and does not clear the filter
     * https://github.com/eakoriakin/ionic-selectable/issues/440#issuecomment-1801959889
     */

    const selectableComponent: IonicSelectableComponent = this.el.nativeElement;
    console.log('selectableComponent', selectableComponent);
    console.log('selectableComponent._onSearchbarClear', selectableComponent._onSearchbarClear);
    selectableComponent._onSearchbarClear = function () {
      console.log('Clearing search');
      this._searchText = ''; // Clear Search Text
      this._filterItems(); // Reeffects a filter on the items
    };
    console.log(
      'selectableComponent._onSearchbarClear',
      selectableComponent._onSearchbarClear
    );

  }
}
