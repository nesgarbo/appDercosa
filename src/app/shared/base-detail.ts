/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @angular-eslint/component-class-suffix */
import {
  Component,
  DestroyRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  Signal,
  computed,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { confirmationFn } from '../utils/confirmation';
import { removeNullProperties } from '../utils/remove-null-props';
import { translateFn } from '../utils/translate';
import { WithId } from './with-id';
import { OwnerInfo } from '../utils/owner-info';

import { ModalController } from '@ionic/angular';
import { FeathersDataServiceMethods } from '../signalStores/features/with-feathers-data/models';

export type DetailsOperation = 'add' | 'edit' | 'show';

export type DetailState<T> = {
  item: T;
};

interface IConstructor<T> {
  new (...args: any[]): T;
}

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseDetail<T extends WithId> implements OnInit {
  injector = inject(Injector);

  @Output() onItemAdded = new EventEmitter<T>();

  detailsForm!: FormGroup;
  valueChanges: Signal<any> | undefined;
  hasChanged: Signal<boolean> | undefined;

  // item: T | null = null;
  _item: T | null = null;
  get item(): T | null {
    return this._item;
  }

  set item(value: T | null) {
    console.log('Valueeee', value);
    this._item = value;
    if (value) {
      this.onItemSet(value);
    }
  }
  ownerInfo = input<OwnerInfo<T> | undefined>(undefined);

  itemId: Signal<T['id'] | undefined> = computed(() => this.item?.id);

  useItem = input<T | null>(null);
  // operation = input<DetailsOperation>('show');
  @Input() operation: DetailsOperation = 'show';
  embedPicker = input<boolean>(false);

  private initialValue: any;

  protected itemConstructor!: IConstructor<T>;

  constructor() {
    effect(
      () => {
        const useItem = this.useItem();
        if (useItem) {
          this.item = useItem;
          console.log('item set from useItem', useItem);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    if (!this.useItem() && !this.embedPicker()) {
      this.getItemFromRouter();
    } else {
      this.item = this.useItem();
    }
    const item = this.item;
    if (item) {
      this.setFormValue(item);
    } else {
      this.initializeFormChangesDetection();
    }
  }

  protected _confirmationFn = confirmationFn();
  protected _translateFn = translateFn();

  protected onItemSet(item: T) {}

  protected setFormValue(formValue: any) {
    this.detailsForm.patchValue(formValue, {
      onlySelf: true,
      emitEvent: false,
    });
    this.detailsForm.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false,
    });
    this.initializeFormChangesDetection();
  }

  private initializeFormChangesDetection() {
    this.initialValue = this.detailsForm.value; // Take value from form to limit to present fields
    this.valueChanges = toSignal(this.detailsForm.valueChanges, {
      injector: this.injector,
    });
    this.hasChanged = computed(() => {
      const currentFormValue = this.valueChanges!();
      return currentFormValue
        ? Object.entries(currentFormValue).some(([key, value]) => {
            return value !== this.initialValue[key];
          })
        : false;
    });
  }

  abstract getSignalStore(): FeathersDataServiceMethods<T, any, any, any>;

  public async save() {
    switch (this.operation) {
      case 'add':
        try {
          const saveResult = await this.getSignalStore().create(
            this.getRawValue()
          );
          if (saveResult) {
            this.onItemAdded.emit(saveResult);
          }
        } catch (error) {
          // TODO handle error
          throw error;
        }
        break;
      case 'edit':
        try {
          const patchResult = await this.getSignalStore().patch(
            this.item!.id,
            this.getRawValue()
          );
        } catch (error) {
          // TODO handle error
          throw error;
        }
        break;
      default:
        throw new Error(`Operation ${this.operation} not supported`);
    }
  }

  getItemFromRouter() {
    const state: DetailState<T> = history.state;
    const { item } = state;
    this.item = item;
  }

  private async throwNotItemError() {
    throw new Error(
      await lastValueFrom(this._translateFn('NO_ITEM_INFO_PROVIDED'))
    );
  }

  protected mapFormValueToItem(formValue: any): T {
    return formValue;
  }

  protected getRawValue() {
    return removeNullProperties(
      this.mapFormValueToItem(this.detailsForm.getRawValue())
    );
  }
}
