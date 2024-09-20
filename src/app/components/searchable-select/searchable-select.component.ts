import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  TemplateRef,
  Type,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonicSelectableComponent,
  IonicSelectableFooterTemplateDirective,
  IonicSelectableItemTemplateDirective,
} from 'ionic-selectable';
import { BaseDetail } from 'src/app/shared/base-detail';
import { WithId } from 'src/app/shared/with-id';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchableSelectComponent,
      multi: true,
    },
    TranslateModule,
  ],
  imports: [
    IonicSelectableComponent,
    FormsModule,
    IonicSelectableItemTemplateDirective,
    IonicSelectableFooterTemplateDirective,
    CommonModule,
  ],
})
export class SearchableSelectComponent<T extends WithId>
  implements ControlValueAccessor
{
  private formInitialized = false;
  private modalCtrl = inject(ModalController);

  private readonly translate = inject(TranslateService);

  private _selectableRef = viewChild<IonicSelectableComponent>('selectable');
  setOnSearchbarClean = effect(() => {
    const selectable = this._selectableRef();
    /**
     * Clear search does not fire onSearch and does not clear the filter
     * https://github.com/eakoriakin/ionic-selectable/issues/440#issuecomment-1801959889
     */
    if (selectable) {
      selectable._onSearchbarClear = function () {
        this._searchText = ''; // Clear Search Text
        this._filterItems(); // Reeffects a filter on the items
      };
    }
  });

  valueId = signal<string | number | null>(null);

  onSearch = output<{ component: IonicSelectableComponent; text: string }>();
  onChange = output<{ component: IonicSelectableComponent; value: T }>();
  onClose = output<{ component: IonicSelectableComponent }>();
  onAddItem = output<{ component: IonicSelectableComponent }>();
  onItemAdded = output<T>();

  itemTemplateRef = contentChild<TemplateRef<any>>('itemTemplate');

  items = model.required<T[]>();
  setValues = effect(() => {
    const valueId = this.valueId();
    const items = this.items();
    if (this.formInitialized && items) {
      untracked(() => {
        const value = items.find(
          item => item[this.itemValueField()] === valueId
        );
        this.value.set(value);
      });
    }
  });
  itemValueField = model.required<keyof T>();
  itemTextField = model.required<keyof T>();
  canSearch = model<boolean>(true);
  canAddItem = model<boolean>(true);
  canSaveItem = model<boolean>(true);
  addButtonText = model<string>(this.translate.instant('ADD'));

  detailComponent = input<Type<BaseDetail<any>>>();
  componentProps = input<Record<string, any>>();

  getItem = input.required<(id: T['id']) => Promise<T>>();

  // Expose the internal component's API
  get selectable(): IonicSelectableComponent {
    return this._selectableRef()!;
  }

  value = model<T>();

  private _onChange = (value: T) => {};
  private onTouched = () => {};

  private readonly touched = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);

  writeValue(value: any): void {
    this.formInitialized = true;
    this.valueId.set(value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  private markAsTouched() {
    if (!this.touched()) {
      this.onTouched();
      this.touched.set(true);
    }
  }

  valueChanged(event: { component: IonicSelectableComponent; value: T }) {
    console.log('valueChanged', event);
    const value = event.value;
    this._onChange(value[this.itemValueField()]);
    this.markAsTouched();
    this.onChange.emit(event);
  }

  async openAddItemModal() {
    const detailComponent = this.detailComponent();
    if (detailComponent) {
      const modal = await this.modalCtrl.create({
        component: detailComponent,
        componentProps: this.componentProps() || { operation: 'add' },
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      if (data) {
        this.writeValue(data[this.itemValueField()]);
        this._selectableRef()!.hideAddItemTemplate();
        this._selectableRef()!.close();
        this.onItemAdded.emit(data);
      } else {
        this.onAddItem.emit({ component: this.selectable });
      }
    }
  }

  public selectAndCloseSearchable(
    searchable: IonicSelectableComponent,
    id: string | number
  ) {
    searchable.value = id;
    searchable.hideAddItemTemplate();
    searchable.close();
  }
}
