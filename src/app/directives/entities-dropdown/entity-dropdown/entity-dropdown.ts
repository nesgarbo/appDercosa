import {
  Dropdown,
  DropdownFilterEvent,
  DropdownLazyLoadEvent,
} from 'primeng/dropdown';
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  catchError,
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  from,
  lastValueFrom,
  map,
  of,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  getGlobalFilters,
  getReqlFilters,
} from '../../../feathers/adapt-filters';
import { NgControl } from '@angular/forms';
import { Translatable } from '../../../../utils/translation/translatable';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { translateNowFn } from '../../../../utils/translate';
import { WithId } from '../../../../shared/with-id';
import { FeathersDataServiceMethods } from '../../../signal-store/features/with-feathers-data/models';
import { PrimeDropdownMethods } from '../../../signal-store/features/with-prime/with-prime-dropdown/models';

export interface FilterEvent {
  originalEvent: InputEvent;
  filter: string;
}

@Directive({
  standalone: true,
})
export abstract class EntityDropdown<T extends WithId> implements OnInit {
  private destroyRef = inject(DestroyRef);

  private readonly resetDistinct$ = new EventEmitter<void>();

  protected DEBOUNCETIME = 250;

  private translate = inject(TranslateService);

  private _translateNowFn = translateNowFn();

  private _cdr = inject(ChangeDetectorRef);

  protected isSearching = false;

  protected abstract get optionLabel(): Extract<keyof T, string>;

  protected get optionValue(): Extract<keyof T, string> {
    return 'id' as Extract<keyof T, string>;
  }

  protected abstract get placeholder(): Translatable;

  protected abstract get searchInFields(): Extract<keyof T, string>[];

  constructor(
    protected dropdown: Dropdown,
    protected ngControl: NgControl
  ) {
    this.setDropdownProperties();
    this.subscribeToLanguageChanges();
  }

  abstract getSignalStore(): FeathersDataServiceMethods<T, any, any, any>;
  async ngOnInit() {
    if (!this.ngControl) {
      return;
    }
    this.setCurrentValueItem();
    this.subscribeToControlValueChanges();
  }

  protected async setCurrentValueItem() {
    const item = await this.getItemOfControlValue(
      this.ngControl.control!.value
    );
    if (item) {
      this.setDropdownOptions([item]);
    }
  }

  private subscribeToControlValueChanges() {
    if (!this.ngControl || !this.ngControl.control) {
      return;
    }
    this.ngControl.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async controlValue => {
        if (controlValue) {
          const item = await this.getItemOfControlValue(controlValue);
          this.setDropdownOptions([item]);
        }
      });
  }

  protected setDropdownOptions(options: T[]) {
    this.dropdown.options = options;
    this._cdr.detectChanges();
  }

  protected async getItemOfControlValue(id: T['id']): Promise<T> {
    return (
      this.getFromDropdownOptionsById(id) || this.getItemFromListService(id)
    );
  }

  protected async getItemFromListService(id: T['id']): Promise<T> {
    return this.getSignalStore().get(id, {}, true);
  }

  protected getFromDropdownOptionsById(id: T['id']): T | undefined {
    return this.dropdown.options?.find(item => item['id'] === id);
  }

  protected setDropdownProperties() {
    this.dropdown.options = [];
    this.dropdown.optionLabel = this.optionLabel;
    this.dropdown.optionValue = this.optionValue;
    this.dropdown.filter = true;
    this.dropdown.filterBy = String(this.searchInFields);
    this.dropdown.showClear = true;
    this.dropdown.autoDisplayFirst = false;
    this.dropdown.lazy = true;
    this.subcribeToDropdownOnLazyLoadEvents();
    this.subcribeToDropdownOnFilterEvents();
    this.setCurrentPlaceholderTranslation();
  }

  private subscribeToLanguageChanges() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setCurrentPlaceholderTranslation();
        this._cdr.detectChanges();
      });
  }

  private getCurrentPlaceholderTranslation() {
    return this._translateNowFn(this.placeholder);
  }

  private setCurrentPlaceholderTranslation() {
    this.dropdown.placeholder = this.getCurrentPlaceholderTranslation();
  }

  private subcribeToDropdownOnLazyLoadEvents() {
    this.dropdown.onLazyLoad
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.onLazyLoad(event);
      });
  }

  protected onLazyLoad(event: DropdownLazyLoadEvent) {
    console.log('******onLazyLoad', event);
  }

  private subcribeToDropdownOnFilterEvents() {
    this.resetDistinct$
      .pipe(
        startWith(null),
        switchMap(() =>
          this.dropdown.onFilter.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
            tap(event => {}),
            map((event: DropdownFilterEvent) => event.filter),
            filter(res => res && res.length > 2),
            debounceTime(this.DEBOUNCETIME),
            distinctUntilChanged(),
            filter(x => x !== 'reset'),
            switchMap((term: string) => {
              this.dropdown.loaderTemplate;
              this.isSearching = true;
              return this.searchGetCall(term);
            })
          )
        )
      )
      .subscribe({
        next: res => {
          this.isSearching = false;
          this.setDropdownOptions(this.mergeWithCurrentOptions(res));
          this.resetDistinct$.next();
        },
        error: err => {
          this.isSearching = false;
          console.error('error', err);
        },
      });
  }

  private mergeWithCurrentValueItem(items: T[]): T[] {
    const currentValueItem = this.getCurrentValueItem();
    return currentValueItem
      ? [
          currentValueItem,
          ...items.filter(item => item.id !== currentValueItem.id),
        ]
      : items;
  }

  private mergeWithCurrentOptions(items: T[]): T[] {
    /**
     * Javascript: Merge Two Arrays of Objects, Only If Not Duplicate (Based on Specified Object Key)
     * https://stackoverflow.com/a/54134237
     */
    const initialOptions = this.dropdown.options || [];
    const ids = new Set(initialOptions.map(d => d.id));
    return [...initialOptions, ...items.filter(d => !ids.has(d.id))];
  }

  protected getCurrentValueItem(): T | undefined {
    return this.getFromDropdownOptionsById(this.ngControl.control!.value);
  }

  protected searchGetCall(term: string): Observable<T[]> {
    if (term === '') {
      return of([]);
    }

    const filters = getGlobalFilters(term, this.searchInFields);
    const reqlFilters = getReqlFilters(filters);

    const query = {
      $sort: { [this.optionLabel]: 1 },
      ...reqlFilters,
      $paginate: 'false',
    };

    return defer(
      () =>
        this.getSignalStore().find({ query, paginate: false }) as Promise<T[]>
    ).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }
}
