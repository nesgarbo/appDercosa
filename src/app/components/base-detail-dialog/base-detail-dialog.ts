/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/no-output-on-prefix */

import {
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  DetailState,
  DetailsOperation,
} from '../../shared/base-detail';
import { WithId } from '../../shared/with-id';

@Component({
  standalone: true,
  template: '',
})
export abstract class BaseDetailDialog<
  T extends WithId
> implements OnInit
{
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  noRouter = input<boolean>(false);
  operation = signal<DetailsOperation>("show");
  logOperation = effect(() => {
    console.log('operation', this.operation());
  });

  item = input<T | undefined>(undefined);

  logItem = effect(() => {
    console.log('item', this.item());
  } );

  @Output() onDialogClose = new EventEmitter<void>();
  @Output() onItemAdded = new EventEmitter<T>();

  protected modalController = inject(ModalController);

  protected modal: HTMLIonModalElement | undefined;


  constructor() {}

  abstract getDialog(): any;

  ngOnInit() {
    console.log('ngOnInit BDD');
    this.route.data.subscribe(data => {
      this.operation.set(data['operation']);
      console.log('Operation:', this.operation);
    });
    this.showDialog();
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter BDD');
  }

  protected getItemFromRouter() {
    const state: DetailState<T> = history.state;
    const { item } = state;
    return item;
  }

  protected getImagesFromRouter() {
    const state = history.state;
    const { images } = state;
    return images;
  }

  private async showDialog() {
    console.log('showDialog');
    this.modal = await this.getDialog();
    console.log('modal', this.modal);
    this.modal?.present();
    await this.modal?.onDidDismiss();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected getComponentProps() {
    console.log('getComponentProps');
    const operation = this.operation();
    return {
      ...(operation === 'edit' && { item: this.item() }),
      operation,
    };
  }
}
